# Serializers define the rendered JSON for a model instance.
# We use jsonapi-rb, which is similar to active_model_serializers.
class SerializableProject < JSONAPI::Serializable::Resource
  type :projects

  # Add attributes here to ensure they get rendered, .e.g.
  #
  # attribute :name
  #
  # To customize, pass a block and reference the underlying @object
  # being serialized:
  #
  # attribute :name do
  #   @object.name.upcase
  # end

  # Project
  attribute :name
  attribute :ceqrNumber

  attribute :bbls
  attribute :borough
  attribute :buildYear
  attribute :totalUnits
  attribute :seniorUnits

  attribute :created_at
  attribute :updated_at
  attribute :updated_by

  # Relations
  attribute :users
  attribute :viewers
  
  ## TODO: Extract into relationshios ##
  # Public Schools
  attribute :manualVersion

  attribute :directEffect
  
  attribute :esSchoolChoice
  attribute :isSchoolChoice

  attribute :subdistrictsFromDb
  attribute :subdistrictsFromUser

  attribute :bluebook
  attribute :lcgms
  attribute :scaProjects

  attribute :doeUtilChanges
  attribute :futureResidentialDev

  attribute :schoolsWithAction
  attribute :hsProjections
  attribute :hsStudentsFromHousing
  attribute :futureEnrollmentProjections
  attribute :futureEnrollmentMultipliers
  attribute :futureEnrollmentNewHousing

  # Transportation
  attribute :trafficZone
end
