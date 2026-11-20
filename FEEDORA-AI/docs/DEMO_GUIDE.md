# LocalPulse AI — Hackathon Judging & Demo Walkthrough Guide

Welcome to the **LocalPulse AI** evaluation guide! This document provides a step-by-step walkthrough to test and verify every core feature within 3 minutes.

---

## ⚡ Quick Start (30 Seconds)

### Step 1: Install Dependencies & Start Applications
Open two terminals in the workspace:

**Terminal 1 (Backend Server):**
```bash
cd server
npm start
```
*The server boots at `http://localhost:5000` and automatically self-seeds the demo restaurant with 102 synthetic customer reviews!*

**Terminal 2 (Frontend Client):**
```bash
cd client
npm run dev
```
*Open `http://localhost:5173` in your browser.*

---

## 🎯 Step-by-Step Feature Walkthrough

### 1. Landing Page (`/`)
- Open `http://localhost:5173`.
- Review the product identity, the Problem vs. Solution breakdown, and the six core modules.
- Click **"Open Live Demo"** or **"Explore Demo Workspace"** to enter the app.

### 2. Live Dashboard (`/dashboard`)
- **Inspect Key Metrics**: Real-time KPI cards displaying Total Reviews (102), Average Rating (~3.6★), Positive (45%), Negative (33%), Neutral, and Mixed sentiment ratios.
- **Review Volume & Sentiment Trend Chart**: Interactive AreaChart showing chronological influx across months.
- **Sentiment Breakdown**: Recharts PieChart highlighting distribution of customer sentiment.
- **Complaints & Favorites**: Top recurring customer friction points ("Slow delivery and packaging leaks", "Air conditioning issues") and customer favorites ("Butter Chicken & Dal Makhani") with verbatim quotes.
- **Emerging Demand Signals Preview**: Top ranked customer desires from Demand Radar.

### 3. Review Intelligence (`/reviews`)
- **Search & Filter**: Type `"delivery"` or `"ac"` in the search bar. Filter by sentiment (`positive`, `negative`, `mixed`) or source (`Swiggy`, `Google`).
- **Inspect Review Details**: Click on any review card to open the **Review Intelligence Modal**. View original customer text, SHA-256 hash, and AI-extracted tags.
- **Add a Manual Review**: Click **"+ Add Review"**, enter a rating, source, and text (e.g., *"Khana bohot accha tha, lekin waiting time zyada tha."*). Notice instant ingestion!
- **Upload CSV**: Click **"Upload CSV"** and try uploading `datasets/salon.csv` or `datasets/clothing.csv`. Inspect the summary modal with imported, duplicate, and validation counts.

### 4. Demand Radar™ (`/demand`) — The Differentiator
- Review the **Empirical Opportunity Ranking**:
  $$\text{DemandScore} = 0.4F + 0.3G + 0.3N$$
- Notice signals such as:
  - **"Iced Matcha Latte & Specialty Plant Milk Brews"** (Score: ~88/100, Rising trend, High confidence)
  - **"Morning Breakfast Buffet & Early Bird Combos"** (Score: ~85/100, Rising trend)
  - **"Vegan & Dairy-Free Menu Options"** (Score: ~81/100, Stable trend)
- Expand the accordion on any card to read verbatim customer quotes and review IDs.
- Inspect the **Pragmatic 14-Day Suggested Experiment** tailored to each signal.

### 5. AI Business Advisor (`/advisor`)
- Inspect high-leverage operational prescriptions formulated from customer complaints and demand signals.
- Review:
  - **Title & Priority** (High, Medium, Low)
  - **Problem & Root Reason**
  - **Concrete Action** (e.g., *"Upgrade Courier Packaging & Set 15-Min Dispatch Buffers"*)
  - **Expected Measurable Outcome**
  - **Scientific Limitations Disclosure**
- **Test Status Transitions**: Click **"In Progress"** or **"Done ✓"**. Notice the card updates its style and the completion counter dynamically recalculates!

### 6. AI Marketing Studio (`/marketing`)
- Select:
  - **Platform**: Instagram, WhatsApp, or Reels.
  - **Language**: Choose **"Hinglish"** or **"Hindi"**.
  - **Objective**: e.g., *"Highlight customer favorite Dal Makhani"*.
- Click **"Generate Marketing Copy with AI"**.
- Notice natural, authentic copy generated in conversational Hinglish:
  - *"Namaste! Craving something truly special this weekend? Humare regular customers ka all-time favorite..."*
  - Includes hashtags, call to action, and strategic evidence rationale.
- Click **"Copy"** (triggers clipboard toast) and click **"Save Draft"** to store it in your business social library!
- Switch to the **"Saved Library"** tab to view saved posts.

### 7. Growth & Action Tracker (`/growth`)
- View the **Action Execution Rate**: Percentage of recommendations marked completed.
- Inspect **Period-over-Period Sentiment Deltas**:
  - Shifts in Average Rating, Positive Sentiment %, and Negative Sentiment %.
- Review the **Complaint Resolution Evolution Table**: Shows which friction points have been reduced or changed across review periods.
- Notice the **Observational Correlation Disclaimer** demonstrating rigorous scientific integrity.

### 8. Multi-Industry Benchmark Switcher (`/settings` & Navbar)
- Click the top navbar pills: **"Salon"** or **"Apparel"**.
- Notice the entire platform seamlessly shifts to hair styling treatments, appointment delays, and organic hair spa demand, or clothing trial room queues and plus-size apparel demand!
- Check the **Engine Health & API Status** card to verify database provider and AI connectivity.
