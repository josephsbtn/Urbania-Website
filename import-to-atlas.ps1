# Script to import data to MongoDB Atlas (Windows)
# Usage: .\import-to-atlas.ps1 "mongodb+srv://username:password@cluster.mongodb.net/urbania"

param(
    [Parameter(Mandatory=$true)]
    [string]$MongoDBUri
)

Write-Host "Importing hospitals..." -ForegroundColor Cyan
mongoimport --uri $MongoDBUri `
  --collection hospitals `
  --file DATA/Urbania.Health-Facilities.json `
  --jsonArray `
  --drop

Write-Host "Importing police stations..." -ForegroundColor Cyan
mongoimport --uri $MongoDBUri `
  --collection polices `
  --file DATA/Urbania.Police.json `
  --jsonArray `
  --drop

Write-Host "✅ Data import complete!" -ForegroundColor Green
Write-Host "Total collections imported: 2"
