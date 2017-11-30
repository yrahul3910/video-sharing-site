#!/bin/bash

# Delete all indices from search
echo "Deleting search indices..."
curl -XDELETE http://localhost:9200/qtube > /dev/null 2> /dev/null

# Delete folders
echo "Deleting user data..."
rm -rf videos/
rm -rf users/

# Re-run MySQL script
echo "Running MySQL script..."
mysql -u $1 -p < Creating_DB.sql

echo "Project reset complete."
