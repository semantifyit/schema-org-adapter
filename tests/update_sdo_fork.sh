#!/bin/bash

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
  jest --globals="{\"commitBase\":\"$SDO_COMMIT\"}"
  if [[ $? == 0 ]];
  then
    echo "All tests ran successfully"
    echo "Update fork ..."
    git clone --single-branch https://github.com/semantifyit/schemaorg.git
    cd schemaorg
    git remote add upstream https://github.com/schemaorg/schemaorg.git
    git fetch upstream main
    git checkout main
    git merge $SDO_COMMIT
    git push
  else
    echo "Some test/s didn't run sucessfully"
  fi;
fi;

