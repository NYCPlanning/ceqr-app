require 'rails_helper'

RSpec.describe CeqrData::DoeSignificantUtilizationChanges, type: :model do
  let(:doe_significant_utilization_changes_042019) { CeqrData::DoeSignificantUtilizationChanges.version('042019') }
  let(:doe_significant_utilization_changes_062018) { CeqrData::DoeSignificantUtilizationChanges.version('062018') }

  describe "#doe_util_changes_matching_with_building_ids 062018" do
    it "returns an array of doe util changes" do
      buildingsBldgIds = ["K014"]

      doe_util_changes = doe_significant_utilization_changes_062018.doe_util_changes_matching_with_building_ids(buildingsBldgIds)

      expect(doe_util_changes[0][:bldg_id]).to be_a String
      expect(doe_util_changes[0][:bldg_id_additional]).to be_a String  # sometimes this can come back as nil
      expect(doe_util_changes[0][:org_id]).to be_a String
      expect(doe_util_changes[0][:title]).to be_a String
      expect(doe_util_changes[0][:at_scale_year]).to be_a String
      expect(doe_util_changes[0][:url]).to be_a String  # sometimes this can come back as NULL
      expect(doe_util_changes[0][:vote_date]).to be_a String
      expect(doe_util_changes[0][:at_scale_enroll]).to be_a Integer

      expect(doe_util_changes[0][:bldg_id]).to eq('K014')
    end
  end

  describe "#doe_util_changes_matching_with_building_ids 042019" do
    it "returns an array of doe util changes" do
      buildingsBldgIds = ["K580"]

      doe_util_changes = doe_significant_utilization_changes_042019.doe_util_changes_matching_with_building_ids(buildingsBldgIds)

      expect(doe_util_changes[0][:bldg_id]).to be_a String
      expect(doe_util_changes[0][:bldg_id_additional]).to be_a String # sometimes this can come back as nil
      expect(doe_util_changes[0][:org_id]).to be_a String
      expect(doe_util_changes[0][:title]).to be_a String
      expect(doe_util_changes[0][:at_scale_year]).to be_a String
      expect(doe_util_changes[0][:url]).to be_a String  # sometimes this can come back as NULL
      expect(doe_util_changes[0][:vote_date]).to be_a String
      expect(doe_util_changes[0][:at_scale_enroll]).to be_a Integer

      expect(doe_util_changes[0][:bldg_id]).to eq('K580')
    end
  end
end
