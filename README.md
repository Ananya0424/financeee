# 💰 Personal Finance Tracker

A full-stack web application to track daily income & expenses, set monthly budgets, visualize spending with interactive charts, and get AI-powered financial insights.

---

## 🌐 Live Demo

| Service | URL |
|---------|-----|
| 🖥️ Frontend | https://financeee-flax.vercel.app/ |
| ⚙️ Backend API | https://financeee-backend1.onrender.com/ |
| 🤖 Python AI |https://financeee-ai.onrender.com |

---

## 🔐 Test Login Credentials

```
Email:    user@example.com
Password: 123456
```

> You can also create your own account using the Sign Up page.

---

## ✨ Features

- ✅ User Authentication (Signup / Login with JWT)
- ✅ Add, Edit, Delete income & expense transactions
- ✅ Filter transactions by category, payment method, and type
- ✅ Search transactions by title or category
- ✅ Set monthly budgets per category with alerts (80% & 100%)
- ✅ Dashboard with financial summary cards
- ✅ Interactive Charts — Pie, Bar, and Line graphs (Recharts)
- ✅ AI-powered smart financial insights (Python Flask + Pandas)
- ✅ Monthly report generation saved in SQLite database
- ✅ Top payment methods tracker (UPI, Cash, Credit Card, etc.)
- ✅ Responsive and mobile-friendly UI
- ✅ Each user sees only their own data (JWT-protected routes)

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Create React App) |
| Backend | Node.js + Express.js |
| Main Database | MongoDB Atlas |
| SQL Reports | SQLite |
| AI Module | Python Flask + Pandas |
| Charts | Recharts |
| Auth | JWT (JSON Web Tokens) |
| Deployment | Vercel (Frontend), Render (Backend + AI) |

---

## 📁 Project Structure

```
financeee/
├── client/              # React.js Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   └── components/
│   │       ├── Charts.jsx
│   │       └── Budget.jsx
│   └── package.json
│
├── backend/             # Node.js + Express Backend
│   ├── routes/
│   │   ├── auth.js
│   │   ├── transactions.js
│   │   └── reports.js
│   ├── models/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
├── ai/                  # Python Flask AI Module
│   ├── app.py
│   └── requirements.txt
│
└── README.md
```

---

## 🚀 How to Run Locally

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ananya0424/financeee.git
cd financeee
```

---

### 2️⃣ Backend (Node.js + Express)

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:

```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend:

```bash
npm start
```

> Runs on **http://localhost:5000**

---

### 3️⃣ Frontend (React)

```bash
cd client
npm install
```

Create a `.env` file in the `client/` folder:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AI_URL=http://localhost:5001
```

Start the frontend:

```bash
npm start
```

> Runs on **http://localhost:3000**

---

### 4️⃣ Python AI Module (Flask)

```bash
cd ai
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

> Runs on **http://localhost:5001**

---

## 🔑 Environment Variables

### Backend — `backend/.env.example`

```env
MONGODB_URI=your_mongodb_atlas_connection_string_here
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### Frontend — `client/.env.example`

```env
REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AI_URL=http://localhost:5001
```

---

## 📊 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |

### Transactions
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/transactions/all` | Get all transactions |
| POST | `/api/transactions/add` | Add transaction |
| PUT | `/api/transactions/edit/:id` | Edit transaction |
| DELETE | `/api/transactions/delete/:id` | Delete transaction |

### Reports
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reports/generate` | Generate monthly report |

### AI (Python)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/analyze` | Get AI financial insights |

---

## 🚢 Deployment

| Part | Platform | Config |
|------|----------|--------|
| Frontend | Vercel | Root: `client`, Build: `npm run build` |
| Backend | Render | Root: `backend`, Start: `npm start` |
| Python AI | Render | Root: `ai`, Start: `gunicorn app:app` |
| Database | MongoDB Atlas | Free M0 Cluster |

---

## 👩‍💻 Author

**Ananya Sharma**
- GitHub: [@Ananya0424](https://github.com/Ananya0424)
