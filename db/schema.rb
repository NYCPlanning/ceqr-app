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

ActiveRecord::Schema.define(version: 2018_11_19_214100) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "citext"
  enable_extension "plpgsql"

  create_table "project_permissions", force: :cascade do |t|
    t.bigint "project_id", null: false
    t.bigint "user_id", null: false
    t.string "permission", null: false
    t.index ["project_id"], name: "index_project_permissions_on_project_id"
    t.index ["user_id"], name: "index_project_permissions_on_user_id"
  end

  create_table "projects", force: :cascade do |t|
    t.text "fortune_id"
    t.float "trafficZone"
    t.boolean "esSchoolChoice"
    t.boolean "isSchoolChoice"
    t.float "totalUnits"
    t.float "seniorUnits"
    t.boolean "directEffect"
    t.jsonb "subdistrictsFromDb", default: [], null: false, array: true
    t.jsonb "subdistrictsFromUser", default: [], null: false, array: true
    t.jsonb "bluebook", default: [], null: false, array: true
    t.text "name"
    t.text "bbls", default: [], null: false, array: true
    t.jsonb "lcgms", default: [], null: false, array: true
    t.jsonb "scaProjects", default: [], null: false, array: true
    t.float "buildYear"
    t.jsonb "doeUtilChanges", default: [], null: false, array: true
    t.jsonb "futureResidentialDev", default: [], null: false, array: true
    t.text "borough"
    t.jsonb "schoolsWithAction", default: [], null: false, array: true
    t.jsonb "hsProjections", default: [], null: false, array: true
    t.float "hsStudentsFromHousing"
    t.jsonb "futureEnrollmentProjections", default: [], null: false, array: true
    t.jsonb "futureEnrollmentMultipliers", default: [], null: false, array: true
    t.jsonb "futureEnrollmentNewHousing", default: [], null: false, array: true
    t.text "users", default: [], null: false, array: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "updated_by"
    t.text "viewers", default: [], null: false, array: true
    t.text "ceqrNumber"
    t.text "manualVersion"
  end

  create_table "users", force: :cascade do |t|
    t.text "fortune_id"
    t.citext "email"
    t.text "password_digest"
    t.boolean "email_validated", default: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.text "projects", default: [], null: false, array: true
    t.text "__project_updated_by_inverse", default: [], null: false, array: true
    t.text "projects_viewable", default: [], null: false, array: true
    t.boolean "account_approved", default: false
    t.index ["email"], name: "user_email_unique", unique: true
  end

end
