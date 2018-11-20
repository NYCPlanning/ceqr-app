class User < ApplicationRecord
  # encrypt password
  has_secure_password

  validates_presence_of :email, :password_digest

  has_many :project_permissions
  has_many :editor_permissions, -> { where("permission = 'editor'") }, class_name: 'ProjectPermission'
  has_many :viewer_permissions, -> { where("permission = 'viewer'") }, class_name: 'ProjectPermission'

  has_many :editable_and_viewable_projects, through: :project_permissions, source: :project
  has_many :editable_projects, through: :editor_permissions, source: :project
  has_many :viewable_projects, through: :viewer_permissions, source: :project
end
