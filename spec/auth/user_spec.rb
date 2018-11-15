require 'rails_helper'

RSpec.describe 'Users API', type: :request do
  let(:user) { build(:user) }
  let(:user_public) { build(:user_public) }

  let(:headers) { valid_headers.except('Authorization') }

  let(:user_approved) do
    attributes_for(:user)
  end
  let(:user_public) do
    attributes_for(:user_public)
  end

  # User signup test suite
  describe 'POST /signup' do
    context 'when valid request' do
      context 'when email is on whitelist' do
        before { post '/signup', params: { user: user_approved }.to_json, headers: headers }

        it 'creates a new user with approved status' do
          u = User.first
  
          expect(u.account_approved).to be true
          expect(response).to have_http_status(201)
        end
  
        it 'returns success message' do
          expect(json['message']).to match(/Account created successfully/)
        end
  
        it 'does not return an authentication token' do
          expect(json['token']).to be_nil
        end
  
        it 'sends account confirmation email' do
          mail = ActionMailer::Base.deliveries.last

          expect(mail.to).to include 'test@planning.nyc.gov'
          expect(mail.subject).to eq '[CEQR App] Account Activation'
        end
      end

      context 'when email is not on whitelist' do
        before { post '/signup', params: { user: user_public }.to_json, headers: headers }
        
        it 'creates a new user with pending approved status' do
          u = User.first

          expect(u.account_approved).to be false
          expect(response).to have_http_status(202)
        end
  
        it 'returns in review message' do
          expect(json['message']).to match(/Account has been added to the approval queue/)
        end
  
        it 'does not return an authentication token' do
          expect(json['token']).to be_nil
        end
  
        it 'sends account review email to user' do
          mails = ActionMailer::Base.deliveries

          expect(mails.map(&:to)).to include ['test@example.com']
          expect(mails.map(&:subject)).to include '[CEQR App] Account waiting for approval'
        end

        it 'sends account review email to admin' do
          mails = ActionMailer::Base.deliveries

          expect(mails.map(&:subject)).to include '[CEQR App] Access Requested'
        end
      end
    end

    context 'when invalid request' do
      before { post '/signup', params: {}, headers: headers }

      it 'does not create a new user' do
        expect(response).to have_http_status(422)
      end

      it 'returns failure message' do
        expect(json['message'])
          .to match(/param is missing or the value is empty: user/)
      end
    end
  end
end

describe 'PUT /user/:id/validate' do
  context 'with valid token' do
    before { post 'user/password_reset', params: {  }, headers: headers }
  end

  context 'without valid token' do

  end
end

describe 'POST /user/password_reset' do

end

describe 'PUT /user/:id/password_reset' do

end