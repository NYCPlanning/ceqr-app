require 'rails_helper'

RSpec.describe 'Users AUTH', type: :request do
  let(:headers) { valid_headers.except('Authorization') }
  
  describe 'POST /auth/v1/signup' do
    let(:user) { build(:user) }
    let(:user_public) { build(:user_public) }
  
    let(:user_approved) do
      attributes_for(:user)
    end
    let(:user_public) do
      attributes_for(:user_public)
    end
    
    context 'when valid request' do
      context 'when email is on whitelist' do
        before { post '/auth/v1/signup', params: { user: user_approved }.to_json, headers: headers }

        it 'creates a new user with approved status' do
          u = User.find_by_email(user_approved[:email])
  
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

          expect(mail.to).to include user_approved[:email]
          expect(mail.subject).to eq '[CEQR App] Account Activation'
        end
      end

      context 'when email is not on whitelist' do
        before { post '/auth/v1/signup', params: { user: user_public }.to_json, headers: headers }
        
        it 'creates a new user with pending approved status' do
          u = User.find_by_email(user_public[:email])

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

          expect(mails.map(&:to)).to include [user_public[:email]]
          expect(mails.map(&:subject)).to include '[CEQR App] Account waiting for approval'
        end

        it 'sends account review email to admin' do
          mails = ActionMailer::Base.deliveries

          expect(mails.map(&:subject)).to include '[CEQR App] Access Requested'
        end
      end
    end

    context 'when invalid request' do
      it 'does not create a new user' do
        expect {
          post '/auth/v1/signup', params: {}, headers: headers
        }.to_not change {
          User.count
        }
      
        expect(response).to have_http_status(422)
        expect(json['message']).to match(/param is missing or the value is empty: user/)
      end
    end
  end

  describe 'PUT /auth/v1/validate' do
    let(:user) { create(:new_user) }
    let(:token) { JsonWebToken.encode({ action: "validate", email: user.email }) }
    
    context 'with valid token' do
      before { put '/auth/v1/validate', params: { token: token }.to_json, headers: headers }
  
      it 'validates the user' do      
        expect(User.find_by_email(user.email).email_validated).to be true
      end
      
      it 'returns a 200' do
        expect(response).to have_http_status(200)
      end
    end

    context 'with expired token' do
      let(:expired_token) { JsonWebToken.encode({ action: "validate", email: user.email }, 7.days.ago) }
      
      before { put '/auth/v1/validate', params: { token: expired_token }.to_json, headers: headers }

      it 'does not validate the user' do
        expect(User.find_by_email(user.email).email_validated).to be false
      end
      
      it 'returns a 401' do
        expect(response).to have_http_status(401)
      end
    end
  
    context 'without valid token' do
      before { put '/auth/v1/validate', params: { token: 'badtoken' }.to_json, headers: headers }
  
      it 'does not validate the user' do
        expect(User.find_by_email(user.email).email_validated).to be false
      end
      
      it 'returns a 401' do
        expect(response).to have_http_status(401)
      end
    end
  end
  
  describe 'POST /auth/v1/password-reset' do
    let(:user) { create(:user) }
    
    before { post '/auth/v1/password-reset', params: { email: user.email }.to_json, headers: headers }
  
    it 'sends reset password email' do
      mail = ActionMailer::Base.deliveries.last
  
      expect(mail.to).to include user.email
      expect(mail.subject).to eq '[CEQR App] Password Reset'
    end
  
    it 'returns a 200' do
      expect(response).to have_http_status(200)
    end
  end
  
  describe 'PUT /auth/v1/password-reset' do
    let(:user) { create(:user, { password: 'foobar' }) }
    let(:token) { JsonWebToken.encode({ action: "password_reset", email: user.email }) }
  
    context 'with valid token' do
      before { put "/auth/v1/password-reset", params: { token: token, password: 'newpass' }.to_json, headers: headers }
      
      it 'resets the user password' do
        expect(User.find_by_email(user.email).authenticate('newpass')).to eq user
      end
      
      it 'returns a 200' do
        expect(response).to have_http_status(200)
      end
    end
  
    context 'without valid token' do
      before { put "/auth/v1/password-reset", params: { token: "badtoken", password: 'newpass' }.to_json, headers: headers }
      
      it 'does not reset the user password' do
        expect(User.first.authenticate('newpass')).to be false
      end
      
      it 'returns a 401' do
        expect(response).to have_http_status(401)
      end
    end
  end
end

