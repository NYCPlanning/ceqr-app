class AdminMailer < ApplicationMailer
  def account_in_review
    @user = params[:user]
    @token = params[:token]
    @base_url = params[:base_url]

    mail(
      to: ENV['ADMIN_EMAILS'],
      reply_to: @user.email,
      subject: '[CEQR App] Access Requested'
    )
  end
end
