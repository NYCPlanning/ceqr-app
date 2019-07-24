#!/bin/bash
rm -rf /app/tmp/**/*

# Only re-install if Gemfile.lock is missing or empty
if [[ ! -f Gemfile.lock  || ! -s Gemfile.lock ]]; then
    bundle install --clean
fi

bundle exec rails server -p $PORT -b '0.0.0.0'
