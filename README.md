# EasyUVerse - Professional MERN Stack Digital Marketplace Platform

**EasyUVerse** is a production-ready, multi-featured digital products and software marketplace built on the **MERN** stack (MongoDB, Express, React, Node.js) with integrated **Cashfree Payment Gateway**, Admin Management Panel, Support Desk, and dynamic theme switching.

---

## 🌟 Key Features

- **Storefront & Catalog**: Browse, search, and filter projects by category (Web Apps, Mobile Apps, Python Scripts, UI Templates, Full Stack MERN).
- **Cashfree Payment Gateway Integration**: Native v3 SDK support for instant UPI (GPay, PhonePe, Paytm), NetBanking, and Card payments with automatic payment verification and download link access.
- **Full Admin Panel (`/admin`)**:
  - **Overview Analytics**: Real-time sales revenue, completed orders, active users, and pending support tickets.
  - **Project Manager**: Complete CRUD operations for projects, pricing, discounts, download links, and tech stack tags.
  - **Order & Payments Ledger**: Complete Cashfree transaction log.
  - **User Access Manager**: User account role toggles (Admin / User).
  - **Support Desk**: Live support ticket system to reply to customer queries.
  - **Site Settings**: Runtime configuration for site title, notice banner, support contact info, and Cashfree TEST / PROD environment toggle.
- **Theme Selection**: Dynamic Light, Dark, and Cyber Blue modes with global persistence.
- **User Dashboard (`/dashboard`)**: Instant download access to all purchased source codes.
- **Deployment Ready**: Pre-configured for **Vercel** (Frontend) and **Render** (Backend).

---

## 🚀 Quick Setup & Local Running

### 1. Backend Setup (`/server`)

```bash
cd server
npm install
```

Create a `.env` file inside `server/` (or use default `.env` created):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/easyuverse
JWT_SECRET=easyuverse_super_secret_jwt_key_2026
CLIENT_URL=http://localhost:5173

CASHFREE_ENV=TEST
CASHFREE_APP_ID=TEST1039843657b01d32a9e2cf3d3
CASHFREE_SECRET_KEY=cfsk_ma_test_c66579301e095a5f10a82b406b83f0f7_2f4b321a
```

#### Seed Initial Database Data & Admin Account:
Run the seeder script to initialize default projects and the Admin account:

```bash
npm run seed
```

> **Default Admin Credentials**:
> - Email: `admin@easyuverse.com`
> - Password: `admin123`

#### Start Server:
```bash
npm run dev
```
*(Server will start on `http://localhost:5000`)*

---

### 2. Frontend Setup (`/client`)

```bash
cd client
npm install
```

Create `.env` file inside `client/`:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CASHFREE_MODE=sandbox
```

#### Start Frontend Dev Server:
```bash
npm run dev
```
*(Frontend will start on `http://localhost:5173`)*

---

## ☁️ Deployment Instructions

### Deploying Frontend to Vercel
1. Push `d:\EasyUVerse` to your GitHub repository.
2. Log into [Vercel](https://vercel.com) and click **Add New Project**.
3. Select the `client` folder as the Root Directory.
4. Add Environment Variable:
   - `VITE_API_URL` = `https://your-render-backend-url.onrender.com/api`
   - `VITE_CASHFREE_MODE` = `sandbox` (or `production`)
5. Click **Deploy**. Vercel will automatically build the site using `vercel.json`.

### Deploying Backend to Render
1. Log into [Render](https://render.com) and select **New Web Service**.
2. Connect your repository and select `server` as the Root Directory.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: Random secure string
   - `CLIENT_URL`: `https://your-vercel-app-url.vercel.app`
   - `CASHFREE_ENV`: `PROD` (or `TEST`)
   - `CASHFREE_APP_ID`: Your Cashfree Production App ID
   - `CASHFREE_SECRET_KEY`: Your Cashfree Production Secret Key
6. Click **Create Web Service**.

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Axios, React Router v6, Cashfree JS SDK v3.
- **Backend**: Node.js, Express, MongoDB, Mongoose, JWT, BcryptJS, CORS, Dotenv.
- **Payments**: Cashfree Gateway REST v3 API.

Developed for **EasyUVerse**.
