class UsersController < ApiController
  skip_before_action :authorize_request
  
  def create
    if EmailWhitelist.on(user_params['email'])
      params = user_params.merge({
        account_approved: true
      })

      user = User.create!(params)

      token = JsonWebToken.encode({ action: 'validate', email: user.email })
      UserMailer.with(user: user, token: token).account_activation.deliver_now

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

  def validate
    token = JsonWebToken.decode(validate_params['token'])

    unless token['action'] == 'validate'
      raise ActionController::ParameterMissing, 'Incorrect action'
    end 

    User.find_by(email: token['email']).update!(email_validated: true)

    response = { message: Message.account_validated }
    json_response(response, :ok)
  end

  def request_new_password
    user = User.find_by(email: password_reset_params['email'])

    token = JsonWebToken.encode({ action: 'password_reset', email: user.email })
    UserMailer.with(user: user, token: token).password_reset.deliver_now

    response = { message: Message.password_reset_sent }
    json_response(response, :ok)
  end

  def update_password
    token = JsonWebToken.decode(password_reset_params['token'])

    unless token['action'] == 'password_reset'
      raise ActionController::ParameterMissing, 'Incorrect action'
    end

    user = User.find_by(email: token['email'])
    user.password = user.password_confirmation = password_reset_params['password']
    user.save!

    response = { message: Message.password_reset }
    json_response(response, :ok)
  end

  private

  def password_reset_params
    params.permit(
      :token,
      :email,
      :password
    )
  end

  def validate_params
    params.permit(
      :token
    )
  end

  def user_params
    params.require(:user).permit(
      :email,
      :password
    )
  end
end
