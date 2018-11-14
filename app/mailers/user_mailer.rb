class UserMailer < ApplicationMailer
  def account_activation
    @user = params[:user]
    @url  = 'http://example.com/login'
    mail(to: @user.email, subject: '[CEQR App] Account Activation')
  end

  def account_in_review
    @user = params[:user]
    @url  = 'http://example.com/login'
    mail(to: @user.email, subject: '[CEQR App] Account waiting for approval')
  end
end
