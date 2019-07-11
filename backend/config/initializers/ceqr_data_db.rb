require "sequel"
# require "sequel_pg"

# Initialize Sequel
CEQR_DATA = Sequel.connect(ENV['CEQR_DATA_DB_URL'].sub(/^postgis/, "postgres"))
# CEQR_DATA.extension :pg_array
# Sequel.extension :pg_array_ops, :pg_hstore_ops, :pg_json_ops

# For ActiveRecord
CEQR_DATA_DB = YAML.load(ERB.new(IO.read(File.join(Rails.root, "config", "ceqr_data_db.yml"))).result)[Rails.env.to_s]

