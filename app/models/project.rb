class Project < ApplicationRecord  
  has_many :editor_permissions, -> { where("permission = 'editor'") }, class_name: 'ProjectPermission'
  has_many :viewer_permissions, -> { where("permission = 'viewer'") }, class_name: 'ProjectPermission'

  has_many :editors, through: :editor_permissions, source: :user
  has_many :viewers, through: :viewer_permissions, source: :user  
end
