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

        # Users
        :users,
        :viewers,

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
    end
  end
end