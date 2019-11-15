class Message
  def self.not_found(record = 'record')
    "Sorry, #{record} not found."
  end

  def self.invalid_credentials
    'Invalid credentials'
  end

  def self.account_pending_approval
    'Account pending approval'
  end

  def self.email_not_validated
    'Email is not validated'
  end

  def self.invalid_token
    'Invalid token'
  end

  def self.missing_token
    'Missing token'
  end

  def self.unauthorized
    'Unauthorized request'
  end

  def self.account_created
    'Account created successfully'
  end

  def self.account_in_review
    'Account has been added to the approval queue'
  end

  def self.account_not_created
    'Account could not be created'
  end

  def self.account_validated
    "Account validated. Please login to continue."
  end

  def self.account_approved
    "Account approved. The user can now login."
  end

  def self.password_reset_sent
    "Password reset email sent"
  end
  
  def self.password_reset
    "Password has been reset"
  end

  def self.expired_token
    'Sorry, your token has expired. Please login to continue.'
  end
end
