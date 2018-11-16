class AuthenticateUser
  def initialize(email, password)
    @email = email
    @password = password
  end

  # Service entry point
  def call
    JsonWebToken.encode(user_id: user.id) if user
  end

  private

  attr_reader :email, :password

  # verify user credentials
  def user
    user = User.find_by(email: email)

    raise(ExceptionHandler::AuthenticationError, Message.invalid_credentials) unless user
    raise(ExceptionHandler::AuthenticationError, Message.account_pending_approval) unless user.account_approved
    raise(ExceptionHandler::AuthenticationError, Message.email_not_validated) unless user.email_validated

    return user if user.authenticate(password)

    raise(ExceptionHandler::AuthenticationError, Message.invalid_credentials)
  end
end