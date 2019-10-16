class TransportationPlanningFactorsPolicy < ApplicationPolicy
  def index?
    true
  end
  
  def show?
    true
  end
  
  def create?
    true
  end

  def update?
    true
  end

  def destroy?
    true
  end

  def replace_data_package?(dp)
    true
  end
end
