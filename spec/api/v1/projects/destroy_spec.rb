require 'rails_helper'

RSpec.describe "projects#destroy", type: :request do
  subject(:make_request) do
    jsonapi_delete "/api/v1/projects/#{project.id}"
  end

  describe 'basic destroy' do
    let!(:project) { create(:project) }

    it 'updates the resource' do
      expect {
        make_request
      }.to change { Project.count }.by(-1)

      expect(response.status).to eq(200)
      expect(json).to eq('meta' => {})
    end
  end
end
