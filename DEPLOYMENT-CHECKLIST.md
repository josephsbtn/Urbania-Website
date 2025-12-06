# 📋 Deployment Checklist

Copy this checklist and check off items as you complete them!

## Pre-Deployment
- [ ] Code pushed to GitHub
- [ ] All dependencies listed in package.json/requirements.txt
- [ ] Environment variables documented
- [ ] Static data files in correct locations

## MongoDB Atlas
- [ ] Created free M0 cluster
- [ ] Created database user
- [ ] Whitelisted IP: 0.0.0.0/0
- [ ] Got connection string
- [ ] Tested connection locally

## Backend (Render)
- [ ] Created new Web Service
- [ ] Connected GitHub repository
- [ ] Set root directory: `backend`
- [ ] Set build command: `npm install`
- [ ] Set start command: `node server.js`
- [ ] Added environment variables:
  - [ ] MONGODB_URI
  - [ ] PORT=8000
  - [ ] NODE_ENV=production
- [ ] Deployed successfully
- [ ] Tested API endpoint: `/api/public-service/hospitals`
- [ ] Copied backend URL: ________________

## ML Service (Render)
- [ ] Created new Web Service
- [ ] Connected GitHub repository
- [ ] Set root directory: `ml`
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `python app.py`
- [ ] Runtime: Python 3.11
- [ ] Deployed successfully
- [ ] Tested endpoint: `/forecast/electricity`
- [ ] Copied ML URL: ________________

## Frontend (Vercel)
- [ ] Imported GitHub repository
- [ ] Set framework: Vite
- [ ] Set root directory: `frontend`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`
- [ ] Added environment variables:
  - [ ] VITE_API_URL=(backend URL)
  - [ ] VITE_ML_URL=(ML service URL)
- [ ] Deployed successfully
- [ ] Tested frontend loads
- [ ] Checked browser console (no errors)
- [ ] Copied frontend URL: ________________

## Data Import
- [ ] Installed MongoDB CLI tools
- [ ] Ran import script:
  ```powershell
  .\import-to-atlas.ps1 "mongodb+srv://..."
  ```
- [ ] Verified hospitals imported (162 records)
- [ ] Verified police imported (126 records)
- [ ] Tested backend returns data

## Testing
- [ ] Frontend loads without errors
- [ ] Map displays with markers
- [ ] Hospital markers (red 🏥) visible
- [ ] Police markers (blue 🚔) visible
- [ ] Dashboard shows correct data:
  - [ ] Happiness Index: 75%
  - [ ] Hospitals count
  - [ ] Police count
  - [ ] Weather with UV Index
  - [ ] AQI displayed
- [ ] ML Panel shows predictions:
  - [ ] Electricity forecast
  - [ ] Water forecast
  - [ ] Solar potential
- [ ] Click marker shows popup
- [ ] All panels render correctly

## Post-Deployment
- [ ] Updated README with live URLs
- [ ] Documented any issues
- [ ] Set up uptime monitoring (optional)
- [ ] Set up auto-ping to keep awake (optional)
- [ ] Shared with team/judges

## Optional: Keep Services Awake
- [ ] Created cron-job.org account
- [ ] Added ping jobs (every 14 minutes):
  - [ ] Backend: `GET /api/public-service/hospitals`
  - [ ] ML: `GET /forecast/electricity`

## 🎉 Deployment Complete!

**Live URLs:**
- Frontend: ________________
- Backend: ________________
- ML Service: ________________

**Notes:**
_____________________________________
_____________________________________
_____________________________________

**Issues Encountered:**
_____________________________________
_____________________________________
_____________________________________

**Date Deployed:** ________________
