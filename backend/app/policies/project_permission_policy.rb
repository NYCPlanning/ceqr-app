class ProjectPermissionPolicy < ApplicationPolicy
  def index?
    true
  end
  
  def show?
    true
  end

  def create?    
    true
    # record.project.editors.include? user
  end

  def update?
    create?
  end

  def destroy?
    create?
  end
end
