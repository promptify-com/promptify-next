#!/bin/bash

set -e

if git diff --name-only | grep -q "sitemap.xml"; then
  echo "\"sitemap.xml\" has been modified. Preparing to commit and push changes."

  git config --global user.email "sitempa@github.com"
  git config --global user.name "sitemap"

  git add public/sitemap.xml

  git commit -m "chore: automatic update sitemap.xml [skip-cd]"

  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  git push origin "$BRANCH"

  echo "Changes to sitemap.xml have been pushed to branch \"$BRANCH\"."
else
  echo "\"sitemap.xml\" has not been modified. No changes to commit."
fi
