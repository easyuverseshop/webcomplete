# EasyUVerse Platform - Complete Production Deployment Guide

This guide provides step-by-step instructions to deploy the **EasyUVerse** (`https://easyuverse.shop`) full-stack MERN platform live on Google, Vercel/Netlify, Render/Railway, and MongoDB Atlas.

---

## 1. Prerequisites & Environment Variables

### Backend Environment (`/server/.env`)
Create `.env` in the `/server` directory:
```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/easyuverse?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_2026
CLIENT_URL=https://easyuverse.shop

# Cloudinary Storage Credentials
CLOUDINARY_CLOUD_NAME=easyuverse
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Merchant Direct UPI Gateway
MERCHANT_UPI_ID=9241034816@mbkns
MERCHANT_NAME=Ujjwal Kant
```

### Frontend Environment (`/client/.env`)
Create `.env` in the `/client` directory:
```env
VITE_API_BASE_URL=https://api.easyuverse.shop/api
```

---

## 2. Backend Deployment (Render / Railway / VPS)

### Option A: Render Deployment (Recommended)
1. Push project to GitHub.
2. Connect your GitHub repository to [Render.com](https://render.com).
3. Create a **Web Service** with directory set to `/server`.
4. Build Command: `npm install`
5. Start Command: `npm start`
6. Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`).
7. Click **Deploy Web Service**.

### Option B: Node.js VPS (Ubuntu + NGINX + PM2)
```bash
# Connect to VPS
ssh root@your-vps-ip

# Clone Repo & Install Dependencies
git clone https://github.com/ujjwalkant/easyuverse.git
cd easyuverse/server
npm install

# Start Backend with PM2
pm2 start src/server.js --name "easyuverse-api"
pm2 save
pm2 startup
```

---

## 3. Frontend Deployment (Vercel / Netlify)

### Option A: Vercel (Recommended)
1. Go to [Vercel.com](https://vercel.com) and import your GitHub repository.
2. Set Root Directory to `client`.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Add Environment Variable: `VITE_API_BASE_URL=https://easyuverse-api.onrender.com/api`
7. Click **Deploy**.
8. In Custom Domains, add `easyuverse.shop` and configure DNS CNAME/A records.

---

## 4. Google Indexing, Search Console & Monetization Setup

### Step 1: Submit Sitemap to Google Search Console
1. Open [Google Search Console](https://search.google.com/search-console).
2. Add Property: `https://easyuverse.shop`.
3. Verify domain ownership using Meta Tag or DNS record.
4. Go to **Sitemaps** and submit: `https://easyuverse.shop/sitemap.xml`.

### Step 2: Google AdSense Revenue Setup
1. Apply for [Google AdSense](https://www.google.com/adsense/).
2. Once approved, replace `ca-pub-1234567890123456` in `client/index.html` and `client/src/components/AdBanner.jsx` with your AdSense Publisher ID.

---

## 5. GitHub Commit & Push Instructions

Run the following terminal commands to commit and push all changes to GitHub:

```bash
# Initialize Git (if not already initialized)
git init

# Stage all files
git add .

# Create commit
git commit -m "Production release: EasyUVerse platform overhaul with Direct UPI gateway, 2-column modal, live 5-min timer, coupon system, 10-digit phone filter, AdSense monetization, and SEO sitemap."

# Set main branch
git branch -M main

# Add remote repository (Replace with your actual GitHub URL)
git remote add origin https://github.com/ujjwalkant/easyuverse.git

# Push to GitHub
git push -u origin main --force
```

---

## 6. Access Credentials Summary

| Role / Service | Value |
| :--- | :--- |
| **Admin Email** | `admin@easyuverse.com` |
| **Admin Password** | `admin123` |
| **Merchant Payee Name** | **Ujjwal Kant** |
| **Merchant UPI ID** | `9241034816@mbkns` |
| **Domain** | `https://easyuverse.shop` |
