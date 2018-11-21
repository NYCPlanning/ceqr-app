require 'rails_helper'

RSpec.describe 'Authentication AUTH', type: :request do
  # Authentication test suite
  describe 'POST /auth/v1/login' do
    # set headers for authorization
    let(:headers) { valid_headers.except('Authorization') }
    # set test valid and invalid credentials
    let(:valid_credentials) do
      {
        email: user.email,
        password: user.password
      }.to_json
    end
    let(:invalid_credentials) do
      {
        email: Faker::Internet.email,
        password: Faker::Internet.password
      }.to_json
    end

    # set request.headers to our custon headers
    # before { allow(request).to receive(:headers).and_return(headers) }

    # returns auth token when request is valid
    context 'When request is valid' do
      context 'When user is not validated' do
        let!(:user) { create(:user, { email_validated: false }) }

        before { post '/auth/v1/login', params: valid_credentials, headers: headers }

        it 'does not return authentication token' do
          expect(json['token']).to be_nil
        end

        it 'returns a failure message' do
          expect(json['message']).to match(/Email is not validated/)
        end
      end
      
      
      context 'When user is not approved' do
        let!(:user) { create(:user, { account_approved: false }) }

        before { post '/auth/v1/login', params: valid_credentials, headers: headers }

        it 'does not return authentication token' do
          expect(json['token']).to be_nil
        end

        it 'returns a failure message' do
          expect(json['message']).to match(/Account pending approval/)
        end
      end

      context 'When user is validated and approved' do
        let!(:user) { create(:user) }
        
        before { post '/auth/v1/login', params: valid_credentials, headers: headers }

        it 'returns an authentication token' do
          expect(json['token']).not_to be_nil
        end  
      end
    end

    # returns failure message when request is invalid
    context 'When request is invalid' do
      let!(:user) { create(:user) }
      
      before { post '/auth/v1/login', params: invalid_credentials, headers: headers }

      it 'does not return authentication token' do
        expect(json['token']).to be_nil
      end

      it 'returns a failure message' do
        expect(json['message']).to match(/Invalid credentials/)
      end
    end
  end
end