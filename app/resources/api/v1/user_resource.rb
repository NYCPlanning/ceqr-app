module Api
  module V1
    class UserResource < JSONAPI::Resource
      attributes :email

      has_many :project_permissions

      filter :email
    end
  end
end