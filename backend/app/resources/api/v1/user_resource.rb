class Api::V1::UserResource < JSONAPI::Resource
  attributes :email, :created_at, :updated_at

  has_many :project_permissions

  filter :email
end