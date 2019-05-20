# Abstract ActiveRecord class inherited by all read-only Db:: classes.

# This class does two things:
# - sets the database connection string to CEQR_DATA_DB rather then the default Rails read/write db
# - defines a number of helper class methods used by the db models to set and read their database schemas and tables.

# The read-only CEQR data database, referred to in the app as ceqr data or CEQR_DATA_DB, contains a number of datasets, each
# mapping to a given db model (ie, `doe_lcgms` dataset maps to `Db::Lcgms` model). A given dataset (`doe_lcgms`) can have one or more versions (`2018`, `18v2`, etc).
# To manage these datasets and versions, we leverage Postgres schemas and tables (Postgres schemas being a terrible name. These schemas function 
# more like namespacing). In ceqr data each dataset has its own Postgres schema, and each schema has one or more tables named after the version. So
# the `doe_lcgms` dataset version `2018` can be accessed in Postgres as a table named `doe_lcgms.2018`. This dot-seperated Postgres table notation is 
# used by the DataRecord class methods to manipulate what dataset and version a given Db model should access.

# The class method `.table_name` is provided by ActiveRecord and defines what table a given model should query.
# For ceqr data models, this will always be a string of the postgres schema and table seperated by a period (`doe_lcgms.2018`)
# The getters and setters for `schema` and `table` simply manipulate the corresponding side of the string (`schema.table`).

class DataRecord < ActiveRecord::Base
  self.abstract_class = true
  
  # CEQR_DATA_DB connection parameters should only allow read-only access. Rails is not protecting from write attempts to this db.
  establish_connection CEQR_DATA_DB

  def self.schema=(schema)
    self.table_name = "#{schema}.#{self.table}"
  end

  def self.schema
    self.table_name.split('.')[0]
  end

  def self.dataset
    self.schema
  end
  
  def self.table=(table)
    self.table_name = "#{self.schema}.#{table}"
  end

  def self.table
    self.table_name.split('.')[1]
  end

  # Returns the schema and table name combined with an underscore rather then dot
  def self.dataset_version
    self.table_name.sub('.', '_')
  end

  # Aliases

  def self.version=(version)
    self.table = version
  end

  def self.version
    self.table
  end
end
