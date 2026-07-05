# 🏛️ EstateX — Premium Real Estate CRM

A full-stack MERN real estate management platform with a premium editorial UI inspired by luxury property brands.

---

## 🖥️ Tech Stack

### Frontend
- **React 18** + Vite
- **React Router DOM** v6
- **Axios** for API calls
- **Recharts** for analytics chart
- **Lucide React** icons
- **React Hot Toast** notifications
- Custom CSS design system (no Tailwind dependency)

### Backend
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** authentication
- **bcryptjs** password hashing
- RESTful API

### DevOps
- **Docker** + **Docker Compose**
- Multi-stage frontend build with Nginx
- Volume-persisted MongoDB

---

## 🚀 Quick Start

### Option 1 — Docker (Recommended)

```bash
# 1. Clone / extract the project
cd estatex

# 2. Start all services
docker compose up --build -d

# 3. Seed the database with sample data
docker exec estatex_backend node seed.js

# 4. Open your browser
#    Frontend → http://localhost
#    Backend  → http://localhost:5000
```

### Option 2 — Local Development

#### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

#### Backend
```bash
cd backend
cp .env.example .env
# Edit .env — set your MONGO_URI
npm install
npm run seed      # seed sample data
npm run dev       # starts on http://localhost:5000
```

#### Frontend
```bash
cd frontend
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev       # starts on http://localhost:5173
```

---

## 🔐 Default Credentials

| Role  | Email                    | Password   |
|-------|--------------------------|------------|
| Admin | admin@luxestate.com      | admin123   |
| User  | user@estatex.com         | user1234   |

---

## 📁 Project Structure

```
estatex/
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── api/                # Axios API client
│   │   ├── components/
│   │   │   ├── forms/          # ContactForm
│   │   │   ├── layout/         # Navbar, Footer, ProtectedRoute
│   │   │   ├── property/       # PropertyCard, SearchBar
│   │   │   └── ui/             # Loader
│   │   ├── context/            # AuthContext
│   │   └── pages/
│   │       ├── admin/          # Dashboard, AddProperty, ManageProperties
│   │       ├── Home.jsx
│   │       ├── Properties.jsx
│   │       ├── PropertyDetail.jsx
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   ├── Dockerfile
│   └── package.json
│
├── backend/                    # Express + MongoDB API
│   ├── config/db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   └── inquiryController.js
│   ├── middleware/
│   │   ├── auth.js             # JWT protect
│   │   └── admin.js            # Admin-only guard
│   ├── models/
│   │   ├── User.js
│   │   ├── Property.js
│   │   └── Inquiry.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── properties.js
│   │   └── inquiries.js
│   ├── seed.js                 # Database seeder
│   ├── server.js
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint              | Access    |
|--------|-----------------------|-----------|
| POST   | /api/auth/register    | Public    |
| POST   | /api/auth/login       | Public    |
| GET    | /api/auth/me          | Private   |
| PUT    | /api/auth/profile     | Private   |
| GET    | /api/auth/users       | Admin     |

### Properties
| Method | Endpoint                    | Access    |
|--------|-----------------------------|-----------|
| GET    | /api/properties             | Public    |
| GET    | /api/properties/:id         | Public    |
| GET    | /api/properties/stats       | Admin     |
| POST   | /api/properties             | Admin     |
| PUT    | /api/properties/:id         | Admin     |
| DELETE | /api/properties/:id         | Admin     |

### Inquiries
| Method | Endpoint                | Access    |
|--------|-------------------------|-----------|
| POST   | /api/inquiries          | Public    |
| GET    | /api/inquiries          | Admin     |
| PUT    | /api/inquiries/:id      | Admin     |
| DELETE | /api/inquiries/:id      | Admin     |

---

## ✨ Features

### Public
- Premium hero with search
- Property listings with grid/list toggle
- Advanced filters (type, category, price, beds, city)
- Property detail page with image gallery
- Inquiry / contact form
- Fully responsive

### Admin
- KPI dashboard with charts (Recharts)
- Add / edit / delete properties
- Feature/unfeature toggle
- Inquiry management
- Role-based protected routes

---

## 🎨 Design System

- **Fonts:** Playfair Display (headings) + DM Sans (body)
- **Palette:** Deep Navy `#0d1b2a` · Warm Gold `#c9a84c` · Ivory `#f8f5f0`
- **Aesthetic:** Editorial luxury — clean whites, deep navy, warm gold accents

---

## 🐳 Docker Commands

```bash
# Start all services
docker compose up -d

# View logs
docker compose logs -f

# Stop services
docker compose down

# Reset everything (including data)
docker compose down -v

# Rebuild after code changes
docker compose up --build -d

# Run seeder
docker exec estatex_backend node seed.js
```

---

## 📝 License
MIT — Free to use and modify.
