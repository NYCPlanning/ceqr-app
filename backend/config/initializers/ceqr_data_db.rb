require "sequel"

# Initialize Sequel
CEQR_DATA = Sequel.connect(ENV['CEQR_DATA_DB_URL'].sub(/^postgis/, "postgres"))

# For ActiveRecord
CEQR_DATA_DB = YAML.load(ERB.new(IO.read(File.join(Rails.root, "config", "ceqr_data_db.yml"))).result)[Rails.env.to_s]
