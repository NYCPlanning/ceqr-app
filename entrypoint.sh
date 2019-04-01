#!/bin/bash
if [ ! -d '/app/frontend/node_modules' ]; then
    cd /app/frontend && yarn
fi

rm -rf /app/tmp/**/*
bundle exec rails server -p $PORT -b '0.0.0.0'
