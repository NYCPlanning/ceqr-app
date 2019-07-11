require 'rails_helper'

# RSpec.describe DataRecord, type: :model do
#   before(:each) do
#     class Db::TestModel < DataRecord
#       self.schema = "ceqr_data"
#       self.table = "2018"
#     end
#   end
  
#   xdescribe ".table_name" do
#     it "sets activerecord table_name correctly" do
#       expect(Db::TestModel.table_name).to eq("ceqr_data.2018")
#     end
#   end
  
#   xdescribe ".schema" do
#     it "returns the postgres schema" do
#       expect(Db::TestModel.schema).to eq("ceqr_data")
#     end
#   end
  
#   xdescribe ".table" do
#     it "returns the postgres table name" do
#       expect(Db::TestModel.table).to eq("2018")
#     end
#   end

#   xdescribe ".dataset_version" do
#     it "returns the dataset version" do
#       expect(Db::TestModel.dataset_version).to eq("ceqr_data_2018")
#     end
#   end

#   xdescribe ".table=" do
#     it "sets the database table correctly" do
#       Db::TestModel.table = 2017

#       expect(Db::TestModel.table).to eq("2017")
#       expect(Db::TestModel.table_name).to eq("ceqr_data.2017")
#     end
#   end

#   xdescribe ".schema=" do
#     it "sets activerecord schema_search_path correctly" do
#       Db::TestModel.schema = "pluto"

#       expect(Db::TestModel.table).to eq("2018")
#       expect(Db::TestModel.table_name).to eq("pluto.2018")
#     end
#   end
# end