module Api
  module V1
    class ProjectPermissionResource < JSONAPI::Resource
      attributes :permission

      has_one :user
      has_one :project
      
      def self.records(options = {})
        user = options.fetch(:context).fetch(:current_user)
        user.project_permissions
      end
    end
  end
end