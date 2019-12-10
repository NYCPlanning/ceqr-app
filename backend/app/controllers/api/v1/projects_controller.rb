class Api::V1::ProjectsController < ApiController
  def index
    current_user.editable_and_viewable_projects
    super
  end
end
