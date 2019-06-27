class PublicSchoolsAnalysis < ApplicationRecord
  after_create :set_subdistricts
  after_create :set_bluebook
  # Missing set_subdistricts on project update

  belongs_to :project
  belongs_to :data_package

  def set_subdistricts
    subdistricts = Db::SchoolSubdistrict.intersecting_with(project.bbls_geom)

    self.subdistricts_from_db = subdistricts.map do |s|
      {
        district: s[:district],
        subdistrict: s[:subdistrict],
        id: "#{s[:district]}#{s[:subdistrict]}",
        sdName: "District #{s[:district]} - Subdistrict #{s[:subdistrict]}"
      }
    end

    self.save!
  end

  def set_bluebook
    subdistricts = self.subdistricts_from_db

    district_subdistrict_pairs = subdistricts.map { |sd| "(#{sd['district']},#{sd['subdistrict']})" }

    ps_schools = Db::BluebookSchool.ps_in_subdistricts(district_subdistrict_pairs)
    is_schools = Db::BluebookSchool.is_in_subdistricts(district_subdistrict_pairs)
    hs_schools = Db::BluebookSchool.high_schools_in_boro(project.boroIntegers)

    # new_bluebook resets to an empty array each time the bluebook data "grab" is triggered
    # e.g. a user adds a BBL to their project within a different school subdistrict
    # we then PUSH data for schools that already exist in the app's memory (reformatted) to the new_bluebook array
    # we also reformat and PUSH data for schools that did not previously exist in the app's memory to the new_bluebook array
    # so the array is wiped out and repopulated every time
    new_bluebook = []

    # for schools that are ISHS or PSIS, we will list the building ID TWICE
    # BUT one object will have the ps/is/hs values and the other building ID
    # will have the values of the other school TYPE
    # ex. two objects with the same building ID, one object with 'ps' values and one object with 'is' values
    create_new_schools(ps_schools, 'ps', new_bluebook)
    create_new_schools(is_schools, 'is', new_bluebook)
    create_new_schools(hs_schools, 'hs', new_bluebook)

    # set our analysis.bluebook to the populated new_bluebook array
    self.bluebook = new_bluebook

    self.save!
  end


### PRIVATE METHODS

  private

  # finds the first object in the bluebook array that matches org_id, bldg_id, level, and dataVersion of
  # the new data grabbed from the database (e.g. ps_schools)
  def find_existing_bluebook_school(school, level)
    self.bluebook.find {|x| x[:org_id] == school[:org_id] && x[:bldg_id] == school[:bldg_id] && x[:level] == level && x[:dataVersion] == data_tables['version']}
  end

  # create_new_schools iterates through a school type from the database (e.g. ps_schools)
  # if an object already exists (matches bldg_id, org_id, dataVersion and level),
  # this object is pushed into the new_bluebook array
  # if the object does not already exist, it is formatted by school_objects() and pushed into the array
  def create_new_schools(level_school, level, new_bluebook)
    level_school.each do |s|
          existing = find_existing_bluebook_school(s, level)

          if existing
            new_bluebook << existing
          else
            new_bluebook << school_object(s, level)
          end
      end
    end

    # formats the data into a hash with reformatted properties
    # because some of intermediate level schools are named with "ms" rather than "is"
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
end
