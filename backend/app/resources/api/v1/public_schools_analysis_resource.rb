module Api
  module V1
    class PublicSchoolsAnalysisResource < BaseResource
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
        :future_enrollment_new_housing,
    
        :school_buildings,
        :sca_projects,
    
        :doe_util_changes,
      )
    
      has_one :project
      has_one :data_package
      has_one :subdistricts_geojson
      
      def multipliers
        multiplier_version = data_package.version == "november_2017" ? "march-2014" : "november-2018"
        
        file_path = Rails.root.join('public', 'ceqr-manual', 'public-schools', "#{multiplier_version}.json").to_s
        file = File.read(file_path)
        JSON.parse(file)
      end
    
      def new_data_available
        DataPackage.latest_for('public_schools').id != data_package.id
      end
    end
  end
end
