class ApiController < JSONAPI::ResourceController
  include Response
  include ExceptionHandler
  
  # called before every action on controllers
  before_action :authorize_request
  attr_reader :current_user

  def context
    { current_user: @current_user }
  end
  
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :null_session

  private

  # Check for valid request token and return user
  def authorize_request
    @current_user ||= (AuthorizeApiRequest.new(request.headers).call)[:user]
  end
end
