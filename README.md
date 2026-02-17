<div align="center">

# 📚 STUDYSYNC

**A premium academic resource-sharing platform for college students**

Built with React + Vite • Express.js • Supabase

[![Made with React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## ✨ Features

### 📤 Resource Upload & Management
- Upload PDFs, DOCX, PPTs, Images (up to 50MB)
- Rich metadata: title, subject, semester, department, type, tags, year/batch
- **Privacy controls** — Public (all users) or Private (college-only)
- Edit/Delete your own uploads

### 🔍 Search & Filter System
- Full-text search by title, subject, or tags
- Filter by department, semester, resource type
- Sort by **Latest**, **Highest Rated**, or **Most Popular**
- Real-time debounced search

### ⭐ Rating & Review System
- 1–5 star ratings with written reviews
- One review per user per resource (editable)
- Auto-calculated average rating on resource cards
- Duplicate submission prevention

### 🔐 Authentication & Access Control
- **Google OAuth** via Supabase Auth
- Protected routes for upload and profile
- JWT-verified API requests
- Privacy-level enforcement on resources

### 👤 User Profiles
- Google account integration (name, avatar)
- View your uploads with real-time stats
- Karma points, download counts, average rating

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS, Framer Motion |
| **Backend** | Express.js 5, Multer (file uploads) |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage |
| **Auth** | Supabase OAuth (Google) |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- A [Supabase](https://supabase.com/) project with Google OAuth enabled

### 1. Clone the repo
```bash
git clone https://github.com/your-username/studysync.git
cd studysync
```

### 2. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Environment Variables

**Backend** (`backend/.env`):
```env
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
SUPABASE_STORAGE_BUCKET=documents
PORT=5000
```

**Frontend** (`frontend/.env`):
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_API_URL=http://localhost:5000
```

### 4. Setup Database
```bash
cd backend && node setupDb.js
```
Copy the printed SQL into **Supabase Dashboard → SQL Editor → Run**.

### 5. Run the app
```bash
# Windows — double-click start.bat
# OR manually:
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |

---

## 📁 Project Structure

```
studysync/
├── backend/
│   ├── config/
│   │   └── supabaseClient.js      # Supabase admin client
│   ├── middleware/
│   │   └── verifySupabaseToken.js  # JWT auth middleware
│   ├── routes/
│   │   ├── resources.js            # Resource CRUD + search
│   │   └── reviews.js              # Rating & review system
│   ├── services/
│   │   └── supabaseStorage.js      # File upload/delete/URL
│   ├── server.js                   # Express entry point
│   └── setupDb.js                  # Database schema SQL
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── ProtectedRoute.jsx
│       │   └── ResourceCard.jsx
│       ├── context/
│       │   └── AuthContext.jsx      # Auth state management
│       ├── lib/
│       │   ├── api.js              # API helper with auth
│       │   └── supabaseClient.js   # Frontend Supabase client
│       └── pages/
│           ├── Home.jsx
│           ├── Browse.jsx           # Search & filter
│           ├── Upload.jsx           # Resource upload
│           ├── ResourceDetail.jsx   # Detail + reviews
│           ├── Profile.jsx          # User dashboard
│           ├── Login.jsx            # Google OAuth
│           └── Leaderboard.jsx
└── start.bat                        # One-click dev startup
```

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/resources` | ❌ | Search, filter & sort resources |
| `GET` | `/api/resources/:id` | ❌ | Get resource detail |
| `POST` | `/api/resources` | ✅ | Upload new resource |
| `PUT` | `/api/resources/:id` | ✅ | Edit resource (owner only) |
| `DELETE` | `/api/resources/:id` | ✅ | Delete resource (owner only) |
| `POST` | `/api/resources/:id/download` | ❌ | Track download + get URL |
| `GET` | `/api/resources/:id/reviews` | ❌ | List reviews |
| `POST` | `/api/resources/:id/reviews` | ✅ | Submit/update review |

---

## 🌐 Deployment

### Backend — Render

1. Create a **Web Service** on [Render](https://render.com)
2. Connect your GitHub repo
3. Configure:
   | Setting | Value |
   |---------|-------|
   | **Root Directory** | `backend` |
   | **Build Command** | `npm install` |
   | **Start Command** | `npm start` |
4. Add environment variables (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_STORAGE_BUCKET`, `PORT`)

### Frontend — Vercel

1. Import your repo on [Vercel](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Framework preset: **Vite**
4. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_URL`)
5. Set `VITE_API_URL` to your Render backend URL (e.g. `https://your-app.onrender.com`)

> **Note:** Update CORS in `server.js` to allow your Vercel frontend domain in production.

---

## 👥 Team

**Team Name:** Team Colonials

| Member |
|--------|
| Moulik Gupta |
| Daksh Jain |
| Vasu Sharma |

---

<div align="center">
  <sub>Built with ❤️ for the hackathon</sub>
</div>
