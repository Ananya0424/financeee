# Personal Finance Tracker

A **Full Stack Personal Finance Tracker Web App** built with React.js, Node.js, Express, MongoDB, and Python Flask.  
This project allows users to track their income, expenses, and budgets, visualize their finances using interactive charts, and get AI-powered insights.

---

## **Tech Stack**

- **Frontend:** React.js (`/client`)  
- **Backend:** Node.js + Express (`/backend`)  
- **Database:** MongoDB Atlas  
- **AI Module:** Python Flask (`/ai`)  
- **Charts & Visualization:** Recharts  
- **Deployment:** Vercel (Frontend), Render/Railway (Backend & AI APIs)

---

## **Project Structure**
/Flask
├── /client # React.js frontend
├── /backend # Node.js + Express backend
├── /ai # Python Flask AI module
├── vercel.json # Vercel deployment config
└── README.md


---

## **Features**

- Add, edit, and delete income and expenses  
- Track budgets and spending categories  
- Interactive charts to visualize income vs.   expenses  
- AI-powered financial insights and predictions (via Flask API)  
- Responsive and mobile-friendly UI  

---

## **Getting Started (Local Setup)**

### **Frontend (React)**

```bash
cd client
npm install
npm start
```
-Runs the frontend on http://localhost:3000
-Make sure your backend API is running for full functionality

##**Backend (Node.js + Express)**

```bash
cd backend
npm install
npm start
```
-Runs backend on http://localhost:5000 (default)
-Make sure MongoDB Atlas URI is set in .env:
MONGO_URI=your_mongodb_connection_string


##**AI Module (Flask)**

```bash
cd ai
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
python app.py
```
Runs AI API on http://localhost:8000 (default)


##**Environment Variables**

# Frontend (client/.env):

REACT_APP_BACKEND_URL=http://localhost:5000
REACT_APP_AI_URL=http://localhost:8000

# Backend (backend/.env):

MONGO_URI=your_mongodb_connection_string
PORT=5000

# AI Module (ai/.env):

FLASK_ENV=development
PORT=8000

##**Deployment**

##**Frontend (Vercel)*
1.Install Vercel CLI:
 ```bash
   npm install -g vercel
   vercel login
   ```
2.Deploy from project root:
```bash
  cd /Flask
  vercel --prod
  ```
-Root directory: client
-Build command: npm run build
-Output directory: build

React frontend live URL will be provided by Vercel. 

##**Backend & AI Module (Render / Railway / Heroku)**

-Push /backend and /ai folders to GitHub
-Connect each to Render or Railway
-Set start commands:
  Backend: node index.js or npm start
  AI: python app.py
-Update frontend .env with deployed API URLs