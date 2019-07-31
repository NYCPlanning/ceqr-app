class PublicSchoolsAnalysis < ApplicationRecord

  after_create :set_subdistricts
  after_create :set_es_school_choice
  after_create :set_is_school_choice
  # after_create :set_subdistrict_attributes
  after_create :set_bluebook
  after_create :set_lcgms
  after_create :set_sca_projects
  after_create :set_future_enrollment_multipliers
  after_create :set_hs_projections
  after_create :set_future_enrollment_projections
  after_create :set_hs_students_from_housing
  after_create :set_future_enrollment_new_housing
  after_create :set_doe_util_changes
  # Missing set_subdistricts on project update

  belongs_to :project
  belongs_to :data_package

# for future data_package refactor
# self.data_package.schemas["sca_bluebook"]["table"]


### SUBDISTRICTS FROM DB
# array of objects --> district & subdistrict info
  def set_subdistricts
    subdistricts = CeqrData::SchoolSubdistrict.version(testVersionSubdistrict).intersecting_with_bbls(project.bbls_geom)

    self.subdistricts_from_db = subdistricts.map do |sd|
      {
        district: sd[:district].to_s,
        subdistrict: sd[:subdistrict].to_s,
        id: "#{sd[:district]}#{sd[:subdistrict]}",
        sdName: "District #{sd[:district]} - Subdistrict #{sd[:subdistrict]}"
      }
    end

    self.save!
  end

  ### PRIMARY SCHOOL CHOICE
  # boolean for whether project is within a school choice zone
  def set_es_school_choice
    subdistricts = CeqrData::SchoolSubdistrict.version(testVersionSubdistrict).for_subdistrict_pairs(subdistrict_pairs)

    es_school_choice_array = subdistricts.map {|sd| sd[:school_choice_ps]}

    es_school_choice_boolean = es_school_choice_array.include? true

    self.es_school_choice = es_school_choice_boolean

    self.save!
  end

  ### INTERMEDIATE SCHOOL CHOICE
  # boolean for whether project is in a school choice zone
  def set_is_school_choice
    subdistricts = CeqrData::SchoolSubdistrict.version(testVersionSubdistrict).for_subdistrict_pairs(subdistrict_pairs)

    is_school_choice_array = subdistricts.map {|sd| sd[:school_choice_is]}

    is_school_choice_boolean = is_school_choice_array.include? true

    self.is_school_choice = is_school_choice_boolean

    self.save!
  end

### AGGREGATED GEOMETRY OF ALL SUBDISTRICTS FOR PROJECT
  # def set_subdistrict_attributes
  #   sd_pairs = (self.subdistricts_from_db + self.subdistricts_from_user).map { |sd| "(#{sd['district']},#{sd['subdistrict']})" }

  #   self.subdistricts_geom = Db::SchoolSubdistrict.st_union_subdistricts(sd_pairs)
  # end

### BLUEBOOK SCHOOLS
# array of objects --> bluebook is one type of schools database
  def set_bluebook
    # subdistrict_pairs are e.g. "(<district>, <subdistrict>)" and defined in private methods
    ps_schools = CeqrData::ScaBluebook.version(testVersionMost).ps_schools_in_subdistricts(subdistrict_pairs)
    is_schools = CeqrData::ScaBluebook.version(testVersionMost).is_schools_in_subdistricts(subdistrict_pairs)
    hs_schools = CeqrData::ScaBluebook.version(testVersionMost).high_schools_in_boro(project.boroIntegers)

    # new_bluebook resets to an empty array each time bluebook database is queried
    # e.g. a user adds a BBL to their project within a different school subdistrict
    # we then PUSH data for schools that already exist in the app's memory (reformatted) to new_bluebook_array
    # we also reformat and PUSH data for schools that did not previously exist in the app's memory to new_bluebook_array
    # so the array is wiped out and repopulated every time
    new_bluebook_array = []

    # for schools that are ISHS or PSIS, we will list the building ID TWICE
    # BUT one object will have the ps/is/hs values and the other building ID
    # will have the values of the other school type
    # ex. two objects with the same building ID, one object with 'ps' values and one object with 'is' values
    create_new_schools(ps_schools, 'ps', new_bluebook_array)
    create_new_schools(is_schools, 'is', new_bluebook_array)
    create_new_schools(hs_schools, 'hs', new_bluebook_array)

    # set our analysis.bluebook to the populated new_bluebook_array
    self.bluebook = new_bluebook_array

    self.save!
  end

### LCGMS SCHOOLS
# array of objects --> lcgms is another type of schools database
  def set_lcgms
    # subdistrict_pairs are e.g. "(<district>, <subdistrict>)" and defined in private methods
    subdistricts = CeqrData::SchoolSubdistrict.version(testVersionSubdistrict).for_subdistrict_pairs(subdistrict_pairs)

    # set new this array to empty each time database is queried
    new_lcgms_array = []

    # LCGMS data does not have districts and subdistricts, so we have to loop through each subdistrict,
    # and check whether a school intersects the subdistrict's geom
    # in the final object, district and subdistrict values come from the subdistricts table
    subdistricts.each do |subdistrict|
      subdistrict_geom = subdistrict[:geom]

      lcgms_schools = CeqrData::LcgmsSchool.version(testVersionMost).lcgms_intersecting_subdistrict_geom(subdistrict_geom)

      lcgms_schools.each do |school|
        # LCGMS data also does not have borocode
        # lcgms_borocode_lookup is defined in private methods
        borocode = lcgms_borocode_lookup(school[:bldg_id])

        # here we push the reformatted objects into new_lcgms_array
        # for school_object_lcgms (defined in private methods) we have four arguments:
        # 1-the school object that we query the database for,
        # 2-the subdistrict object that we query the database for (this is used to populate the district & subdistrict properties)
        # 3-the level of the school (e.g. 'ps'), 4-the borocde which is found through lcgms_borocode_lookup
        if school[:org_level] === 'PS' || school[:org_level] === 'PSIS' || school[:org_level] === 'PK'
          new_lcgms_array << school_object_lcgms(school, subdistrict, 'ps', borocode)
        elsif school[:org_level] === 'IS' || school[:org_level] === 'PSIS' || school[:org_level] === 'ISHS'
          new_lcgms_array << school_object_lcgms(school, subdistrict, 'is', borocode)
        elsif school[:org_level] === 'HS' || school[:org_level] === 'ISHS'
          new_lcgms_array << school_object_lcgms(school, subdistrict, 'hs', borocode)
        end
      end
    end

    self.lcgms = new_lcgms_array

    self.save!
  end

### SCA PROJECTS SCHOOLS
# array of objects --> schools that are currently under construction by the SCA
  def set_sca_projects
    # subdistrict_pairs are e.g. "(<district>, <subdistrict>)" and defined in private methods
    subdistricts = CeqrData::SchoolSubdistrict.version(testVersionSubdistrict).for_subdistrict_pairs(subdistrict_pairs)

    # set new this array to empty each time database is queried
    new_sca_projects_array = []

    # LCGMS data does not have districts and subdistricts, so we have to loop through each subdistrict,
    # and check whether a school intersects the subdistrict's geom
    # in the final object, district and subdistrict values come from the subdistricts table
    subdistricts.each do |subdistrict|
      subdistrict_geom = subdistrict[:geom]

      sca_schools = CeqrData::ScaCapitalProject.version(testVersionMost).sca_projects_intersecting_subdistrict_geom(subdistrict_geom)

      # here we push the reformatted objects into new_sca_projects_array
      # for school_object_lcgms (defined in private methods) we have two arguments:
      # 1-the school object that we query the database for,
      # 2-the subdistrict object that we query the database for (this is used to populate the district & subdistrict properties)
      sca_schools.each do |school|
          new_sca_projects_array << school_object_sca_projects(school, subdistrict)
        end
      end

    self.sca_projects = new_sca_projects_array

    self.save!
  end

### FUTURE ENROLLMENT MULTIPLIERS
# array of objects with "multiplier" values based on subdistrict, district, & level
  def set_future_enrollment_multipliers
    # subdistrict_pairs are e.g. "(<district>, <subdistrict>)" and defined in private methods
    enrollment_pct_by_sd = CeqrData::ScaEnrollmentPctBySd.version(testVersionMost).enrollment_percent_by_subdistrict(subdistrict_pairs)

    self.future_enrollment_multipliers = enrollment_pct_by_sd.map do |em|
      {
        level: em[:level],
        district: em[:district].to_s,
        subdistrict: em[:subdistrict].to_s,
        multiplier: em[:multiplier]
      }
    end

    self.save!

  end

### HS PROJECTIONS
# array of objects --> number of high school students projected in a borough by a certain year
  def set_hs_projections
  # buildYearMaxed is defined in private methods
  enrollment_projection_by_boro = CeqrData::ScaEnrollmentProjectionsByBoro.version(testVersionMost).enrollment_projection_by_boro_for_year(buildYearMaxed.to_s, project.borough)
  #
  self.hs_projections = enrollment_projection_by_boro.map do |pr|
    {
      hs: pr[:hs],
      year: pr[:year],
      borough: pr[:borough]
    }
  end

  self.save!

end

### FUTURE ENROLLMENT PROJECTIONS
# array of objects --> number of primary & intermediate school students projected in a subdistrict by a certain year
def set_future_enrollment_projections
  # both subdistrict from database and subdistricts input by the user
  subdistricts = self.subdistricts_from_db + self.subdistricts_from_user

  districts = subdistricts.map { |d| d['district'] }

  enrollment_projection_by_district = CeqrData::ScaEnrollmentProjectionsBySd.version(testVersionMost).enrollment_projection_by_subdistrict_for_year(buildYearMaxed, districts)

  self.future_enrollment_projections = enrollment_projection_by_district.map do |pr|
    {
      ps: pr[:ps],
      is: pr[:is],
      district: pr[:district],
      school_year: pr[:school_year]
    }
  end

  self.save!

end

### HS STUDENTS FROM HOUSING
# value --> number of high school students added by new housing that will be built within same borough(s) as project
# this housing is SEPARATE from the housing added by the user's project
def set_hs_students_from_housing
  high_school_students_from_housing = CeqrData::HousingPipelineByBoro.version(testVersionMost).high_school_students_from_new_housing_by_boro(project.borough)

  hs_students = high_school_students_from_housing.map{|s| s[:hs_students]}

  self.hs_students_from_housing = hs_students.first

  self.save!

end

### FUTURE ENROLLMENT NEW HOUSING
# array of objects --> number of primary & intermediate students added by new housing that will be built within same subdistrict(s) as project
# this housing is SEPARATE from the housing added by the user's project
def set_future_enrollment_new_housing
  # subdistrict_pairs are e.g. "(<district>, <subdistrict>)" and defined in private methods
  future_enrollment_new_housing_by_subdistrict = CeqrData::HousingPipelineBySd.version(testVersionMost).ps_is_students_from_new_housing_by_subdistrict(subdistrict_pairs)

  self.future_enrollment_new_housing = future_enrollment_new_housing_by_subdistrict.map do |e|
    {
      level: e[:level],
      district: e[:district],
      subdistrict: e[:subdistrict],
      students: e[:students]
    }
  end

  self.save!

end

### DOE UTIL CHANGES
# array of objects --> DOE Significant Utilization Changes
def set_doe_util_changes

  # there is no bldg_id column for sca projects
  buildings = self.bluebook + self.lcgms

  buildings_ids_array = buildings.map {|b| b['bldg_id']}.uniq

  # NO LONGER NEEDED NOW THAT WE'RE USING SEQUEL
  # buildingsBldgIds = buildings_ids_array.map {|b| "'#{b}'"}.join(',')

  doe_significant_utilization_changes = CeqrData::DoeSignificantUtilizationChanges.version(testVersionDoe).doe_util_changes_matching_with_building_ids(buildings_ids_array)

  self.doe_util_changes = doe_significant_utilization_changes.map do |d|
    {
      url: d[:url],
      title: d[:title],
      org_id: d[:org_id],
      bldg_id: d[:bldg_id],
      vote_date: d[:vote_date],
      at_scale_year: d[:at_scale_year],
      at_scale_enroll: d[:at_scale_enroll],
      bldg_id_additional: d[:bldg_id_additional]
    }
  end

  self.save!

end

################################################################################
### PRIVATE METHODS to be used inside methods above

  private

### PRIVATE METHODS FOR BLUEBOOK SCHOOLS

# subdistrict_pairs is used for querying data matching a project's subdistricts
  def subdistrict_pairs
    subdistricts = self.subdistricts_from_db + self.subdistricts_from_user
    subdistricts.map { |sd| "(#{sd['district']},#{sd['subdistrict']})" }
  end

  # IF WE USE OTHER SEQUEL OPTION
  # def subdistrict_pairs
  #   allSubdistricts = self.subdistricts_from_db + self.subdistricts_from_user
  #   districts_subdistricts = allSubdistricts.map do |sd| {district: sd[:district], subdistrict: sd[:subdistrict]} end
  #   # creates array of arrays --> e.g. [[1,2], [15,3]] --> this is used for the Sequel method value_list which checks for an array of arrays
  #   # that function as pairs (NEED TO EXPLAIN MORE HERE?)
  #   districts_subdistricts.map {|sd| sd.values}
  # end

  # finds the first object in the bluebook array that matches org_id, bldg_id, level, and dataVersion of
  # the new data grabbed from the database (e.g. ps_schools)
  def find_existing_bluebook_school(schools, level)
    self.bluebook.find {|bluebook| bluebook[:org_id] == schools[:org_id] && bluebook[:bldg_id] == schools[:bldg_id] && bluebook[:level] == level && x[:dataVersion] == data_tables['version']}
  end

  # formats the data into a object with reformatted properties
  # because some of intermediate level schools are named with "ms" rather than "is",
  # we check that if "is" is passed in as the level, it searches for "ms" when populating values
  def school_object_bluebook(school, level)
    level == "is" ? db_level = "ms" : db_level = level

    {
      name: school[:name],
      org_id: school[:org_id],
      bldg_id: school[:bldg_id],
      level: level,
      district: school[:district].to_s,
      subdistrict: school[:subdistrict].to_s,
      source: 'bluebook',
      capacity: school["#{db_level}_capacity"],
      capacityFuture: school["#{db_level}_capacity"],
      enroll: school["#{db_level}_enroll"],
    address: school[:address],
      bldg_name: school[:bldg_name],
      borocode: school[:borocode],
      excluded: school[:excluded],
      dataVersion: data_tables['version']
    }
  end

  # create_new_schools iterates through a school type from the database (e.g. ps_schools)
  # if an object already exists (matches bldg_id, org_id, dataVersion and level),
  # this already-reformatted object is pushed into new_bluebook_array
  # if the object does not already exist, it is formatted by school_objects() and then pushed into the array
  def create_new_schools(new_level_school, level, new_bluebook_array)
    new_level_school.each do |school|
          existing = find_existing_bluebook_school(school, level)

          if existing
            new_bluebook_array << existing
          else
            new_bluebook_array << school_object_bluebook(school, level)
          end
      end
    end

################################################################################
### PRIVATE METHODS FOR LCGMS SCHOOLS

# the lcgms database does not have columns for district, subdsitrict, or borocode
# the string in column "bldg_id" is prefaced with a letter that denotes which borough the building is in
# (this is more reliable than "org_id" because "bldg_id" is more specific)
  def lcgms_borocode_lookup(bldg_id)
     # grab first letter of bldg_id
      borocode = bldg_id.gsub(/^[a-zA-Z]/)

      case borocode.first
      when 'M' then '1' #Manhattan
      when 'X' then '2' #Bronx
      when 'K' then '3' #Brooklyn
      when 'Q' then '4' #Queens
      when 'S' then '5' #Staten Island
      end
  end

# lcgms capacity is input by the user
# if the database is queried again, and a user has already input a value,
# we check for this as previousSaved, and populate the capacity property with this value
# otherwise the capacity property is an empty string
  def lcgmsCapacity
    previousSaved = self.lcgms.find{|lcgms| lcgms[:org_id] == school[:org_id]}
    previousSaved ? previousSaved['capacity'] : ''
  end

# "school" is the new queried data,
# "district_source" is the subdistricts object queried from the database that matches subdistricts_pair
# "level" is ps, is, or hs
# borocode is determined from lcgms_borocode_lookup
  def school_object_lcgms(school, district_source, level, borocode)
    {
      name: school[:name],
      org_id: school[:org_id],
      bldg_id: school[:bldg_id],
      level: level,
      grades: school[:grades],
      district: district_source[:district].to_s,
      subdistrict: district_source[:subdistrict].to_s,
      source: 'lcgms',
      enroll: school["#{level}_enroll"],
      capacity: lcgmsCapacity,
      address: school[:address],
      borocode: borocode,
      dataVersion: data_tables['version']
    }
  end

################################################################################
### PRIVATE METHODS FOR SCA SCHOOLS

# checks whether the new queried data ("school") matches sca_projects already saved in model
  def find_existing_sca_projects(school)
    self.sca_projects.find {|sca_projects| sca_projects[:project_dsf] == school[:project_dsf]}
  end

  def school_object_sca_projects(school, district_source)
    existing = find_existing_sca_projects(school)

    # populates four properties based on whether data already exists for that sca_project object
    ps_capacity = existing ? existing[:ps_capacity] : (school[:guessed_pct] ? 0 : school[:capacity] * school[:pct_ps])
    is_capacity = existing ? existing[:is_capacity] : (school[:guessed_pct] ? 0 : school[:capacity] * school[:pct_is])
    hs_capacity = existing ? existing[:hs_capacity] : (school[:guessed_pct] ? 0 : school[:capacity] * school[:pct_hs])
    includeInCapacity = existing ? existing[:includeInCapacity] : false

    {
      name: school[:name],
      project_dsf: school[:project_dsf],
      org_level: school[:org_level],
      district: district_source[:district].to_s,
      subdistrict: district_source[:subdistrict].to_s,
      source: 'SCA Projects',
      ps_capacity: ps_capacity,
      is_capacity: is_capacity,
      hs_capacity: hs_capacity,
      includeInCapacity: includeInCapacity,
      dataVersion: data_tables['version']
    }
  end

################################################################################
### PRIVATE METHODS FOR HS_PROJECTIONS & FUTURE_ENROLLMENT_PROJECTIONS

  def buildYearMaxed
    projectionsOverMax = project.build_year > data_tables['enrollmentProjectionsMaxYear']

    projectionsOverMax == true ? data_tables['enrollmentProjectionsMaxYear'] : project.build_year
  end

### TEST VERSIONS

def testVersionSubdistrict
  '2017'
end

def testVersionMost
  '2018'
end

def testVersionDoe
  '062018'
end

end
