class ApiController < ApplicationController
  include JSONAPI::ActsAsResourceController
  rescue_from Pundit::NotAuthorizedError, with: :user_not_authorized

  # called before every action on controllers
  before_action :authorize_request, :set_raven_context
  attr_reader :current_user

  def context
    { user: @current_user }
  end

  private

  # Check for valid request token and return user
  def authorize_request
    @current_user ||= (AuthorizeApiRequest.new(request.headers).call)[:user]
  end

  def set_raven_context
    Raven.user_context(id: current_user.id, email: current_user.email)
  end

  def user_not_authorized
    head :forbidden
  end
end
