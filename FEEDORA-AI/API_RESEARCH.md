# LocalPulse AI — API Research & Integration Architecture

This document details the architectural evaluation, SDK selection, quotas, limitations, security boundaries, and operational procedures for all external APIs and services investigated for **LocalPulse AI**.

---

## 1. Google Gemini API (Primary AI Engine)

### Official Documentation & SDK
- **Official Documentation**: [Google AI for Developers](https://ai.google.dev/gemini-api/docs)
- **Official SDK**: `@google/genai` (current official Google Gen AI SDK) & `@google/generative-ai`
- **Recommended Models**:
  - `gemini-1.5-flash` / `gemini-2.0-flash` (Fast, cost-efficient, 1M token context window, structured JSON output support)
  - `gemini-1.5-pro` (For deep recursive reasoning if required)

### Authentication & Credential Management
- **Auth Scheme**: API Key passed via header or SDK client initialization (`process.env.GEMINI_API_KEY`).
- **Security Rule**: API keys are kept strictly on the Node.js backend. Never exposed to Vite frontend bundles or client network requests.

### Free-Tier Quotas & Rate Limits
- **Gemini Developer API (Free Tier)**:
  - Rate Limit: 15 Requests Per Minute (RPM)
  - Daily Limit: 1,500 Requests Per Day (RPD)
  - Token Limit: 1,000,000 Tokens Per Minute (TPM)
- **Batching Strategy**: Reviews are processed in batches of 10–20 to stay well beneath 15 RPM while minimizing payload size and latency.

### Structured Output & Validation
- Gemini supports `responseMimeType: "application/json"` and strict schema validation.
- All AI responses are validated on the server using **Zod** (`z.object({...})`).
- Malformed outputs trigger exponential backoff retry.

### Fallback & Demo Mode
- If `GEMINI_API_KEY` is not provided or if rate limits are exceeded, LocalPulse AI seamlessly switches to the **Intelligent Demo Fallback Engine**.
- Fallback results are explicitly flagged with `isDemoFallback: true` and `analysisProvider: "LocalPulse Offline Intelligent Engine"` for transparent hackathon evaluation.

---

## 2. MongoDB Atlas & Local Storage

### Official Documentation
- **Official Documentation**: [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- **Driver**: Mongoose 8.x

### Deployment & Free Tier
- **Tier**: M0 Sandbox (Shared RAM, 512MB storage, free forever).
- **Connection URI Format**: `mongodb+srv://<username>:<password>@<cluster>.mongodb.net/localpulse?retryWrites=true&w=majority`

### Resilient Architecture
- In production / cloud deployment (Render), `MONGODB_URI` connects directly to MongoDB Atlas.
- For local hackathon grading or when offline, LocalPulse AI implements an **In-Memory & File-Backed Dual Adapter** that implements standard Mongoose queries (`find`, `findById`, `create`, `updateOne`, `deleteMany`, `aggregate`) without requiring a background `mongod` service to be running.

---

## 3. Google Business Profile API (Future Roadmap)

### Documentation & Endpoints
- **Endpoints**:
  - `https://mybusinessbusinessinformation.googleapis.com/v1/accounts/{accountId}/locations`
  - `https://mybusinessaccountmanagement.googleapis.com/v1/accounts`
  - `https://mybusinessreviews.googleapis.com/v1/accounts/{accountId}/locations/{locationId}/reviews`

### Access Restrictions
- Requires Google Cloud OAuth 2.0 Client credentials (`https://www.googleapis.com/auth/business.manage`).
- Requires verified business ownership in Google Business Profile console.
- **Hackathon Decision**: External review scraping is legally and technically prohibited without merchant authorization. LocalPulse AI provides direct CSV upload, manual entry, and pre-seeded demo profiles instead.

---

## 4. Buffer / Social Publishing API (Future Roadmap)

### Documentation & Endpoints
- **Endpoints**:
  - `POST https://api.bufferapp.com/1/updates/create.json`
- **Auth**: Bearer Token via OAuth 2.0.
- **Rate Limits**: 60 requests per minute per user.
- **Hackathon Decision**: LocalPulse AI's **Marketing Studio** generates full-fidelity copy (Instagram captions, WhatsApp broadcasts, Reel ideas, hashtags) with one-click clipboard copying, draft saving, and structured JSON export, preparing businesses for direct 1-click buffer/social publish once API credentials are bound.

---

## 5. Deployment Architecture: Vercel & Render

### Frontend (Vercel)
- **Framework**: Vite + React
- **Config**: `client/vercel.json` with SPA catch-all rewrite rule (`/(.*) -> /index.html`).
- **Environment**: `VITE_API_URL` pointing to backend Render service.

### Backend (Render)
- **Service Type**: Web Service (Node.js)
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `PORT=5000`
  - `NODE_ENV=production`
  - `CLIENT_URL=https://localpulse-ai.vercel.app`
  - `MONGODB_URI=mongodb+srv://...`
  - `GEMINI_API_KEY=...`
  - `ENABLE_DEMO_FALLBACK=true`
- **Health Check**: `GET /api/health` returning `{ status: "ok", timestamp: ... }`.
