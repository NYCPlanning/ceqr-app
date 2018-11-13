# Define payloads that can be re-used across endpoints.
#
# For instance, you may create Tag objects via the /tags endpoint.
# You may also sidepost Tag objects via the /posts endpoint.
# Here is where the Tag payload can be defined. For example:
#
# strong_resource :tag do
#   attribute :name, :string
#   attribute :active, :boolean
# end
#
# You can now reference this payload across controllers:
#
# class TagsController < ApplicationController
#   strong_resource :tag
# end
#
# class PostsController < ApplicationController
#   strong_resource :post do
#     has_many :tags, disassociate: true, destroy: true
#   end
# end
#
# Custom types can be added here as well:
# Parameters = ActionController::Parameters
# strong_param :pet_type, swagger: :string, type: Parameters.enum('Dog', 'Cat')
#
# strong_resource :pet do
#   attribute :type, :pet_type
# end
#
# For additional documentation, see https://jsonapi-suite.github.io/strong_resources


# StrongResources.configure do
#   strong_resource :project do
#     attribute :name, :string
#     attribute :ceqrNumber, :string

#     attribute :bbls
#     attribute :borough
#     attribute :buildYear
#     attribute :totalUnits
#     attribute :seniorUnits
  
#     attribute :created_at
#     attribute :updated_at
#     attribute :updated_by
  
#     # Relations
#     attribute :users
#     attribute :viewers
    
#     ## TODO: Extract into relationshios ##
#     # Public Schools
#     attribute :manualVersion
  
#     attribute :directEffect
    
#     attribute :esSchoolChoice
#     attribute :isSchoolChoice
  
#     attribute :subdistrictsFromDb
#     attribute :subdistrictsFromUser
  
#     attribute :bluebook
#     attribute :lcgms
#     attribute :scaProjects
  
#     attribute :doeUtilChanges
#     attribute :futureResidentialDev
  
#     attribute :schoolsWithAction
#     attribute :hsProjections
#     attribute :hsStudentsFromHousing
#     attribute :futureEnrollmentProjections
#     attribute :futureEnrollmentMultipliers
#     attribute :futureEnrollmentNewHousing
  
#     # Transportation
#     attribute :trafficZone
#   end
# end
