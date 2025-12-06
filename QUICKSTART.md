# 🚀 Quick Deploy Guide - FREE Hosting

## Option 1: Full Stack on Free Tier (RECOMMENDED)

### ✅ What You'll Get:
- Frontend: **Vercel** (Fast, unlimited bandwidth)
- Backend: **Render** (Auto-sleep, 750h/month free)
- ML Service: **Render** (Auto-sleep, 750h/month free)
- Database: **MongoDB Atlas** (512MB free forever)

**Total Cost: $0/month** 💰

---

## 🎯 Step-by-Step (15 minutes)

### 1️⃣ Setup MongoDB Atlas (5 min)
```
1. Go to mongodb.com/cloud/atlas
2. Sign up (free)
3. Create Cluster → M0 FREE
4. Create Database User
5. Network Access → Add IP: 0.0.0.0/0
6. Copy connection string
```

### 2️⃣ Deploy Backend to Render (3 min)
```
1. Push code to GitHub
2. render.com → New Web Service
3. Connect GitHub repo
4. Root Directory: backend
5. Build: npm install
6. Start: node server.js
7. Add env vars:
   MONGODB_URI=mongodb+srv://...
   PORT=8000
8. Deploy!
```

### 3️⃣ Deploy ML to Render (3 min)
```
1. New Web Service
2. Root Directory: ml
3. Build: pip install -r requirements.txt
4. Start: python app.py
5. Deploy!
```

### 4️⃣ Deploy Frontend to Vercel (2 min)
```
1. vercel.com → Import Project
2. Select GitHub repo
3. Root Directory: frontend
4. Add env vars:
   VITE_API_URL=https://your-backend.onrender.com
   VITE_ML_URL=https://your-ml.onrender.com
5. Deploy!
```

### 5️⃣ Import Data (2 min)
```powershell
# Windows
.\import-to-atlas.ps1 "mongodb+srv://..."

# Linux/Mac
./import-to-atlas.sh "mongodb+srv://..."
```

---

## 🎉 Done!

Your app is live at:
- **Frontend**: `https://your-app.vercel.app`
- **Backend**: `https://your-backend.onrender.com`
- **ML**: `https://your-ml.onrender.com`

---

## ⚡ Pro Tips

1. **First load slow?** Render free tier sleeps after 15min. First request wakes it up (~30s).

2. **Keep it awake:** Use [cron-job.org](https://cron-job.org) to ping every 14 minutes:
   ```
   GET https://your-backend.onrender.com/api/public-service/hospitals
   ```

3. **Custom domain:** Both Vercel and Render support free custom domains!

4. **Monitor uptime:** Use [UptimeRobot](https://uptimerobot.com) (free 50 monitors)

---

## 🐛 Troubleshooting

**Backend 502 error?**
- Check MongoDB connection string
- Verify env vars in Render dashboard

**Frontend can't connect?**
- Update VITE_API_URL in Vercel
- Check CORS in backend (already configured)

**ML predictions empty?**
- Wait 30s for Render to wake up
- Check ML service logs in Render

---

## 📊 Usage Limits (Free Tier)

| Service | Limit | Reset |
|---------|-------|-------|
| Vercel | 100 GB bandwidth | Monthly |
| Render | 750 hours | Monthly |
| MongoDB Atlas | 512 MB storage | Never |

**Average usage:** ~500 hours/month = ✅ Within free tier!

---

## 🔄 Auto Deploy

Push to GitHub → Auto deploys to:
- ✅ Vercel (Frontend)
- ✅ Render (Backend + ML)

No manual deployment needed! 🎉
