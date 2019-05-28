require "rails_helper"

RSpec.describe AdminMailer, type: :mailer do
  describe "#account_in_review email" do
    let(:user) { create(:user, email: "test@example.com") }
    
    it "sends an email" do
      expect {
        @email = AdminMailer.with(user: user).account_in_review.deliver_now 
      }.to change {
        ActionMailer::Base.deliveries.count
      }.by(1)
      
      expect(@email.from).to eq(["no-reply@ceqr.app"])
      expect(@email.to).to eq(ENV['ADMIN_EMAILS'].split(','))
      expect(@email.reply_to).to eq(["test@example.com"])
      expect(@email.subject).to eq("[CEQR App] Access Requested")
    end
  end
end
