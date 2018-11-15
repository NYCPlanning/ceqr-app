class UserMailer < ApplicationMailer
  def account_activation
    @user = params[:user]
    @activation_url = ""
    mail(to: @user.email, subject: '[CEQR App] Account Activation')
  end

  def account_in_review
    @user = params[:user]
    mail(to: @user.email, subject: '[CEQR App] Account waiting for approval')
  end

  def password_reset
    @user = params[:user]
    @reset_url = Rails.root_url
    mail(to: @user.email, subject: '[CEQR App] Password Reset')
  end
end
