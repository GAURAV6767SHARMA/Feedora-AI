# LocalPulse AI
> **From Customer Feedback to Business Growth**

[![Node.js](https://img.shields.io/badge/Node.js-LTS-339933?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwindcss)](https://tailwindcss.com)
[![Gemini AI](https://img.shields.io/badge/Google_Gemini-1.5_Flash-4285F4?logo=google)](https://ai.google.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas_Ready-47A248?logo=mongodb)](https://mongodb.com)

---

## 🚀 Mission & Value Proposition

Small local businesses—restaurants, hair salons, boutique clothing stores, and neighborhood cafes—receive hundreds of reviews across Google, Swiggy, Zomato, and Instagram. However, star ratings hide actionable reasons, recurring customer desires are lost in noise, and owners lack time to write multi-lingual promotional content.

**LocalPulse AI** transforms unstructured feedback into:
1. **Granular Sentiment Breakdown** (Positive, Negative, Neutral, and nuanced Mixed sentiment).
2. **Operational Friction & Preference Detection** with verbatim evidence excerpts.
3. **Demand Radar™ (Core Differentiator)**: Predictively surfaces and ranks unmet customer desires (e.g. vegan menu, plus-size sizing, online booking) via empirical heuristic scoring.
4. **AI Business Advisor**: Delivers concrete, high-leverage operational prescriptions with expected measurable outcomes and limitation disclosures.
5. **AI Marketing Studio**: Generates authentic social copy in **English**, **Hindi**, and conversational **Hinglish** grounded in real customer quotes.
6. **Growth & Action Tracker**: Monitors period-over-period sentiment shifts and tracks complaint resolution lifecycle.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, React Router DOM, Axios, Recharts, Lucide React, PapaParse, React Hot Toast |
| **Backend** | Node.js LTS, Express.js, Multer, PapaParse, Zod Validation, Helmet, CORS, Express Rate Limit, dotenv |
| **Database** | MongoDB Atlas (Production) / Zero-Friction High-Performance In-Memory & File-Backed Dual Store (Local Hackathon Mode) |
| **AI Engine** | Official Google GenAI SDK (`@google/genai` / `@google/generative-ai`), Gemini 1.5 Flash, Structured JSON output, Zod validation, Prompt Injection defenses |
| **Datasets** | Pre-seeded synthetic benchmark datasets for Restaurants (100+ reviews), Salons (50+ reviews), Boutiques (50+ reviews) with Hindi & Hinglish feedback |
| **Deployment** | Vercel (Frontend SPA) + Render (Node.js Backend) |

---

## 📦 Project Structure

```
aarambton_test/
|-- client/                    # React 18 + Vite Frontend
|   |-- src/
|   |   |-- components/        # Dashboard, Reviews, Demand, Advisor, Marketing, Common
|   |   |-- pages/             # Landing, Dashboard, ReviewIntelligence, DemandRadar, etc.
|   |   |-- services/          # Axios API clients
|   |   |-- context/           # BusinessContext & Demo Data Switcher
|   |   |-- layouts/           # DashboardLayout (Sidebar, Navbar)
|   |-- vercel.json            # Vercel SPA rewrite configuration
|   |-- package.json
|-- server/                    # Node.js + Express Backend
|   |-- config/                # MongoDB Atlas connection & resilient dual store
|   |-- models/                # User, Business, Review, Insight, Recommendation, Campaign
|   |-- controllers/           # REST API route controllers
|   |-- routes/                # Express API routes (/api/v1)
|   |-- services/              # Gemini SDK, Review Analysis, Demand, Advisor, Marketing
|   |-- middleware/            # Multer CSV upload & Central Error Handler
|   |-- utils/                 # Zod Validators, CSV Parser, Sentiment Aggregator, Demand Scorer
|   |-- scripts/               # Seed demo datasets
|   |-- tests/                 # Unit test suite
|   |-- package.json
|-- datasets/                  # Synthetic Benchmark Datasets
|   |-- restaurant.csv         # 102 realistic restaurant reviews
|   |-- salon.csv              # 52 realistic salon reviews
|   |-- clothing.csv           # 52 realistic clothing boutique reviews
|-- docs/
|   |-- ARCHITECTURE.md        # Mermaid diagrams, ER schemas, and AI pipeline
|   |-- API_DOCUMENTATION.md   # Endpoint signatures, payloads, and responses
|   |-- DEMO_GUIDE.md          # 3-minute hackathon evaluation walkthrough
|-- API_RESEARCH.md            # Official API evaluation, SDK choices, and quotas
|-- README.md
```

---

## 🏁 Quick Start & Installation

### Prerequisites
- Node.js LTS (v18+)
- npm or pnpm

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Environment Configuration
Create `server/.env` (a ready template is provided at `server/.env.example`):
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Optional: MongoDB Atlas URI (If omitted, automatically operates in zero-friction demo mode)
MONGODB_URI=

# Optional: Google Gemini API Key (If omitted, automatically uses offline intelligent engine)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-1.5-flash
```

### 3. Run Locally

**Start Backend (Terminal 1):**
```bash
cd server
npm start
```
*Server starts on `http://localhost:5000` and automatically self-seeds 102 demo reviews for "The Spice Garden Bistro"!*

**Start Frontend (Terminal 2):**
```bash
cd client
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🧪 Testing

Run the automated backend unit test suite:
```bash
cd server
npm test
```
**Test Coverage Includes:**
- CSV validation, field sanitization, and 1-5 rating constraints
- Duplicate review detection via normalized text SHA-256 hashes
- Sentiment percentage calculation and complaint aggregation
- Demand Radar scoring heuristic formula verification ($0.4F + 0.3G + 0.3N$)
- Zod schema validation for business and AI outputs

---

## 🌐 Deployment Guide

### Frontend (Vercel)
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variable**: `VITE_API_URL=https://your-backend.onrender.com`
- `vercel.json` rewrite is pre-configured.

### Backend (Render)
- **Environment**: Node.js Web Service
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `CLIENT_URL=https://your-frontend.vercel.app`
  - `MONGODB_URI=mongodb+srv://...`
  - `GEMINI_API_KEY=...`

---

## ⚖️ License
MIT License. Built for Hackathon MVP 2026.
