# Personal Finance Tracker

A full-stack web application built to help users track daily income and expenses, set monthly budgets, visualize spending with interactive charts, and get automated financial insights.

## Live Demo

- **Frontend:** https://financeee-flax.vercel.app/
- **Backend API:** https://financeee-backend1.onrender.com/
- **Python Service:** https://financeee-ai.onrender.com

## Test Credentials

```
Email:    user@example.com
Password: 123456
```
(Or you can register a new account on the Sign Up page)

## Features

- User Authentication (Signup / Login with JWT)
- Add, Edit, Delete income & expense transactions
- Filter transactions by category, payment method, and type
- Search transactions by title or category
- Set monthly budgets per category with alerts (80% & 100%)
- Dashboard with financial summary cards
- Interactive Charts — Pie, Bar, and Line graphs (using Recharts)
- Automated smart financial insights (Python Flask + Pandas)
- Monthly report generation (CSV format)
- Top payment methods tracker
- Responsive UI
- Secure, user-specific data via JWT authorization

## Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js + Express.js
- **Main Database:** MongoDB Atlas
- **AI/Analytics Module:** Python Flask + Pandas
- **Charts:** Recharts
- **Auth:** JWT
- **Deployment:** Vercel (Frontend), Render (Backend + Analytics)

## Project Structure

```
financeee/
├── client/              # React Frontend
├── backend/             # Node/Express Backend API
└── ai/                  # Python Flask Analytics Module
```

## How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/Ananya0424/financeee.git
cd financeee
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the backend:
```bash
node server.js
```

### 3. Frontend Setup

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

### 4. Python Module Setup

```bash
cd ai
python -m venv venv
venv\Scripts\activate      # Windows
source venv/bin/activate   # Mac/Linux
pip install -r requirements.txt
python app.py
```

## API Endpoints Overview

- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/transactions/all` - Get user transactions
- `POST /api/transactions/add` - Add transaction
- `POST /api/reports/generate` - Generate CSV report
- `POST /analyze` (Python service) - Get analytics/insights

## Author

**Ananya Sharma**
- GitHub: [@Ananya0424](https://github.com/Ananya0424)
