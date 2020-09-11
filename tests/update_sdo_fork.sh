#!/bin/bash

# README:
# =======
# This script compares the schema.org GitHub repository with the semantify.it GitHub fork of schema.org
# If there are differences, it runs the tests with the code from the schema.org GitHub repository
# If all succeed, it update the fork
#
# REQUIREMENTS:
# =============
# - curl
# - jq
# - jest (npm package)
# - git (configured with push rights to https://github.com/semantifyit/schemaorg.git)

set -x

echo "Compare schema.org Github repository and fork"

SDO_COMMIT=$(curl -s https://api.github.com/repos/schemaorg/schemaorg/commits/main | jq -r '.sha')
SEMANTIFY_COMMIT=$(curl -s https://api.github.com/repos/semantifyit/schemaorg/commits/main | jq -r '.sha')

if [[ "$SDO_COMMIT" == "$SEMANTIFY_COMMIT" ]];
then
  echo "There are no differences between schema.org GitHub repository and fork"
else
  echo "There are differences between schema.org GitHub and fork"
  echo "Running tests ..."
  DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"
  cd $DIR
  jest --globals="{\"commitBase\":\"$SDO_COMMIT\"}"
  if [[ $? == 0 ]];
  then
    echo "All tests ran successfully"
    echo "Update fork ..."
    git clone --single-branch git@github.com:semantifyit/schemaorg.git
    cd schemaorg
    git remote add upstream git@github.com:schemaorg/schemaorg.git
    git fetch upstream main
    git checkout main
    git merge $SDO_COMMIT
    git push
  else
    echo "Some test/s didn't run sucessfully"
  fi;
fi;
