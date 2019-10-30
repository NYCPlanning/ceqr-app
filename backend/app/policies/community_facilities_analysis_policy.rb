class CommunityFacilitiesAnalysisPolicy < ApplicationPolicy
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
end
