class PublicSchoolsAnalysisPolicy < ApplicationPolicy
  def create?
    true
  end
  
  def show?
    record.project.viewers.include?(user) ||
    record.project.editors.include?(user)
  end

  def update?
    record.project.editors.include?(user)
  end

  def destroy?
    update?
  end

  def replace_data_package?(data_package)
    update?
  end
end
