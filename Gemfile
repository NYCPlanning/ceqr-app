source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

ruby '2.6.0'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
gem 'rails', '~> 5.2.1'
gem 'pg'
# Use Puma as the app server
gem 'puma', '~> 3.11'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'

# Use ActiveModel has_secure_password
gem 'bcrypt', '~> 3.1.12'
gem 'jwt'

gem 'sentry-raven'

# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', '>= 1.1.0', require: false

# Use Rack CORS for handling Cross-Origin Resource Sharing (CORS), making cross-origin AJAX possible
# gem 'rack-cors'

gem "ember-cli-rails", '~> 0.10.0'

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

gem 'jsonapi-resources'
gem "interactor", "~> 3.1"

gem 'rgeo'
gem 'rgeo-geojson'
gem 'activerecord-postgis-adapter'

gem 'rails_12factor', group: [:staging, :production]

group :development do
  gem 'listen', '>= 3.0.5', '< 3.2'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
end

group :development, :test do
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  gem 'byebug', platforms: [:mri, :mingw, :x64_mingw]

  gem 'dotenv-rails'

  gem 'rspec-rails', '~> 3.5.2'
  gem 'factory_bot_rails', '~> 4.0'
  gem 'shoulda-matchers', '~> 3.1'
  gem 'faker', '~> 1.9.1'
  gem 'rspec-activemodel-mocks'

  # This is a jsonapi test helper tied to another JSONAPI (previous JSONAPI Suite, now called Graphiti) ruby gem. 
  # It was the most elegant, in my opinion.
  # gem 'graphiti_spec_helpers'

  gem 'simplecov', require: false
end

group :test do
  gem 'database_cleaner', '~> 1.6'
end