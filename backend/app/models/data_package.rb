# Each DataPackage model represnts one 'cut' of CEQR App data for a given analysis.
# For example, in the Public Schools analysis, data is released quarterly, with a major update every year corresponding to
# a new school year. This means there will be a new DataPackage created every quarter, that will point to one or more datasets updated datasets.

# The #schema attribute on a DataPackage model is a hash of datasets, using a schema name as the key, the nested hash
# includes a `table` key for the corresponding ceqr data schema and table name and any other metadata attributes needed
# on the front or backend.

# An example is as follows:
# schema: {
#   "lcgms": {
#     table: "2017",
#     version: "2018-09-10",
#     minYear: 2017,
#     maxYear: 2018
#   }
# }

class DataPackage < ApplicationRecord
  # Returns the most recent DataPackage for a given package
  def self.latest_for(package)
    self.where(package: package).order(release_date: :desc).first
  end

  # Returns the Postgres table name for a given schema
  def table_for(schema)
    schemas[schema.to_s]["table"]
  end
end
