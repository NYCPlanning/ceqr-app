class Api::V1::PublicSchoolsAnalysisResource < JSONAPI::Resource
  attributes(
    :multipliers,
    :new_data_available,

    :es_school_choice,
    :is_school_choice,

    :subdistricts_from_db,
    :subdistricts_from_user,

    :residential_developments,
    :schools_with_action,

    :hs_projections,
    :hs_students_from_housing,

    :future_enrollment_projections,
    :future_enrollment_multipliers,
    :future_enrollment_new_housing,

    :bluebook,
    :lcgms,
    :sca_projects,

    :doe_util_changes,

    # computed geojson
    :subdistricts_geojson,
    :bluebook_geojson,
    :lcgms_geojson
  )

  has_one :project
  has_one :data_package
  
  def multipliers
    multiplier_version = data_package.version == "november_2017" ? "march-2014" : "november-2018"
    
    file_path = Rails.root.join('public', 'ceqr-manual', 'public-schools', "#{multiplier_version}.json").to_s
    file = File.read(file_path)
    JSON.parse(file)
  end

  def new_data_available
    DataPackage.latest_for('public_schools').id != data_package.id
  end

  def subdistricts_geojson    
    RGeo::GeoJSON.encode(
      RGeo::GeoJSON::FeatureCollection.new(  
        @model.subdistricts.map do |sd|
          RGeo::GeoJSON::Feature.new(sd[:geom])
        end
      )
    )
  end

  def bluebook_geojson

  end

  def lcgms_geojson

  end
end
