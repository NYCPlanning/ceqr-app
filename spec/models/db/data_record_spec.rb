require 'rails_helper'

RSpec.describe DataRecord, type: :model do
  before(:each) do
    class Db::TestModel < DataRecord
      self.dataset = "ceqr_data"
      self.version = "2018"
    end
  end
  
  describe ".table_name" do
    it "sets activerecord table_name correctly" do
      expect(Db::TestModel.table_name).to eq("ceqr_data.2018")
    end
  end
  
  describe ".dataset" do
    it "returns the postgres schema" do
      expect(Db::TestModel.dataset).to eq("ceqr_data")
    end
  end
  
  describe ".version" do
    it "returns the postgres table name" do
      expect(Db::TestModel.version).to eq("2018")
    end
  end

  describe ".dataset_version" do
    it "returns the dataset version" do
      expect(Db::TestModel.dataset_version).to eq("ceqr_data_2018")
    end
  end

  describe ".version=" do
    it "sets the database version correctly" do
      Db::TestModel.version = 2017

      expect(Db::TestModel.version).to eq("2017")
      expect(Db::TestModel.table_name).to eq("ceqr_data.2017")
    end
  end

  describe ".dataset=" do
    it "sets activerecord schema_search_path correctly" do
      Db::TestModel.dataset = "pluto"

      expect(Db::TestModel.version).to eq("2018")
      expect(Db::TestModel.table_name).to eq("pluto.2018")
    end
  end
end