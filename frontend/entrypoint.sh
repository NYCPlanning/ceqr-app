#!/bin/bash
if [ ! -d '/myapp/node_modules' ]; then
  yarn
fi

ember s
