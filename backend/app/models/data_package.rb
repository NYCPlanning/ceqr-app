# Each DataPackage model represnts one 'cut' of CEQR App data for a given analysis.
# For example, in the Public Schools analysis, data is released quarterly, with a major update every year corresponding to
# a new school year. This means there will be a new DataPackage created every quarter, that will point to one or more datasets updated datasets.

# The #datasets attribute on a DataPackage model is a hash of datasets, using a dataset name as the key, the nested hash
# includes a `table` key for the corresponding ceqr data schema and table name and any other metadata attributes needed
# on the front or backend.

# An example is as follows:
# datasets: {
#   "lcgms": {
#     table: "doe_lcgms.2017",
#     version: "2018-09-10",
#     minYear: 2017,
#     maxYear: 2018
#   }
# }

class DataPackage < ApplicationRecord
  # Returns the most recent DataPackage for a given analysis chapter
  def self.latest_for(analysis)
    self.where(analysis: analysis).order(release_date: :desc).first
  end

  # Returns the Postgres schema for a given dataset
  def dataset_for(dataset)
    datasets[dataset.to_s]["table"].split('.')[0]
  end

  # Returns the Postgres table name for a given dataset
  def version_for(dataset)
    datasets[dataset.to_s]["table"].split('.')[1]
  end

  # Returns the full Postgres table name 
  def table_name_for(dataset)
    datasets[dataset.to_s]["table"]
  end
end
