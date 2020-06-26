require "administrate/base_dashboard"

class UserDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    project_permissions: Field::HasMany,
    editor_permissions: Field::HasMany.with_options(class_name: "ProjectPermission"),
    viewer_permissions: Field::HasMany.with_options(class_name: "ProjectPermission"),
    editable_and_viewable_projects: Field::HasMany.with_options(class_name: "Project"),
    editable_projects: Field::HasMany.with_options(class_name: "Project"),
    viewable_projects: Field::HasMany.with_options(class_name: "Project"),
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
    email: Field::String.with_options(searchable: true),
    email_validated: Field::Boolean,
    password_digest: Field::Text,
    account_approved: Field::Boolean,
    id: Field::Number,
    admin: Field::Boolean,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = %i[
    email
    updated_at
    created_at
    account_approved
    admin
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = %i[
    created_at
    updated_at
    email
    email_validated
    account_approved
    id
    admin
    editable_and_viewable_projects
    viewable_projects
    editable_projects
    project_permissions
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = %i[
    email
    email_validated
    account_approved
    admin
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

  # Overwrite this method to customize how users are displayed
  # across all pages of the admin dashboard.
  #
  def display_resource(user)
    user.email
  end
end
