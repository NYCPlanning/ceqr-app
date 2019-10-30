module Api
  module V1
    class ProjectResource < BaseResource
      after_create :set_project_permissions
      after_save :set_updated_by
      
      attributes(
        :view_only, #computed
      
        :name,
        :build_year,
        
        :bbls,
        :bbls_version,
        :bbls_geojson, #computed
    
        :ceqr_number,
        :borough,
        :boro_code,
      
        :created_at,
        :updated_at,
        :updated_by,
    
        # Analysis Framework
        :total_units,
        :senior_units,
        :affordable_units,
    
        :commercial_land_use,
        :industrial_land_use,
        :community_facility_land_use,
        :parking_land_use
      ) 
    
      has_many :editors, relation_name: :editors
      has_many :viewers, relation_name: :viewers
      has_many :project_permissions
    
      relationship :public_schools_analysis, to: :one, foreign_key_on: :related
      relationship :transportation_analysis, to: :one, foreign_key_on: :related
      relationship :community_facilities_analysis, to: :one, foreign_key_on: :related
    
      def view_only
        self.viewers.map(&:id).include? current_user.id
      end
    
      def bbls_geojson
        RGeo::GeoJSON.encode(
          RGeo::GeoJSON::FeatureCollection.new(
            [RGeo::GeoJSON::Feature.new(@model.bbls_geom)]
          )
        )
      end
    
      def self.updatable_fields(context)
        super - [:created_at, :updated_at, :updated_by, :view_only]
      end
    
      private
    
      def current_user
        @context.fetch(:user)
      end
    
      def set_project_permissions
        ProjectPermission.create!({
          project_id: @model.id,
          user_id: current_user.id,
          permission: "editor"
        })
      end
    
      def set_updated_by
        Project.find(@model.id).update({updated_by: current_user.email})
      end
    end
  end
end
