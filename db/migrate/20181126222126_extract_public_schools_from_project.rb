class ExtractPublicSchoolsFromProject < ActiveRecord::Migration[5.2]
  def change    
    create_table "public_schools_analyses", force: :cascade do |t|
      t.boolean "es_school_choice"
      t.boolean "is_school_choice"
      t.boolean "direct_effect"

      t.float "hs_students_from_housing" #should become integer

      t.text "manual_version", default: "march-2014"

      t.jsonb "subdistricts_from_db", default: [], null: false, array: true
      t.jsonb "subdistricts_from_user", default: [], null: false, array: true
      t.jsonb "bluebook", default: [], null: false, array: true
      t.jsonb "lcgms", default: [], null: false, array: true
      t.jsonb "sca_projects", default: [], null: false, array: true
      t.jsonb "doe_util_changes", default: [], null: false, array: true
      t.jsonb "future_residential_dev", default: [], null: false, array: true
      t.jsonb "schools_with_action", default: [], null: false, array: true
      t.jsonb "hs_projections", default: [], null: false, array: true
      t.jsonb "future_enrollment_projections", default: [], null: false, array: true
      t.jsonb "future_enrollment_multipliers", default: [], null: false, array: true
      t.jsonb "future_enrollment_new_housing", default: [], null: false, array: true

      t.timestamps
    end

    add_column :public_schools_analyses, :project_id, :integer
    add_foreign_key :public_schools_analyses, :projects

    reversible do |dir|
      dir.up do
        Project.all.each do |p|
          PublicSchoolsAnalysis.create({
            es_school_choice: p.es_school_choice,
            is_school_choice: p.is_school_choice,
            direct_effect: p.direct_effect,

            hs_students_from_housing: p.hs_students_from_housing,

            manual_version: p.manual_version,

            subdistricts_from_db: p.subdistricts_from_db,
            subdistricts_from_user: p.subdistricts_from_user,
            bluebook: p.bluebook,
            lcgms: p.lcgms,
            sca_projects: p.sca_projects,
            doe_util_changes: p.doe_util_changes,
            future_residential_dev: p.future_residential_dev,
            schools_with_action: p.schools_with_action,
            hs_projections: p.hs_projections,
            future_enrollment_projections: p.future_enrollment_projections,
            future_enrollment_multipliers: p.future_enrollment_multipliers,
            future_enrollment_new_housing: p.future_enrollment_new_housing,

            project: p,
          })
        end
      end
    end

    change_table :projects do |t|
      t.remove :es_school_choice
      t.remove :is_school_choice
      t.remove :direct_effect

      t.remove :hs_students_from_housing

      t.remove :manual_version

      t.remove :subdistricts_from_db
      t.remove :subdistricts_from_user
      t.remove :bluebook
      t.remove :lcgms
      t.remove :sca_projects
      t.remove :doe_util_changes
      t.remove :future_residential_dev
      t.remove :schools_with_action
      t.remove :hs_projections
      t.remove :future_enrollment_projections
      t.remove :future_enrollment_multipliers
      t.remove :future_enrollment_new_housing
    end
  end
end
