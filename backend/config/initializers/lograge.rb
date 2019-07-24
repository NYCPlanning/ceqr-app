if defined?(Lograge)
  Rails.application.configure do
    config.lograge.enabled = true
    config.lograge.ignore_actions = ['Rails::WelcomeController#index']
  end
end
