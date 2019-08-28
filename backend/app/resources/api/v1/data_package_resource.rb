class Api::V1::DataPackageResource < JSONAPI::Resource
  immutable

  attributes(
    :name,
    :package,
    :version,
    :release_date,
    :schemas
  )

  def self.default_sort
    [{field: 'release_date', direction: :desc}]
  end

  filter :package
  filter :version
end