class DataRecord < ActiveRecord::Base
  self.abstract_class = true
  establish_connection CEQR_DATA_DB

  def self.dataset=(schema)
    self.table_name = "#{schema}.#{self.version}"
  end

  def self.dataset
    self.table_name.split('.')[0]
  end

  def self.version=(version)
    self.table_name = "#{self.dataset}.#{version}"
  end

  def self.version
    self.table_name.split('.')[1]
  end

  def self.dataset_version
    self.table_name.sub('.', '_')
  end
end