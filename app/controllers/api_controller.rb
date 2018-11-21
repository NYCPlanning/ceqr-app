class ApiController < ApplicationController
  include JSONAPI::ActsAsResourceController

  # called before every action on controllers
  before_action :authorize_request
  attr_reader :current_user

  def context
    { current_user: @current_user }
  end

  private

  # Check for valid request token and return user
  def authorize_request
    @current_user ||= (AuthorizeApiRequest.new(request.headers).call)[:user]
  end
end
