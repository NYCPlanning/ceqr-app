class AuthenticationController < ApiController
  skip_before_action :authorize_request, only: :authenticate
  
  # return auth token once user is authenticated
  def authenticate    
    token = AuthenticateUser.new(auth_params[:email], auth_params[:password]).call
    json_response(token: token)
  end

  private

  def auth_params
    params.permit(:email, :password)
  end
end
