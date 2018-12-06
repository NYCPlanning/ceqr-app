class CeqrDataBase < ActiveRecord::Base  
  self.abstract_class = true
  establish_connection CEQR_DATA_DB

  # Return data version from Postgres comment on view
  def self.version
    version = connection.execute(
      <<-SQL
        select description from pg_description
        join pg_class on pg_description.objoid = pg_class.oid
        where relname = '#{table_name}'
      SQL
    ).first
    
    version ? version['description'] : table_name
  end
end