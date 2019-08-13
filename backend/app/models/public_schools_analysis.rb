class PublicSchoolsAnalysis < ApplicationRecord
  before_create :compute_for_project_create_or_update

  belongs_to :project
  belongs_to :data_package

  def compute_for_project_create_or_update
    set_subdistricts_from_db
    set_es_school_choice
    set_is_school_choice
    set_bluebook
    set_lcgms
    set_sca_projects
    set_future_enrollment_multipliers
    set_hs_projections
    set_future_enrollment_projections
    set_hs_students_from_housing
    set_future_enrollment_new_housing
    set_doe_util_changes
  end

  def subdistricts
    @subdistricts ||= CeqrData::DoeSchoolSubdistricts.version(
      data_package.table_for("doe_school_subdistricts")
    ).for_subdistrict_pairs(
      subdistrict_pairs
    )
  end

  private

  def subdistrict_pairs
    subdistricts = self.subdistricts_from_db + self.subdistricts_from_user
    subdistricts.map { |sd| "(#{sd['district']},#{sd['subdistrict']})" }
  end

  def set_subdistricts_from_db     
    sd = CeqrData::DoeSchoolSubdistricts.version(
      data_package.table_for("doe_school_subdistricts")
    ).intersecting_with_bbls(
      project.bbls_geom
    )

    self.subdistricts_from_db = sd.map do |sd|
      {
        district: sd[:district].to_s,
        subdistrict: sd[:subdistrict].to_s,
        id: "#{sd[:district]}#{sd[:subdistrict]}",
        sdName: "District #{sd[:district]} - Subdistrict #{sd[:subdistrict]}"
      }
    end
  end

  ### PRIMARY SCHOOL CHOICE
  # boolean for whether project is within a school choice zone
  def set_es_school_choice
    es_school_choice_array = subdistricts.map {|sd| sd[:school_choice_ps]}

    self.es_school_choice = es_school_choice_array.include? true
  end

  ### INTERMEDIATE SCHOOL CHOICE
  # boolean for whether project is in a school choice zone
  def set_is_school_choice
    is_school_choice_array = subdistricts.map {|sd| sd[:school_choice_is]}

    self.is_school_choice = is_school_choice_array.include? true
  end

### BLUEBOOK SCHOOLS
# array of objects --> bluebook is one type of schools database
  def set_bluebook
    # subdistrict_pairs are e.g. "(<district>, <subdistrict>)" and defined in private methods
    db = CeqrData::ScaBluebook.version(data_package.table_for("sca_bluebook"))
    
    ps_schools = db.ps_schools_in_subdistricts(subdistrict_pairs)
    is_schools = db.is_schools_in_subdistricts(subdistrict_pairs)
    hs_schools = db.high_schools_in_boro(project.boroIntegers)

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
  end

### LCGMS SCHOOLS
# array of objects --> lcgms is another type of schools database
  def set_lcgms
    # set new this array to empty each time database is queried
    new_lcgms_array = []

    # LCGMS data does not have districts and subdistricts, so we have to loop through each subdistrict,
    # and check whether a school intersects the subdistrict's geom
    # in the final object, district and subdistrict values come from the subdistricts table
    subdistricts.each do |subdistrict|
      subdistrict_geom = subdistrict[:geom]

      lcgms_schools = CeqrData::DoeLcgms.version(
        data_package.table_for("doe_lcgms")
      ).lcgms_intersecting_subdistrict_geom(
        subdistrict_geom
      )

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
  end

### SCA PROJECTS SCHOOLS
# array of objects --> schools that are currently under construction by the SCA
  def set_sca_projects
    # set new this array to empty each time database is queried
    new_sca_projects_array = []

    # LCGMS data does not have districts and subdistricts, so we have to loop through each subdistrict,
    # and check whether a school intersects the subdistrict's geom
    # in the final object, district and subdistrict values come from the subdistricts table
    subdistricts.each do |subdistrict|
      subdistrict_geom = subdistrict[:geom]

      sca_schools = CeqrData::ScaCapitalProjects.version(
        data_package.table_for("sca_capital_projects")
      ).sca_projects_intersecting_subdistrict_geom(
        subdistrict_geom
      )

      # here we push the reformatted objects into new_sca_projects_array
      # for school_object_lcgms (defined in private methods) we have two arguments:
      # 1-the school object that we query the database for,
      # 2-the subdistrict object that we query the database for (this is used to populate the district & subdistrict properties)
      sca_schools.each do |school|
          new_sca_projects_array << school_object_sca_projects(school, subdistrict)
        end
      end

    self.sca_projects = new_sca_projects_array
  end

### FUTURE ENROLLMENT MULTIPLIERS
# array of objects with "multiplier" values based on subdistrict, district, & level
  def set_future_enrollment_multipliers
    # subdistrict_pairs are e.g. "(<district>, <subdistrict>)" and defined in private methods
    enrollment_pct_by_sd = CeqrData::ScaEnrollmentPctBySd.version(
      data_package.table_for("sca_enrollment_pct_by_sd")
    ).enrollment_percent_by_subdistrict(
      subdistrict_pairs
    )

    self.future_enrollment_multipliers = enrollment_pct_by_sd.map do |em|
      {
        level: em[:level],
        district: em[:district].to_s,
        subdistrict: em[:subdistrict].to_s,
        multiplier: em[:multiplier]
      }
    end
  end

### HS PROJECTIONS
# array of objects --> number of high school students projected in a borough by a certain year
  def set_hs_projections
  # buildYearMaxed is defined in private methods
  enrollment_projection_by_boro = CeqrData::ScaEnrollmentProjectionsByBoro.version(
    data_package.table_for("sca_enrollment_projections_by_boro")
  ).enrollment_projection_by_boro_for_year(
    buildYearMaxed.to_s, project.borough
  )

  self.hs_projections = enrollment_projection_by_boro.map do |pr|
    {
      hs: pr[:hs],
      year: pr[:year],
      borough: pr[:borough]
    }
  end
end

### FUTURE ENROLLMENT PROJECTIONS
# array of objects --> number of primary & intermediate school students projected in a subdistrict by a certain year
def set_future_enrollment_projections
  # both subdistrict from database and subdistricts input by the user
  subdistricts = self.subdistricts_from_db + self.subdistricts_from_user

  districts = subdistricts.map { |d| d['district'] }

  enrollment_projection_by_district = CeqrData::ScaEnrollmentProjectionsBySd.version(
    data_package.table_for("sca_enrollment_projections_by_sd")
  ).enrollment_projection_by_subdistrict_for_year(buildYearMaxed, districts)

  self.future_enrollment_projections = enrollment_projection_by_district.map do |pr|
    {
      ps: pr[:ps],
      ms: pr[:is], # this is legacy and should change to 'is'
      district: pr[:district],
      school_year: pr[:school_year]
    }
  end
end

### HS STUDENTS FROM HOUSING
# value --> number of high school students added by new housing that will be built within same borough(s) as project
# this housing is SEPARATE from the housing added by the user's project
def set_hs_students_from_housing
  high_school_students_from_housing = CeqrData::ScaHousingPipelineByBoro.version(
    data_package.table_for("sca_housing_pipeline_by_boro")
  ).high_school_students_from_new_housing_by_boro(project.borough)

  hs_students = high_school_students_from_housing.map{|s| s[:hs_students]}

  self.hs_students_from_housing = hs_students.first
end

### FUTURE ENROLLMENT NEW HOUSING
# array of objects --> number of primary & intermediate students added by new housing that will be built within same subdistrict(s) as project
# this housing is SEPARATE from the housing added by the user's project
def set_future_enrollment_new_housing
  # subdistrict_pairs are e.g. "(<district>, <subdistrict>)" and defined in private methods
  future_enrollment_new_housing_by_subdistrict = CeqrData::ScaHousingPipelineBySd.version(
    data_package.table_for("sca_housing_pipeline_by_sd")
  ).ps_is_students_from_new_housing_by_subdistrict(subdistrict_pairs)

  self.future_enrollment_new_housing = future_enrollment_new_housing_by_subdistrict.map do |e|
    {
      level: e[:level],
      district: e[:district],
      subdistrict: e[:subdistrict],
      students: e[:students]
    }
  end
end

### DOE UTIL CHANGES
# array of objects --> DOE Significant Utilization Changes
def set_doe_util_changes

  # there is no bldg_id column for sca projects
  buildings = self.bluebook + self.lcgms

  buildings_ids_array = buildings.map {|b| b['bldg_id']}.uniq

  doe_significant_utilization_changes = CeqrData::DoeSignificantUtilizationChanges.version(
    data_package.table_for("doe_significant_utilization_changes")
  ).doe_util_changes_matching_with_building_ids(buildings_ids_array)

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
end

### PRIVATE METHODS FOR BLUEBOOK SCHOOLS

  # finds the first object in the bluebook array that matches org_id, bldg_id, level, and dataVersion of
  # the new data grabbed from the database (e.g. ps_schools)
  def find_existing_bluebook_school(schools, level)
    self.bluebook.find {|bluebook| bluebook[:org_id] == schools[:org_id] && bluebook[:bldg_id] == schools[:bldg_id] && bluebook[:level] == level}
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
      capacity: school["#{db_level}_capacity".to_sym],
      capacityFuture: school["#{db_level}_capacity".to_sym],
      enroll: school["#{db_level}_enroll".to_sym],
      address: school[:address],
      bldg_name: school[:bldg_name],
      borocode: school[:borocode],
      excluded: school[:excluded]
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
      borocode: borocode
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
      includeInCapacity: includeInCapacity
    }
  end

################################################################################
### PRIVATE METHODS FOR HS_PROJECTIONS & FUTURE_ENROLLMENT_PROJECTIONS

  def buildYearMaxed    
    maxYear = data_package.schemas["sca_enrollment_projections_by_sd"]["maxYear"]

    project.build_year > maxYear ? maxYear : project.build_year
  end

end
