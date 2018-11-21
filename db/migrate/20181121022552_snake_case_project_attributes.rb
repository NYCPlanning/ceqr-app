class SnakeCaseProjectAttributes < ActiveRecord::Migration[5.2]
  def change
    change_table :projects do |t|
      t.rename :buildYear, :build_year
      t.rename :ceqrNumber, :ceqr_number
      t.rename :totalUnits, :total_units
      t.rename :seniorUnits, :senior_units
      t.rename :esSchoolChoice, :es_school_choice
      t.rename :isSchoolChoice, :is_school_choice
      t.rename :subdistrictsFromDb, :subdistricts_from_db
      t.rename :subdistrictsFromUser, :subdistricts_from_user
      t.rename :futureResidentialDev, :future_residential_dev
      t.rename :schoolsWithAction, :schools_with_action
      t.rename :hsProjections, :hs_projections
      t.rename :hsStudentsFromHousing, :hs_students_from_housing
      t.rename :futureEnrollmentProjections, :future_enrollment_projections
      t.rename :futureEnrollmentMultipliers, :future_enrollment_multipliers
      t.rename :futureEnrollmentNewHousing, :future_enrollment_new_housing
      t.rename :scaProjects, :sca_projects
      t.rename :doeUtilChanges, :doe_util_changes
      t.rename :trafficZone, :traffic_zone
      t.rename :manualVersion, :manual_version
      t.rename :directEffect, :direct_effect
    end
  end
end
