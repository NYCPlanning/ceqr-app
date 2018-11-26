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

ActiveRecord::Schema.define(version: 2018_11_21_022552) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "plpgsql"

  create_table "pgmigrations", id: :integer, default: nil, force: :cascade do |t|
    t.string "name", limit: 255, null: false
    t.datetime "run_on", null: false
  end

  create_table "project_permissions", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.bigint "user_id", null: false
    t.string "permission", null: false
    t.index ["project_id"], name: "index_project_permissions_on_project_id"
    t.index ["user_id"], name: "index_project_permissions_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.text "fortune_id"
    t.text "name"
    t.text "bbls", default: [], null: false, array: true
    t.float "build_year"
    t.text "borough"
    t.float "traffic_zone"
    t.boolean "es_school_choice"
    t.text "updated_by"
    t.boolean "is_school_choice"
    t.text "users", default: [], null: false, array: true
    t.datetime "updated_at", null: false
    t.datetime "created_at", null: false
    t.float "senior_units"
    t.float "total_units"
    t.boolean "direct_effect"
    t.jsonb "subdistricts_from_db", default: [], null: false, array: true
    t.jsonb "subdistricts_from_user", default: [], null: false, array: true
    t.jsonb "bluebook", default: [], null: false, array: true
    t.jsonb "lcgms", default: [], null: false, array: true
    t.jsonb "sca_projects", default: [], null: false, array: true
    t.jsonb "doe_util_changes", default: [], null: false, array: true
    t.jsonb "future_residential_dev", default: [], null: false, array: true
    t.jsonb "schools_with_action", default: [], null: false, array: true
    t.jsonb "hs_projections", default: [], null: false, array: true
    t.float "hs_students_from_housing"
    t.jsonb "future_enrollment_projections", default: [], null: false, array: true
    t.jsonb "future_enrollment_multipliers", default: [], null: false, array: true
    t.jsonb "future_enrollment_new_housing", default: [], null: false, array: true
    t.text "viewers", default: [], null: false, array: true
    t.text "ceqr_number"
    t.text "manual_version"
  end

  create_table "users", force: :cascade do |t|
    t.text "fortune_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "projects", default: [], null: false, array: true
    t.citext "email"
    t.boolean "email_validated", default: false
    t.text "password_digest"
    t.text "projects_viewable", default: [], null: false, array: true
    t.boolean "account_approved", default: false
    t.index ["email"], name: "user_email_unique", unique: true
  end

end
