#!/bin/bash
rm -rf /app/tmp/**/*

bundle install --clean

bundle exec rails server -p $PORT -b '0.0.0.0'
