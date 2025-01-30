#!/usr/bin/env bash

branch=$(git rev-parse --abbrev-ref HEAD)

if [[ "$branch" == "master" || "$branch" == "develop" ]]
then
  ./node_modules/.bin/commitlint -E "$@"
fi
