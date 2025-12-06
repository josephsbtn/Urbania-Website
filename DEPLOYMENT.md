# Urbania - Smart City Dashboard 🏙️

Cyberpunk-themed city management dashboard for monitoring facilities, weather, and ML predictions.

## 🚀 Free Hosting Setup

### Prerequisites
- GitHub account
- Vercel account (free)
- Render account (free)
- MongoDB Atlas account (free)

---

## 📦 Deployment Steps

### 1. **MongoDB Atlas Setup**
1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free M0 cluster
3. Create database user & password
4. Whitelist IP: `0.0.0.0/0` (allow all)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/urbania`

### 2. **Deploy Backend to Render**
1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. New → Web Service
4. Connect GitHub repo
5. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment Variables**:
     ```
     MONGODB_URI=mongodb+srv://...
     PORT=8000
     NODE_ENV=production
     ```
6. Deploy!
7. Copy your backend URL: `https://your-app.onrender.com`

### 3. **Deploy ML Service to Render**
1. New → Web Service
2. Connect same GitHub repo
3. Settings:
   - **Root Directory**: `ml`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Environment**: `Python 3`
4. Deploy!
5. Copy ML service URL: `https://your-ml-app.onrender.com`

### 4. **Deploy Frontend to Vercel**
1. Go to [vercel.com](https://vercel.com)
2. Import GitHub repository
3. Settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     VITE_ML_URL=https://your-ml-app.onrender.com
     ```
4. Deploy!
5. Your site: `https://your-app.vercel.app`

---

## 🔧 Configuration

### Update Frontend API URLs

Edit `frontend/src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || '/api';
const ML_URL = import.meta.env.VITE_ML_URL || 'http://localhost:5000';
```

### Import Data to MongoDB Atlas

After deployment, run:
```bash
mongoimport --uri "mongodb+srv://..." --collection hospitals --file DATA/Urbania.Health-Facilities.json --jsonArray
mongoimport --uri "mongodb+srv://..." --collection polices --file DATA/Urbania.Police.json --jsonArray
```

---

## 💰 Cost Breakdown (All FREE!)

| Service | Plan | Limits |
|---------|------|--------|
| **Vercel** | Hobby | Unlimited bandwidth, 100 deployments/day |
| **Render** | Free | 750 hours/month (auto-sleep after 15min inactive) |
| **MongoDB Atlas** | M0 Free | 512 MB storage, shared cluster |

---

## ⚠️ Important Notes

1. **Auto-sleep**: Render free tier sleeps after 15min inactivity. First request takes ~30s to wake up.
2. **MongoDB**: Import your data AFTER deploying backend.
3. **CORS**: Already configured in backend for cross-origin requests.
4. **Environment Variables**: Set all env vars in each platform's dashboard.

---

## 🎯 Alternative: Deploy Everything on Render

If you prefer single platform:
- Frontend: Static Site
- Backend: Web Service
- ML: Web Service
- Database: MongoDB Atlas

---

## 📞 Support

Issues? Check:
1. Environment variables are set correctly
2. MongoDB whitelist includes `0.0.0.0/0`
3. Backend/ML URLs updated in frontend
4. CORS enabled in backend

---

## 🎉 Live Demo

After deployment:
- Frontend: `https://urbania-dashboard.vercel.app`
- Backend API: `https://urbania-api.onrender.com`
- ML Service: `https://urbania-ml.onrender.com`

**Made for TechnoFest 🚀**
