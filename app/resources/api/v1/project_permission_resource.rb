module Api
  module V1
    class ProjectPermissionResource < JSONAPI::Resource
      attributes :permission, :user_id, :project_id

      has_one :user
      has_one :project
      
      filters :project_id, :user_id

      def self.records(options = {})
        user = options.fetch(:context).fetch(:current_user)
        user.editable_permissions
      end
    end
  end
end