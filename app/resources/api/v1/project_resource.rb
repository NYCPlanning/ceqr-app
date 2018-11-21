module Api
  module V1
    class ProjectResource < JSONAPI::Resource
      attributes :name,
        :buildYear,
        :bbls,
        :ceqrNumber,
        :borough,
      
        :created_at,
        :updated_at,
        :updated_by,

        :totalUnits,
        :seniorUnits,

        # Public Schools
        :esSchoolChoice,
        :isSchoolChoice,

        :subdistrictsFromDb,
        :subdistrictsFromUser,

        :futureResidentialDev,
        :schoolsWithAction,

        :hsProjections,
        :hsStudentsFromHousing,

        :futureEnrollmentProjections,
        :futureEnrollmentMultipliers,
        :futureEnrollmentNewHousing,

        :bluebook,
        :lcgms,
        :scaProjects,

        :doeUtilChanges

      has_many :editors, relation_name: :editors
      has_many :viewers, relation_name: :viewers

      def self.records(options = {})
        user = options.fetch(:context).fetch(:current_user)
        user.editable_and_viewable_projects
      end
    end
  end
end