# Urbania - Smart City Dashboard 🏙️

Cyberpunk-themed city management dashboard with real-time monitoring, ML predictions, and interactive map visualization.

![Urbania Dashboard](https://img.shields.io/badge/TechnoFest-2025-blue) ![License](https://img.shields.io/badge/license-MIT-green)

## ✨ Features

- 🗺️ **Interactive Map** - MapLibre GL with Singapore city data
- 🏥 **Facility Tracking** - 1000+ hospitals, 200+ police stations
- 🌤️ **Real Weather** - UV Index & Air Quality Index
- 🤖 **ML Predictions** - Electricity, water consumption, solar potential
- 📊 **Analytics Dashboard** - Happiness index, city metrics
- 🎨 **Cyberpunk UI** - GTA/Cyberpunk 2077 inspired design

## 🚀 Quick Start

### Local Development
```bash
# Backend
cd backend
npm install
node server.js

# ML Service
cd ml
pip install -r requirements.txt
python app.py

# Frontend
cd frontend
npm install
npm run dev
```

Visit: `http://localhost:5173`

## 🌐 Deploy for FREE

**Total Cost: $0/month** 💰

See [QUICKSTART.md](./QUICKSTART.md) for detailed deployment guide.

### Quick Deploy:
1. **Frontend** → Vercel (unlimited)
2. **Backend** → Render (750h/month)
3. **ML Service** → Render (750h/month)
4. **Database** → MongoDB Atlas (512MB)

[📖 Full Deployment Guide](./DEPLOYMENT.md)

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, TailwindCSS v4, MapLibre GL
- **Backend**: Node.js, Express, MongoDB, Redis
- **ML**: Python, Flask, TensorFlow, YOLO
- **APIs**: OpenWeatherMap, Singapore Gov, WAQI

## 📂 Project Structure

```
Urbania-Website/
├── frontend/          # React + Vite
├── backend/           # Node.js + Express
├── ml/                # Python + Flask
├── DATA/              # City data (hospitals, police)
└── docs/              # Documentation
```

## 🎯 Made for TechnoFest 2025

Built with ❤️ for smart city innovation.

## 📄 License

MIT License - Free to use and modify!
