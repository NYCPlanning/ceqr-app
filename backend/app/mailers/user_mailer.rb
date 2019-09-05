class UserMailer < ApplicationMailer
  def account_activation
    @user = params[:user]
    @token = params[:token]
    @base_url = params[:base_url]

    mail(to: @user.email, subject: '[CEQR App] Account Activation')
  end

  def account_in_review
    @user = params[:user]
    @from = ENV['ADMIN_EMAILS'],

    mail(to: @user.email, from: @from, subject: '[CEQR App] Account waiting for approval')
  end

  def password_reset
    @user = params[:user]
    @token = params[:token]
    @base_url = params[:base_url]

    mail(to: @user.email, subject: '[CEQR App] Password Reset')
  end
end
