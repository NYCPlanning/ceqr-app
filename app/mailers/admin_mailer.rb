class AdminMailer < ApplicationMailer
  def account_in_review
    @user = params[:user]
    mail(to: ENV['ADMIN_EMAILS'], subject: '[CEQR App] Access Requested')
  end
end
