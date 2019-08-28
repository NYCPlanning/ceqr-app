require 'rails_helper'

RSpec.describe 'projects', type: :request do
  describe 'POST /api/v1/project' do
    let(:headers) { jsonapi_headers }  
    let!(:user) { create(:user) }
    let(:payload) do        
      {
        data: {
          type: 'projects',
          attributes: attributes_for(:project_api).transform_keys {|k| k.to_s.gsub(/_/, '-') }
        }
      }
    end

    it 'works' do
      post '/api/v1/projects', headers: headers, params: payload.to_json

      expect(Project.count).to be(1)
      expect(PublicSchoolsAnalysis.count).to be(1)
      expect(TransportationAnalysis.count).to be(1)

      expect(response.status).to eq(201)
    end
  end
end

