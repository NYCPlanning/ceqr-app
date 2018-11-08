require 'rails_helper'

RSpec.describe "projects#show", type: :request do
  let(:params) { {} }

  subject(:make_request) do
    jsonapi_get "/api/v1/projects/#{project.id}",
      params: params
  end

  describe 'basic fetch' do
    let!(:project) { create(:project) }

    it 'serializes the resource correctly' do
      make_request
      assert_payload(:project, project, json_item)
    end
  end
end
