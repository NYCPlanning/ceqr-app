class UsersController < ApplicationController
  skip_before_action :authorize_request, only: :create
  
  # POST /signup
  # return authenticated token upon signup
  def create
    if EmailWhitelist.on(user_params['email'])
      params = user_params.merge({
        account_approved: true
      })

      user = User.create!(params)

      UserMailer.with(user: user).account_activation.deliver_now

      response = { message: Message.account_created }
      json_response(response, :created)
    else
      user = User.create!(user_params)

      UserMailer.with(user: user).account_in_review.deliver_now
      AdminMailer.with(user: user).account_in_review.deliver_now

      response = { message: Message.account_in_review }
      json_response(response, :accepted)
    end
  end

  private

  def user_params
    params.require(:user).permit(
      :email,
      :password
    )
  end
end
