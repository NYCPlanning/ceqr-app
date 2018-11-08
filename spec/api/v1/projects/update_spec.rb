require 'rails_helper'

RSpec.describe "projects#update", type: :request do
  subject(:make_request) do
    jsonapi_put "/api/v1/projects/#{project.id}", payload
  end

  describe 'basic update' do
    let!(:project) { create(:project) }

    let(:payload) do
      {
        data: {
          id: project.id.to_s,
          type: 'projects',
          attributes: {
            # ... your attrs here
          }
        }
      }
    end

    # Replace 'xit' with 'it' after adding attributes
    xit 'updates the resource' do
      expect {
        make_request
      }.to change { project.reload.attributes }
      assert_payload(:project, project, json_item)

      # ... assert updates attributes ...
    end
  end
end
