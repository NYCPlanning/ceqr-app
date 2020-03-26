class PublicSchoolsAnalysis < ApplicationRecord
  before_create :compute_for_project_create_or_update
  after_create :create_subdistricts_geojson!
  
  before_update :compute_for_project_create_or_update,
    if: Proc.new { data_package_id_changed? || subdistricts_from_user_changed? }

  belongs_to :project
  belongs_to :data_package
  has_one :subdistricts_geojson, dependent: :destroy

  def compute_for_updated_bbls!
    compute_for_project_create_or_update
    save!
  end

  def subdistricts
    CeqrData::DoeSchoolSubdistricts.version(
      data_package.table_for("doe_school_subdistricts")
    ).for_subdistrict_pairs(
      subdistrict_pairs
    )
  end

  private

  def create_subdistricts_geojson!
    create_subdistricts_geojson
  end

  def compute_for_project_create_or_update
    set_subdistricts_from_db
    set_es_school_choice
    set_is_school_choice
    set_ceqr_school_buildings
    set_sca_projects
    set_hs_projections
    set_future_enrollment_projections
    set_hs_students_from_housing
    set_future_enrollment_new_housing
    set_doe_util_changes
  end

  def subdistrict_pairs
    subdistricts = self.subdistricts_from_db + self.subdistricts_from_user
    subdistricts.map { |sd| "(#{sd['district'].to_i},#{sd['subdistrict'].to_i})" }
  end

  def set_subdistricts_from_db     
    sd = CeqrData::DoeSchoolSubdistricts.version(
      data_package.table_for("doe_school_subdistricts")
    ).intersecting_with_bbls(
      project.bbls_geom
    )

    self.subdistricts_from_db = sd.map do |sd|
      {
        district: sd[:district],
        subdistrict: sd[:subdistrict],
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

### CEQR_SCHOOL_BUILDINGS SCHOOLS
# array of objects --> each object as a school
# combined bluebook and lcgms datasets to make ceqr_school_buildings dataset
  def set_ceqr_school_buildings
    # subdistrict_pairs are e.g. "(<district>, <subdistrict>)" and defined in private methods
    db = CeqrData::CeqrSchoolBuildings.version(data_package.table_for("ceqr_school_buildings"))
    
    ps_schools = db.primary_schools_in_subdistricts(subdistrict_pairs)
    is_schools = db.intermediate_schools_in_subdistricts(subdistrict_pairs)
    hs_schools = db.high_schools_in_boro(project.boro_code)

    # new_schools_array resets to an empty array each time ceqr_school_buildings database is queried
    # e.g. a user adds a BBL to their project within a different school subdistrict
    # we then PUSH data for schools that already exist in the app's memory (reformatted) to new_schools_array
    # we also reformat and PUSH data for schools that did not previously exist in the app's memory to new_schools_array
    # so the array is wiped out and repopulated every time
    new_schools_array = []

    # for schools that are ISHS or PSIS, we will list the building ID TWICE
    # BUT one object will have the ps/is/hs values and the other building ID
    # will have the values of the other school type
    # ex. two objects with the same building ID, one object with 'ps' values and one object with 'is' values
    create_new_schools(ps_schools, 'ps', new_schools_array)
    create_new_schools(is_schools, 'is', new_schools_array)
    create_new_schools(hs_schools, 'hs', new_schools_array)

    # set our analysis.ceqr_school_buildings to the populated new_schools_array
    self.ceqr_school_buildings = new_schools_array
  end

### SCA PROJECTS SCHOOLS
# array of objects --> schools that are currently under construction by the SCA
  def set_sca_projects
    # set new this array to empty each time database is queried
    new_sca_projects_array = []

    # SCA data does not have districts and subdistricts, so we have to loop through each subdistrict,
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
      # for school_object_sca_projects (defined in private methods) we have two arguments:
      # 1-the school object that we query the database for,
      # 2-the subdistrict object that we query the database for (this is used to populate the district & subdistrict properties)
      sca_schools.each do |school|
          new_sca_projects_array << school_object_sca_projects(school, subdistrict)
        end
      end

    self.sca_projects = new_sca_projects_array
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
  buildings = self.ceqr_school_buildings

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

### PRIVATE METHODS FOR CEQR_SCHOOL_BUILDINGS

  # finds the first object in the schools array that matches org_id, bldg_id, level, and dataVersion of
  # the new data grabbed from the database (e.g. ps_schools)
  def find_existing_school_building(existing_schools, level)
    self.ceqr_school_buildings.find {|school_building| school_building[:org_id] == existing_schools[:org_id] && school_building[:bldg_id] == existing_schools[:bldg_id] && school_building[:level] == level}
  end

  # formats the data into a object with reformatted properties
  # because some of intermediate level schools are named with "ms" rather than "is",
  # we check that if "is" is passed in as the level, it searches for "ms" when populating values
  def school_object(school, level)
    level == "is" ? db_level = "ms" : db_level = level

    {
      name: school[:name],
      org_id: school[:org_id],
      bldg_id: school[:bldg_id],
      level: level,
      district: school[:district],
      subdistrict: school[:subdistrict],
      source: school[:source],
      capacity: school["#{db_level}_capacity".to_sym],
      capacityFuture: school["#{db_level}_capacity".to_sym],
      enroll: school["#{db_level}_enroll".to_sym],
      address: school[:address],
      bldg_name: school[:bldg_name],
      borocode: school[:borocode],
      excluded: school[:excluded],
      geojson: RGeo::GeoJSON.encode(
        RGeo::GeoJSON::Feature.new(
          RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(school[:geom])
        )
      )
    }
  end

  # create_new_schools iterates through a school type from the database (e.g. ps_schools)
  # if an object already exists on the frontend (matches bldg_id, org_id, dataVersion and level),
  # this already-reformatted object is pushed into new_schools_array
  # if the object does not already exist on the frontend, it is formatted by school_objects() and then pushed into the array
  def create_new_schools(new_level_school, level, new_schools_array)
    new_level_school.each do |school|
      existing = find_existing_school_building(school, level)

      if existing
        new_schools_array << existing
      else
        new_schools_array << school_object(school, level)
      end
    end
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
      district: district_source[:district],
      subdistrict: district_source[:subdistrict],
      source: 'scaprojects',
      capacity: school[:capacity],
      guessed_pct: school[:guessed_pct],
      ps_capacity: ps_capacity,
      is_capacity: is_capacity,
      hs_capacity: hs_capacity,
      planned_end_date: school[:planned_end_date],
      pct_funded: school[:pct_funded],
      funding_previous: school[:funding_previous],
      funding_current_budget: school[:funding_current_budget],
      total_est_cost: school[:total_est_cost],

      includeInCapacity: includeInCapacity,
      geojson: RGeo::GeoJSON.encode(
        RGeo::GeoJSON::Feature.new(
          RGeo::WKRep::WKBParser.new(nil, support_ewkb: true).parse(school[:geom])
        )
      )
    }
  end

################################################################################
### PRIVATE METHODS FOR HS_PROJECTIONS & FUTURE_ENROLLMENT_PROJECTIONS

  def buildYearMaxed    
    maxYear = data_package.schemas["sca_enrollment_projections_by_sd"]["maxYear"]

    project.build_year > maxYear ? maxYear : project.build_year
  end

end