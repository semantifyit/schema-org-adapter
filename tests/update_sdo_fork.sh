#!/bin/bash

echo "Compare schema.org Github repository and fork"

SDO_COMMIT=$(wget -O - -o /dev/null https://api.github.com/repos/schemaorg/schemaorg/commits/main | sed -n 2p)
SEMANTIFY_COMMIT=$(wget -O - -o /dev/null https://api.github.com/repos/semantifyit/schemaorg/commits/main | sed -n 2p)

if [[ "$SDO_COMMIT" == "$SEMANTIFY_COMMIT" ]];
then
  echo "There are no differences between schema.org Github repository and fork"
else
  echo "There are differences between orign and fork"
  echo "Running tests ..."
  npm run test
  if [[ $? == 0 ]];
  then
    echo "All tests ran successfully"
    echo "Update fork ..."
    # TODO
  else
    echo "Some test/s didn't run sucessfully"
  fi;
fi;

