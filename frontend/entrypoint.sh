#!/bin/bash

### This is supposed to check if node modules exist
### in your container, and if not run yarn.
### This doesn't work because our package.json specifies node engine
### 8^ or 10^.  So you need to make sure you run yarn BEFORE trying to run
### docker-compose up.

# if [ ! -d '/myapp/node_modules' ]; then
#   yarn
# fi

ember s
