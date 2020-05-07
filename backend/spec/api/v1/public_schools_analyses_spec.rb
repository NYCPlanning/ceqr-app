require 'rails_helper'

RSpec.describe 'public_schools_analysis', type: :request do
  let(:user) { create(:user) }
  let(:headers) { jsonapi_headers }  
  
  let!(:p1) { create(:project, name: "Mine") }
  let!(:p2) { create(:project, name: "Someone Else") }
  let!(:p3) { create(:project, name: "Yours") }

  before do
    create(:project_permission, project: p1, user: user, permission: 'editor')
    create(:project_permission, project: p2, user: user, permission: 'viewer')
  end

  describe 'GET /api/v1/projects/:id/public-schools-analysis' do
    it "accessible if project is editable" do
      get "/api/v1/projects/#{p1.id}/public-schools-analysis", headers: headers
      expect(response.status).to eq(200)
    end

    it "accessible if project is viewable" do
      get "/api/v1/projects/#{p2.id}/public-schools-analysis", headers: headers
      expect(response.status).to eq(200)
    end

    it "not accessible if project is neither editable nor viewable" do
      get "/api/v1/projects/#{p3.id}/public-schools-analysis", headers: headers
      expect(response.status).to eq(404)
    end
  end
  
  
  describe 'GET /api/v1/public-schools-analysis' do    
    it "accessible if project is editable" do
      get "/api/v1/public-schools-analyses/#{p1.public_schools_analysis.id}", headers: headers
      expect(response.status).to eq(200)
    end

    it "accessible if project is viewable" do
      get "/api/v1/public-schools-analyses/#{p2.public_schools_analysis.id}", headers: headers
      expect(response.status).to eq(200)
    end

    it "not accessible if project is neither editable nor viewable" do
      get "/api/v1/public-schools-analyses/#{p3.public_schools_analysis.id}", headers: headers
      expect(response.status).to eq(403)
    end
    
    describe "public schools analysis" do      
      xit "has geojson for subdistricts" do
        JSON.parse(response.body)["data"]["attributes"]["subdistricts-geojson"]
      end

      xit "sets subdistricts from db correctly" do
        # "subdistricts-from-db":
        # [
        #     {
        #         "id": 303,
        #         "sdName": "District 30 - Subdistrict 3",
        #         "district": 30,
        #         "cartodb_id": 73,
        #         "subdistrict": 3
        #     }
        # ],


      end

      xit "sets bluebook correctly" do
        # "bluebook":
        # [
        #     {
        #         "x": 1005737,
        #         "y": 219448,
        #         "name": "P.S. 17 - Q",
        #         "level": "ps",
        #         "enroll": 547,
        #         "org_id": "Q017",
        #         "source": "bluebook",
        #         "address": "28-37 29 STREET",
        #         "bldg_id": "Q017",
        #         "borocode": 4,
        #         "capacity": 484,
        #         "district": 30,
        #         "excluded": false,
        #         "the_geom": "0101000020E6100000156BFA0E097B52C0EAE1CC136E624440",
        #         "bldg_name": "P.S. 17 - Q",
        #         "hs_enroll": 0,
        #         "ms_enroll": 0,
        #         "org_level": "PS",
        #         "ps_enroll": 547,
        #         "cartodb_id": 1552,
        #         "dataVersion": "november-2018",
        #         "hs_capacity": 0,
        #         "ms_capacity": 0,
        #         "ps_capacity": 484,
        #         "subdistrict": 3,
        #         "capacityFuture": "484",
        #         "the_geom_webmercator": "0101000020110F0000F3F6F5C123645FC12D2A9498A5FD5241"
        #     },
        # ]

      end

      xit "sets lcgms correctly" do
        # "lcgms":
        # [
        #     {
        #         "name": "P.S. 384",
        #         "level": "ps",
        #         "enroll": 0,
        #         "grades": "",
        #         "org_id": "Q384",
        #         "source": "lcgms",
        #         "address": "27-35 JACKSON AVENUE",
        #         "bldg_id": "Q972",
        #         "capacity": "0",
        #         "district": 30,
        #         "the_geom": "0101000020E6100000711B0DE02D7C52C0B29DEFA7C65F4440",
        #         "hs_enroll": 0,
        #         "is_enroll": 0,
        #         "org_level": "PS",
        #         "ps_enroll": 0,
        #         "cartodb_id": 9,
        #         "subdistrict": 3
        #     }
        # ],

      end

      xit "sets futureEnrollmentMultipliers correctly" do
        # "future-enrollment-multipliers":
        # [
        #     {
        #         "level": "PS",
        #         "district": 30,
        #         "the_geom": null,
        #         "cartodb_id": 175,
        #         "multiplier": 0.186888841767958,
        #         "subdistrict": 3,
        #         "the_geom_webmercator": null
        #     },
        #     {
        #         "level": "MS",
        #         "district": 30,
        #         "the_geom": null,
        #         "cartodb_id": 179,
        #         "multiplier": 0.241848546403483,
        #         "subdistrict": 3,
        #         "the_geom_webmercator": null
        #     }
        # ],
      end

      xit "sets futureEnrollmentProjections correctly" do
        # "future-enrollment-projections":
        # [
        #     {
        #         "ms": 8582,
        #         "ps": 20025,
        #         "district": 30,
        #         "school_year": "2025-26"
        #     }
        # ],
       
      end

      xit "sets hsProjections correctly" do
        # "hs-projections":
        # [
        #     {
        #         "hs": 79555,
        #         "year": 2025,
        #         "borough": "Queens"
        #     }
        # ],
      end

      xit "sets futureEnrollmentNewHousing" do
        # "future-enrollment-new-housing":
        # [
        #     {
        #         "level": "PS",
        #         "district": 30,
        #         "students": 1887,
        #         "subdistrict": 3
        #     },
        #   ]
      end

      xit "sets hsStudentsFromHousing" do
        # "hs-students-from-housing": 4643,
      end
      
      xit "sets scaProjects" do
        # "sca-projects":
        # [
        #     {
        #         "name": "ACADEMY OF AMERICAN STUDIES",
        #         "pct_hs": 0,
        #         "pct_is": 0,
        #         "pct_ps": 0,
        #         "capacity": 969,
        #         "district": 30,
        #         "the_geom": "0101000020E61000001E335019FF7B52C0A2D3F36E2C604440",
        #         "org_level": "",
        #         "cartodb_id": 5,
        #         "start_date": "2018-03-01T00:00:00Z",
        #         "guessed_pct": false,
        #         "hs_capacity": 0,
        #         "is_capacity": 0,
        #         "uid": "DSF0000798215",
        #         "ps_capacity": "969",
        #         "subdistrict": 3,
        #         "includeInCapacity": true,
        #         "funding_budget_15_19": 110.66,
        #         "the_geom_webmercator": "0101000020110F000061D396AEC5655FC1F5579CE71DFB5241"
        #     },
        #   ]
      end
      
      xit "sets doeUtilChanges" do
        # "doe-util-changes":
        # [
        #     {
        #         "url": "https://nycdoe.sharepoint.com/:f:/s/PEPArchive/ErWJvSMOqERPuXtp5ld9nEgBzOlh1jQsR1hP5yu69pbldQ?e=dZ696A",
        #         "title": "The Proposed Closure of John Adams High School (27Q480) and the Opening of New School (27Q570) in Building Q480 Beginning in 2012-2013",
        #         "org_id": "Q480",
        #         "bldg_id": "Q480",
        #         "vote_date": "04/26/2012",
        #         "at_scale_year": "2012-13",
        #         "at_scale_enroll": 0,
        #         "bldg_id_additional": ""
        #     },
        #   ]
      end
    end
  end
end
