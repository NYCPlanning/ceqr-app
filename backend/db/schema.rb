# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2023_01_11_155439) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "plpgsql"
  enable_extension "postgis"

  create_table "community_facilities_analyses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "project_id"
  end

  create_table "data_packages", force: :cascade do |t|
    t.text "name"
    t.text "package"
    t.date "release_date"
    t.jsonb "schemas"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "version"
    t.index ["package", "version"], name: "index_data_packages_on_package_and_version"
  end

  create_table "project_permissions", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.bigint "user_id", null: false
    t.string "permission", null: false
    t.index ["project_id"], name: "index_project_permissions_on_project_id"
    t.index ["user_id"], name: "index_project_permissions_on_user_id"
  end

# Could not dump table "projects" because of following StandardError
#   Unknown type 'geometry(MultiPolygon,4326)' for column 'bbls_geom'

  create_table "public_schools_analyses", force: :cascade do |t|
    t.boolean "es_school_choice"
    t.boolean "is_school_choice"
    t.float "hs_students_from_housing"
    t.jsonb "subdistricts_from_db", default: [], null: false, array: true
    t.jsonb "subdistricts_from_user", default: [], null: false, array: true
    t.jsonb "school_buildings", default: [], null: false, array: true
    t.jsonb "sca_projects", default: [], null: false, array: true
    t.jsonb "doe_util_changes", default: [], null: false, array: true
    t.jsonb "residential_developments", default: [], null: false, array: true
    t.jsonb "schools_with_action", default: [], null: false, array: true
    t.jsonb "hs_projections", default: [], null: false, array: true
    t.jsonb "future_enrollment_projections", default: [], null: false, array: true
    t.jsonb "future_enrollment_multipliers", default: [], null: false, array: true
    t.jsonb "future_enrollment_new_housing", default: [], null: false, array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "project_id"
    t.bigint "data_package_id"
    t.bigint "subdistricts_geojson_id"
    t.index ["data_package_id"], name: "index_public_schools_analyses_on_data_package_id"
    t.index ["subdistricts_geojson_id"], name: "index_public_schools_analyses_on_subdistricts_geojson_id"
  end

  create_table "solid_waste_analyses", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.integer "project_id"
  end

  create_table "subdistricts_geojsons", force: :cascade do |t|
    t.integer "public_schools_analysis_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

# Could not dump table "transportation_analyses" because of following StandardError
#   Unknown type 'geometry(Point,4326)' for column 'census_tracts_centroid'

  create_table "transportation_planning_factors", force: :cascade do |t|
    t.jsonb "mode_splits_from_user", default: {}, null: false
    t.boolean "manual_mode_splits", default: true, null: false
    t.jsonb "census_tract_variables", default: [], null: false, array: true
    t.jsonb "vehicle_occupancy_from_user", default: {}, null: false
    t.text "land_use", null: false
    t.jsonb "in_out_splits", default: {}, null: false
    t.jsonb "truck_in_out_splits", default: {}, null: false
    t.jsonb "table_notes", default: {}, null: false
    t.bigint "data_package_id"
    t.bigint "transportation_analysis_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "temporal_mode_splits", default: false, null: false
    t.boolean "temporal_vehicle_occupancy", default: false, null: false
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.citext "email"
    t.boolean "email_validated", default: false
    t.text "password_digest"
    t.boolean "account_approved", default: false
    t.boolean "admin", default: false, null: false
    t.index ["email"], name: "user_email_unique", unique: true
  end

  add_foreign_key "community_facilities_analyses", "projects"
  add_foreign_key "projects", "data_packages"
  add_foreign_key "public_schools_analyses", "data_packages"
  add_foreign_key "public_schools_analyses", "projects"
  add_foreign_key "public_schools_analyses", "subdistricts_geojsons", on_delete: :cascade
  add_foreign_key "transportation_analyses", "projects"
  add_foreign_key "transportation_planning_factors", "data_packages"
  add_foreign_key "transportation_planning_factors", "transportation_analyses"
end
