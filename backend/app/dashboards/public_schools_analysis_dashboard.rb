require "administrate/base_dashboard"

class PublicSchoolsAnalysisDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    project: Field::BelongsTo,
    data_package: Field::BelongsTo,
    subdistricts_geojson: Field::HasOne,
    id: Field::Number,
    es_school_choice: Field::Boolean,
    is_school_choice: Field::Boolean,
    hs_students_from_housing: Field::Number.with_options(decimals: 2),
    subdistricts_from_db: Field::String.with_options(searchable: false),
    subdistricts_from_user: Field::String.with_options(searchable: false),
    school_buildings: Field::String.with_options(searchable: false),
    sca_projects: Field::String.with_options(searchable: false),
    doe_util_changes: Field::String.with_options(searchable: false),
    residential_developments: Field::String.with_options(searchable: false),
    schools_with_action: Field::String.with_options(searchable: false),
    hs_projections: Field::String.with_options(searchable: false),
    future_enrollment_projections: Field::String.with_options(searchable: false),
    future_enrollment_multipliers: Field::String.with_options(searchable: false),
    future_enrollment_new_housing: Field::String.with_options(searchable: false),
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    subdistricts_geojson_id: Field::Number,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
  project
  data_package
  subdistricts_geojson
  id
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
  project
  data_package
  subdistricts_geojson
  id
  es_school_choice
  is_school_choice
  hs_students_from_housing
  subdistricts_from_db
  subdistricts_from_user
  sca_projects
  residential_developments
  schools_with_action
  hs_projections
  future_enrollment_projections
  future_enrollment_multipliers
  future_enrollment_new_housing
  created_at
  updated_at
  subdistricts_geojson_id
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
  project
  data_package
  subdistricts_geojson
  es_school_choice
  is_school_choice
  hs_students_from_housing
  subdistricts_from_db
  subdistricts_from_user
  school_buildings
  sca_projects
  doe_util_changes
  residential_developments
  schools_with_action
  hs_projections
  future_enrollment_projections
  future_enrollment_multipliers
  future_enrollment_new_housing
  subdistricts_geojson_id
  ].freeze

  # COLLECTION_FILTERS
  # a hash that defines filters that can be used while searching via the search
  # field of the dashboard.
  #
  # For example to add an option to search for open resources by typing "open:"
  # in the search field:
  #
  #   COLLECTION_FILTERS = {
  #     open: ->(resources) { resources.where(open: true) }
  #   }.freeze
  COLLECTION_FILTERS = {}.freeze

  # Overwrite this method to customize how public schools analyses are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(public_schools_analysis)
  #   "PublicSchoolsAnalysis ##{public_schools_analysis.id}"
  # end
end
