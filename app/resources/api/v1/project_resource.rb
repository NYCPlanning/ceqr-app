module Api
  module V1
    class ProjectResource < JSONAPI::Resource
      after_create :set_project_permissions
      after_save :set_updated_by
      
      attributes :name,
        :build_year,
        :bbls,
        :ceqr_number,
        :borough,
      
        :created_at,
        :updated_at,
        :updated_by,

        :total_units,
        :senior_units,

        # Traffic
        :traffic_zone,

        # Public Schools
        :es_school_choice,
        :is_school_choice,

        :subdistricts_from_db,
        :subdistricts_from_user,

        :future_residential_dev,
        :schools_with_action,

        :hs_projections,
        :hs_students_from_housing,

        :future_enrollment_projections,
        :future_enrollment_multipliers,
        :future_enrollment_new_housing,

        :bluebook,
        :lcgms,
        :sca_projects,

        :doe_util_changes

      has_many :editors, relation_name: :editors
      has_many :viewers, relation_name: :viewers
      has_many :project_permissions

      def self.records(options = {})
        user = options.fetch(:context).fetch(:current_user)
        # Should be more granular, returning editable and vieable seperately
        # Currently, a view can still edit a project
        user.editable_and_viewable_projects
      end

      def self.updatable_fields(context)
        super - [:created_at, :updated_at, :updated_by, :view_only]
      end

      private

      def current_user
        @context.fetch(:current_user)
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