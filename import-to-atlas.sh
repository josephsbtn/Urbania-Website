#!/bin/bash

# Script to import data to MongoDB Atlas
# Usage: ./import-to-atlas.sh "mongodb+srv://username:password@cluster.mongodb.net/urbania"

if [ -z "$1" ]; then
  echo "Error: MongoDB URI required"
  echo "Usage: ./import-to-atlas.sh 'mongodb+srv://username:password@cluster.mongodb.net/urbania'"
  exit 1
fi

MONGODB_URI=$1

echo "Importing hospitals..."
mongoimport --uri "$MONGODB_URI" \
  --collection hospitals \
  --file DATA/Urbania.Health-Facilities.json \
  --jsonArray \
  --drop

echo "Importing police stations..."
mongoimport --uri "$MONGODB_URI" \
  --collection polices \
  --file DATA/Urbania.Police.json \
  --jsonArray \
  --drop

echo "✅ Data import complete!"
echo "Total collections imported: 2"
