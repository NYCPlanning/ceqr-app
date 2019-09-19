require 'rails_helper'

RSpec.describe TransportationAnalysis, type: :model do    
  # before do
  #   @trafficZoneMock = class_double('TrafficZones')
  #   @trafficZoneObject = double()

  #   allow(@trafficZoneMock).to receive(:version).and_return(@trafficZoneObject)

  #   allow(@trafficZoneObject).to receive(:for_geom).and_return([2])

  #   @censusTractMock = class_double('CensusTract')
  #   @censusTractObject = double()

  #   allow(@censusTractMock).to receive(:version).and_return(@censusTractObject)

  #   allow(@censusTractObject).to receive(:for_geom).and_return(['bananas'])
  #   allow(@censusTractObject).to receive(:touches_geoids).and_return(['bananas'])
  #   allow(@censusTractObject).to receive(:st_union_geoids_centroid).and_return(generate(:point))

  #   stub_const("#{CeqrData}::TrafficZones", @trafficZoneMock)
  #   stub_const("#{CeqrData}::CensusTract", @censusTractMock)
  # end

  # bbl within district 1 subdistrict 15
  let(:project) { create(:project, build_year: 2026, bbls: [1000477501]) }
  let(:analysis) { create(:transportation_analysis, project: project) }

  describe "#compute_for_updated_bbls!" do
    it "updates all attributes and saves analysis" do
      expect(analysis).to receive(:set_initial_analysis_data)
      expect(analysis).to receive(:save!)

      analysis.compute_for_updated_bbls!
    end
  end

  describe "#selected_census_tract_geoids" do
    it "returns all census tract geoids in the analysis" do
      analysis.required_jtw_study_selection = ["36047000100"]
      analysis.jtw_study_selection = ["36061001300", "36061001502"]

      expect(analysis.selected_census_tract_geoids).to eq(["36047000100", "36061001300", "36061001502"])
    end
  end

  describe "updating project attributes" do
    context "when census tract selection changes" do
      it "updates centroid when changed" do
        analysis.jtw_study_selection = ["36047000100", "36061001300", "36061001502"]
        expect { analysis.save }.to change { analysis.ctpp_modal_splits }
      end

      it "does not update centroid when tract selection is not changed" do
        expect { analysis.save }.not_to change { analysis.jtw_study_area_centroid }
      end

      it "updates acs modal splits" do
        analysis.jtw_study_selection = ["36047000100", "36061001300", "36061001502"]
        expect { analysis.save }.to change { analysis.acs_modal_splits }
      end

      it "does not update acs modal split when tract selection is not changed" do
        expect { analysis.save }.not_to change { analysis.acs_modal_splits }
      end

      it "updates cttp modal splits" do
        analysis.jtw_study_selection = ["36047000100", "36061001300", "36061001502"]
        expect { analysis.save }.to change { analysis.ctpp_modal_splits }
      end

      it "does not update ctpp modal splits when tract selection is not changed" do
        expect { analysis.save }.not_to change { analysis.ctpp_modal_splits }
      end
    end

    context "when data package changes" do
      it "updates attributes when nyc acs changes" do
        data_package = create(:data_package)
        
        expect(analysis).to receive(:set_required_study_selection)
        expect(analysis).to receive(:set_initial_study_selection)
        expect(analysis).to receive(:set_study_area_centroid)
        expect(analysis).to receive(:set_acs_modal_splits)
        expect(analysis).to receive(:set_ctpp_modal_splits)

        analysis.nyc_acs_data_package = data_package

        analysis.save
      end

      it "updates attributes when ctpp changes" do
        data_package = create(:data_package)

        expect(analysis).to receive(:set_required_study_selection)
        expect(analysis).to receive(:set_initial_study_selection)
        expect(analysis).to receive(:set_study_area_centroid)
        expect(analysis).to receive(:set_acs_modal_splits)
        expect(analysis).to receive(:set_ctpp_modal_splits)

        analysis.ctpp_data_package = data_package

        analysis.save
      end

      it "does not update if no data package has changed" do
        expect(analysis).to_not receive(:set_required_study_selection)
        expect(analysis).to_not receive(:set_initial_study_selection)
        expect(analysis).to_not receive(:set_study_area_centroid)
        expect(analysis).to_not receive(:set_acs_modal_splits)
        expect(analysis).to_not receive(:set_ctpp_modal_splits)

        analysis.save
      end
    end
  end

  describe "#set_initial_analysis_data" do
    it "updates the correct attributes" do
      expect(analysis).to receive(:set_traffic_zone)
      expect(analysis).to receive(:set_required_study_selection)
      expect(analysis).to receive(:set_initial_study_selection)
      expect(analysis).to receive(:set_study_area_centroid)
      expect(analysis).to receive(:set_acs_modal_splits)
      expect(analysis).to receive(:set_ctpp_modal_splits)
  
      analysis.set_initial_analysis_data
    end
  end
  
  describe "creating an analysis" do
    it "sets traffic zone on create" do      
      expect(analysis.traffic_zone).to be(1)
    end

    it "sets required study selection based on project study area" do
      expect(analysis.required_jtw_study_selection).to eq(["36061000700"])
    end

    it "sets the geographic centroid of the study area" do
      expect(analysis.jtw_study_area_centroid).to be_present
    end

    it "sets the default study selection based on required study selection" do
      expect(analysis.jtw_study_selection).to eq(["36047000100", "36061001300", "36061001502", "36061000900", "36047000301"])
    end

    it "saves acs modal splits" do
      expect(analysis.acs_modal_splits.first).to include({
        "population" => {"geoid"=>"36061000700", "value"=>8881, "moe"=>973, "variable"=>"population"}
      })

      expect(analysis.acs_modal_splits.first).to match_json_schema("acs_modal_splits")
    end

    it "saves ctpp modal splits" do
      expect(analysis.ctpp_modal_splits.first).to include({
        "workers" => {"geoid"=>"36061000700", "value"=>50660, "moe"=>1763, "variable"=>"workers"}
      })
    end
  end
end
