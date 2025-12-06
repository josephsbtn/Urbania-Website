# 🚀 Quick Reference - Render Deployment

## 📋 Checklist Singkat

### ✅ MongoDB Atlas
```
1. mongodb.com/cloud/atlas → Sign up
2. Create M0 FREE cluster (Singapore region)
3. Database Access → Add user: urbania_admin
4. Network Access → Allow 0.0.0.0/0
5. Connect → Get connection string
6. Import data with mongoimport
```

**Connection String Format:**
```
mongodb+srv://urbania_admin:PASSWORD@cluster.mongodb.net/urbania?retryWrites=true&w=majority
```

---

### ✅ GitHub
```bash
git init
git add .
git commit -m "Deploy to Render"
git remote add origin https://github.com/USERNAME/urbania.git
git push -u origin main
```

---

### ✅ Render Backend
```
1. render.com → New Web Service
2. Connect GitHub repo
3. Root: backend
4. Build: npm install
5. Start: node server.js
6. Env: MONGODB_URI, NODE_ENV=production, PORT=8000
7. Deploy → Copy URL
```

**URL:** `https://urbania-backend.onrender.com`

---

### ✅ Render ML Service
```
1. New Web Service
2. Same repo
3. Root: ml
4. Build: pip install -r requirements.txt
5. Start: python app.py
6. Env: FLASK_ENV=production
7. Deploy → Copy URL
```

**URL:** `https://urbania-ml.onrender.com`

---

### ✅ Vercel Frontend
```
1. vercel.com → Import Project
2. Framework: Vite
3. Root: frontend
4. Env: 
   - VITE_API_URL=https://urbania-backend.onrender.com/api
   - VITE_ML_URL=https://urbania-ml.onrender.com
5. Deploy → Done!
```

**URL:** `https://urbania.vercel.app`

---

## 🧪 Testing Commands

### Test Backend:
```bash
curl https://urbania-backend.onrender.com/api/public-service/hospitals
```

### Test ML:
```bash
curl https://urbania-ml.onrender.com/forecast/electricity
```

### Test Frontend:
```
https://urbania.vercel.app
```

---

## 🔑 Environment Variables

### Backend (Render):
| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://...` |
| `NODE_ENV` | `production` |
| `PORT` | `8000` |

### Frontend (Vercel):
| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://urbania-backend.onrender.com/api` |
| `VITE_ML_URL` | `https://urbania-ml.onrender.com` |

---

## 💰 Costs
- MongoDB Atlas M0: **FREE** (512MB)
- Render Free Tier: **FREE** (750h/month)
- Vercel Hobby: **FREE** (unlimited)

**Total: $0/month** 🎉

---

## ⚠️ Important

1. **Cold Start**: Render free tier sleeps → first request ~30s
2. **Keep Awake**: Use cron-job.org to ping every 14 min
3. **Auto Deploy**: Push to GitHub → auto deploys everywhere
4. **Logs**: Check Render dashboard if issues

---

## 🆘 Quick Fixes

**502 Bad Gateway?**
→ Check MongoDB connection string

**Frontend can't load?**
→ Verify VITE_API_URL correct

**No data showing?**
→ Import data to MongoDB Atlas

**ML timeout?**
→ Wait 30s for cold start

---

## 📱 Live URLs

After deployment, update these:
- Frontend: ________________
- Backend: ________________
- ML: ________________

**Deployment Date:** ________ 
**Status:** 🟢 Live / 🔴 Issues
