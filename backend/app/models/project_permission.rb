class ProjectPermission < ApplicationRecord
  belongs_to :user
  belongs_to :project
end
