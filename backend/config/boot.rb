ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

require 'bundler/setup' # Set up gems listed in the Gemfile.
# TODO: figure out why bootstap/setup throws an error when running in docker container
# require 'bootsnap/setup' # Speed up boot time by caching expensive operations.