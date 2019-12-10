class ProjectPolicy < ApplicationPolicy
  def index?
    true
  end

  def show?
    true
  end

  def create?
    true
  end

  def new?
    create?
  end

  def update?
    return true if user.admin?
    record.editors.include? user
  end

  def edit?
    update?
  end

  def destroy?
    record.editors.include? user
  end

  def add_to_project_permissions?(permissions)
    update?
  end

  def replace_project_permissions?(data_package)
    update?
  end

  def create_with_data_package?(dp)
    create?
  end

  def replace_data_package?(dp)
    update?
  end

  class Scope < Scope
    def resolve
      if user.admin?
        scope.all
      else
        user.editable_and_viewable_projects
      end
    end
  end
end
