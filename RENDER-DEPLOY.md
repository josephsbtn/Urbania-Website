# 🚀 Deploy ke Render - Lengkap!

## Step 1: Setup MongoDB Atlas (5 menit)

### 1.1 Buat Cluster Gratis
1. Buka: https://www.mongodb.com/cloud/atlas/register
2. Sign up dengan email/Google
3. Klik **"Build a Database"**
4. Pilih **M0 FREE** (512 MB)
5. Provider: **AWS**
6. Region: **Singapore (ap-southeast-1)** atau terdekat
7. Cluster Name: `Urbania`
8. Klik **"Create"**

### 1.2 Setup Security
1. **Database Access** (sidebar kiri):
   - Add New Database User
   - Username: `urbania_admin`
   - Password: Generate → Copy password! **Simpan!**
   - Built-in Role: `Atlas Admin`
   - Add User

2. **Network Access** (sidebar kiri):
   - Add IP Address
   - Pilih: **"ALLOW ACCESS FROM ANYWHERE"** (0.0.0.0/0)
   - Confirm

### 1.3 Get Connection String
1. Klik **"Connect"** di cluster
2. Pilih **"Connect your application"**
3. Driver: **Node.js**, Version: **4.1 or later**
4. Copy connection string:
   ```
   mongodb+srv://urbania_admin:<password>@urbania.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. **Replace `<password>` dengan password Anda!**
6. Tambahkan nama database di akhir:
   ```
   mongodb+srv://urbania_admin:PASSWORD@urbania.xxxxx.mongodb.net/urbania?retryWrites=true&w=majority
   ```

✅ **Simpan connection string ini!**

---

## Step 2: Import Data ke MongoDB Atlas

### Windows (PowerShell):
```powershell
# Install MongoDB Database Tools jika belum:
# Download: https://www.mongodb.com/try/download/database-tools

# Ganti dengan connection string Anda:
$MONGO_URI = "mongodb+srv://urbania_admin:PASSWORD@urbania.xxxxx.mongodb.net/urbania"

# Import hospitals
mongoimport --uri $MONGO_URI --collection hospitals --file DATA/Urbania.Health-Facilities.json --jsonArray --drop

# Import police stations
mongoimport --uri $MONGO_URI --collection polices --file DATA/Urbania.Police.json --jsonArray --drop
```

### Atau pakai script otomatis:
```powershell
.\import-to-atlas.ps1 "mongodb+srv://urbania_admin:PASSWORD@urbania.xxxxx.mongodb.net/urbania"
```

**Expected output:**
```
✅ 162 hospitals imported
✅ 126 police stations imported
```

---

## Step 3: Push ke GitHub

```powershell
# Di root folder project
git init
git add .
git commit -m "Ready for Render deployment"

# Buat repo di GitHub, lalu:
git remote add origin https://github.com/USERNAME/urbania.git
git branch -M main
git push -u origin main
```

---

## Step 4: Deploy Backend ke Render

### 4.1 Create Web Service
1. Buka: https://dashboard.render.com/register
2. Sign up dengan GitHub
3. Klik **"New +"** → **"Web Service"**
4. Connect GitHub repository: `urbania`
5. **Settings:**
   - **Name**: `urbania-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free`

### 4.2 Environment Variables
Klik **"Advanced"** → **"Add Environment Variable"**:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | `mongodb+srv://urbania_admin:PASSWORD@...` |
| `NODE_ENV` | `production` |
| `PORT` | `8000` |

### 4.3 Deploy!
- Klik **"Create Web Service"**
- Wait ~3-5 minutes untuk build
- Check logs: Should see "Database Connection Success"
- Copy URL: `https://urbania-backend.onrender.com`

---

## Step 5: Deploy ML Service ke Render

### 5.1 Create Web Service
1. Dashboard Render → **"New +"** → **"Web Service"**
2. Select same GitHub repo
3. **Settings:**
   - **Name**: `urbania-ml`
   - **Root Directory**: `ml`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python app.py`
   - **Instance Type**: `Free`

### 5.2 Deploy!
- Klik **"Create Web Service"**
- Wait ~5-8 minutes (ML dependencies besar)
- Copy URL: `https://urbania-ml.onrender.com`

---

## Step 6: Deploy Frontend ke Vercel

### 6.1 Import Project
1. Buka: https://vercel.com/signup
2. Sign up dengan GitHub
3. Klik **"Add New..."** → **"Project"**
4. Import `urbania` repository
5. **Settings:**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 6.2 Environment Variables
Klik **"Environment Variables"**:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://urbania-backend.onrender.com/api` |
| `VITE_ML_URL` | `https://urbania-ml.onrender.com` |

### 6.3 Deploy!
- Klik **"Deploy"**
- Wait ~2 minutes
- Your site: `https://urbania.vercel.app` atau custom URL

---

## Step 7: Testing

### 7.1 Test Backend
```powershell
# Test API
curl https://urbania-backend.onrender.com/api/public-service/hospitals
```
Should return: `{"result":[...]}` dengan data hospitals

### 7.2 Test ML
```powershell
curl https://urbania-ml.onrender.com/forecast/electricity
```
Should return: `{"electricity_forecast":{...}}`

### 7.3 Test Frontend
1. Buka: `https://urbania.vercel.app`
2. Check:
   - ✅ Map loads
   - ✅ Hospital markers visible (red 🏥)
   - ✅ Police markers visible (blue 🚔)
   - ✅ Dashboard shows data
   - ✅ Weather UV Index (not N/A)
   - ✅ ML predictions panel

---

## ⚠️ Important Notes

### Free Tier Limitations:
- **Render Free**: Services sleep after 15 minutes inactivity
- **First request**: Takes ~30 seconds to wake up
- **750 hours/month**: Enough for 24/7 if you keep awake

### Keep Services Awake (Optional):
Use **cron-job.org** untuk ping setiap 14 menit:

1. Daftar: https://cron-job.org
2. Create job:
   - URL: `https://urbania-backend.onrender.com/api/public-service/hospitals`
   - Interval: Every 14 minutes
3. Create job #2:
   - URL: `https://urbania-ml.onrender.com/forecast/electricity`
   - Interval: Every 14 minutes

---

## 🎉 Done!

**Your Live URLs:**
- 🌐 Frontend: `https://urbania.vercel.app`
- 🔧 Backend: `https://urbania-backend.onrender.com`
- 🤖 ML: `https://urbania-ml.onrender.com`

### Auto Deploy Setup:
- Push to GitHub → Auto deploys to all services! 🚀

---

## 🐛 Troubleshooting

**Backend 502 Error?**
```
✅ Check MongoDB connection string correct
✅ Check MONGODB_URI in Render env vars
✅ Check MongoDB Network Access: 0.0.0.0/0
```

**Frontend can't connect?**
```
✅ Update VITE_API_URL in Vercel
✅ Check backend URL ends with /api
✅ Hard refresh: Ctrl+Shift+R
```

**ML service timeout?**
```
✅ Wait 30 seconds for cold start
✅ Check Render logs for errors
✅ Verify requirements.txt has all deps
```

**No data showing?**
```
✅ Verify MongoDB data imported
✅ Check backend logs in Render
✅ Test API endpoints with curl
```

---

## 📊 Monitoring

### Render Dashboard:
- View logs real-time
- Check CPU/Memory usage
- Monitor deploy status

### MongoDB Atlas:
- View Collections → Should see `hospitals` (162) and `polices` (126)
- Monitor queries
- Check storage usage

---

## 💡 Pro Tips

1. **Custom Domain**: Both Vercel and Render support custom domains (free!)
2. **SSL/HTTPS**: Auto-enabled on all platforms
3. **Logs**: Check Render logs if something fails
4. **Redeploy**: Push to GitHub or click "Manual Deploy" in Render
5. **Scale**: Upgrade to paid if you need 24/7 uptime

---

**Need help? Check logs first!**
- Backend logs: Render Dashboard → urbania-backend → Logs
- ML logs: Render Dashboard → urbania-ml → Logs
- Frontend: Browser Console (F12)
