require 'rails_helper'

RSpec.describe 'projects', type: :request do
  let(:headers) { jsonapi_headers }
  let!(:user) { create(:user) }

  let!(:p1) { create(:project, name: "Mine") }
  let!(:p2) { create(:project, name: "Someone Else") }
  let!(:p3) { create(:project, name: "Yours") }

  before do
    create(:project_permission, project: p1, user: user, permission: 'editor')
    create(:project_permission, project: p2, user: user, permission: 'viewer')
  end

  describe 'POST /api/v1/projects' do
    it 'creates a new project' do
      attributes = attributes_for(:project_api)
      attributes["name"] = "New Cool Project"

      params = {
        data: {
          type: 'projects',
          attributes: attributes.transform_keys {|k| k.to_s.gsub(/_/, '-') },
          relationships: {
            'data-package': {
              'data': {
                type: "data-packages",
                id: DataPackage.latest_for('mappluto').id
              }
            }
          }
        }
      }.to_json
      
      post '/api/v1/projects', headers: headers, params: params

      p = Project.find(json["data"]["id"])

      expect(p.name).to eq("New Cool Project")
      expect(p.public_schools_analysis).to_not be_nil
      expect(p.transportation_analysis).to_not be_nil
      expect(p.community_facilities_analysis).to_not be_nil

      expect(response.status).to eq(201)
    end
  end

  describe 'PATCH /api/v1/projects/:id' do
    it "allows edits to editable projects" do      
      params = {
        data: {
          type: 'projects',
          id: p1.id,
          attributes: {
            name: "Changed"
          }
        }
      }.to_json

      patch "/api/v1/projects/#{p1.id}", headers: headers, params: params
      
      expect(response.status).to eq(200)
      expect(json["data"]["attributes"]["name"]).to eq("Changed")
    end

    it "does not allow edits to viewable projects" do
      params = {
        data: {
          type: 'projects',
          id: p2.id,
          attributes: {
            name: "Changed"
          }
        }
      }.to_json

      patch "/api/v1/projects/#{p2.id}", headers: headers, params: params
      
      expect(response.status).to eq(403)
      
      p2.reload
      expect(p2.name).to_not eq("Changed")
    end

    it "does not allow edits to non-editable projects" do
      params = {
        data: {
          type: 'projects',
          id: p3.id,
          attributes: {
            name: "Changed"
          }
        }
      }.to_json

      patch "/api/v1/projects/#{p3.id}", headers: headers, params: params
      
      expect(response.status).to eq(404)
      
      p3.reload
      expect(p3.name).to_not eq("Changed")
    end

    context "as an admin" do
      let!(:user) { create(:user, admin: true) }

      it "allows edits to viewable projects" do
        params = {
          data: {
            type: 'projects',
            id: p2.id,
            attributes: {
              name: "Changed"
            }
          }
        }.to_json
  
        patch "/api/v1/projects/#{p2.id}", headers: headers, params: params
        
        expect(response.status).to eq(200)
        expect(json["data"]["attributes"]["name"]).to eq("Changed")
      end

      it "allows edits to non-editable projects" do
        params = {
          data: {
            type: 'projects',
            id: p3.id,
            attributes: {
              name: "Changed"
            }
          }
        }.to_json
  
        patch "/api/v1/projects/#{p3.id}", headers: headers, params: params
        
        expect(response.status).to eq(200)
        expect(json["data"]["attributes"]["name"]).to eq("Changed")
      end
    end
  end

  describe 'GET /api/v1/projects' do        
    it "returns only projects editable and viewable" do
      get '/api/v1/projects', headers: headers

      project_names = json['data'].map { |p| p["attributes"]["name"] }

      expect(json['data'].count).to eq(2)
      expect(project_names).to include('Mine', 'Someone Else')
    end

    context "as an admin" do
      let!(:user) { create(:user, admin: true) }

      it "returns all projects" do
        get '/api/v1/projects', headers: headers
  
        project_names = json['data'].map { |p| p["attributes"]["name"] }
  
        expect(json['data'].count).to eq(3)
        expect(project_names).to include('Mine', 'Someone Else', 'Yours')
      end
    end
  end

  describe 'DELETE /api/v1/projects/:id' do
    it "deletes projects that are editable" do
      delete "/api/v1/projects/#{p1.id}", headers: headers
      
      expect(response.status).to eq(204)
    end
    
    it "does not delete projects that are not editable" do
      delete "/api/v1/projects/#{p2.id}", headers: headers

      expect(response.status).to eq(403)

      expect(Project.find(p2.id)).to_not be_nil
    end

    it "does not delete projects that are not viewable" do
      delete "/api/v1/projects/#{p3.id}", headers: headers

      expect(response.status).to eq(404)

      expect(Project.find(p3.id)).to_not be_nil
    end
  end
end
