#!/bin/bash

#setup

# GitHub username and personal access token
#USERNAME="your_username"
#TOKEN="your_personal_access_token"
#REPOS_PER_PAGE=100

# Temporary folder to store repositories
TMP_FOLDER="/tmp/github_repos"

# Create the temporary folder if it doesn't exist
mkdir -p "$TMP_FOLDER"

# Get a list of all repositories (public and private)
REPOS=$(curl -s -H "Authorization: token $TOKEN" "https://api.github.com/user/repos?per_page=$REPOS_PER_PAGE" | jq -r '.[].ssh_url')

# Iterate through each repository
for REPO in $REPOS; do
  # Extract repository name from the URL
  REPO_NAME=$(basename "$REPO" ".git")

  echo "Cloning $REPO_NAME..."
  # Clone the repository
  git clone "https://$TOKEN:x-oauth-basic@github.com/$USERNAME/$REPO_NAME" "$TMP_FOLDER/$REPO_NAME"
done

# Create a timestamp for the zip file name
TIMESTAMP=$(date +"%Y%m%d%H%M%S")
ZIP_FILENAME="github_repos_$TIMESTAMP.zip"
DEFAULT_WORKING_DIR=$PWD

# Zip all repositories into a single file
cd "$TMP_FOLDER" || exit
zip -r "$DEFAULT_WORKING_DIR/$ZIP_FILENAME" .

# Return to the previous directory
cd - || exit

# Remove the temporary folder and all cloned repositories
rm -rf "$TMP_FOLDER"

echo "All repositories downloaded and zipped to $ZIP_FILENAME"
