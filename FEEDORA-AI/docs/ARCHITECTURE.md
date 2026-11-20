# LocalPulse AI — System Architecture & Technical Design

## 1. System Overview

**LocalPulse AI** is an AI-powered customer intelligence and business growth engine engineered for local enterprises (restaurants, salons, boutiques, and neighborhood service providers). It bridges the gap between raw customer reviews and operational execution by deriving sentiment trends, identifying friction points, detecting emerging product/service demand signals, generating pragmatic business recommendations, and producing multi-lingual marketing campaigns.

```mermaid
flowchart TD
    subgraph Client ["Client (React + Vite + Tailwind CSS)"]
        UI[Interactive Dashboard & Modules]
        Router[React Router DOM]
        State[BusinessContext & State]
        UI --> State
        State --> Router
    end

    subgraph Server ["Backend (Node.js + Express)"]
        API[REST API Router /api/v1]
        MW[Security & Sanitization Middleware]
        Parser[CSV & Hash Deduplication Engine]
        Aggr[Sentiment Aggregator]
        Scorer[Demand Radar Engine]
        AdvService[AI Advisor Engine]
        MktService[Marketing Creative Studio]
        Gemini[Google GenAI / Heuristic Engine]

        API --> MW
        MW --> Parser
        Parser --> Aggr
        Aggr --> Scorer
        Scorer --> AdvService
        AdvService --> MktService
        AdvService --> Gemini
        MktService --> Gemini
    end

    subgraph Database ["Persistence Layer"]
        Atlas[(MongoDB Atlas)]
        DualStore[(In-Memory / File Persistent Store)]
    end

    Client -- HTTP / JSON --> API
    Server --> Atlas
    Server -. Fallback .-> DualStore
```

---

## 2. Database Models & ER Relationships

```mermaid
erDiagram
    BUSINESS ||--o{ REVIEW : owns
    BUSINESS ||--o{ INSIGHT : aggregates
    BUSINESS ||--o{ RECOMMENDATION : receives
    BUSINESS ||--o{ CAMPAIGN : launches
    USER ||--o{ BUSINESS : owns

    BUSINESS {
        string id PK
        string ownerId
        string name
        string category
        string description
        string location
        string preferredLanguage
        date createdAt
    }

    REVIEW {
        string id PK
        string businessId FK
        string reviewText
        int rating
        date date
        string source
        string normalizedTextHash
        string sentiment
        array topics
        array complaints
        array preferences
        array featureRequests
        string analysisStatus
    }

    INSIGHT {
        string id PK
        string businessId FK
        object sentimentSummary
        array topTopics
        array topComplaints
        array preferences
        array demandSignals
        date generatedAt
    }

    RECOMMENDATION {
        string id PK
        string businessId FK
        string title
        string problem
        string reason
        string action
        string priority
        string status
        string expectedOutcome
        string confidence
        string limitations
        date completedAt
    }

    CAMPAIGN {
        string id PK
        string businessId FK
        string platform
        string language
        string tone
        string objective
        string caption
        array hashtags
        string campaignIdea
        string callToAction
        string status
    }
```

---

## 3. Demand Radar Scoring Engine

The differentiator of LocalPulse AI is **Demand Radar™**. Instead of merely summarizing past sentiment, it actively scans customer reviews for explicit feature requests, menu inquiries, and service gaps.

### Illustrative Heuristic Ranking Formula:
$$\text{DemandScore} = 0.4 \times F + 0.3 \times G + 0.3 \times N$$

Where:
- **$F$ (Normalized Frequency)**: The relative mention volume of the request compared to the most requested item across all reviews.
- **$G$ (Normalized Growth)**: Period-over-period velocity comparing the recent review half vs the prior review half (scores range from 30 for declining, 50 for stable, to 95 for emerging/rising).
- **$N$ (Normalized Unique Customer Count)**: Number of unique customer reviews requesting the feature, guarding against single-customer spam.

### Trend & Confidence Classifications:
- **Rising**: Mention frequency in the recent period exceeds previous period by $>25\%$.
- **Stable**: Mention frequency remains consistent across historical samples.
- **Insufficient History**: Review volume is below the time-series threshold ($<10$ total reviews).
- **Confidence Tiers**:
  - *High*: $\ge 6$ unique customer reviews across different dates.
  - *Moderate*: $3 - 5$ unique customer reviews.
  - *Exploratory*: Emerging signal with 2 reviews.

---

## 4. AI Workflow & Safeguards

```mermaid
sequenceDiagram
    autonumber
    actor Merchant as Business Owner
    participant Client as LocalPulse UI
    participant Server as Express Server
    participant Gemini as Google Gemini 1.5 Flash
    participant DB as MongoDB Atlas / Dual Store

    Merchant->>Client: Uploads CSV or Enters Review
    Client->>Server: POST /api/v1/reviews/upload
    Server->>Server: Compute SHA-256 normalized hash & deduplicate
    Server->>DB: Bulk insert pending reviews
    Merchant->>Client: Clicks "Run AI Analysis"
    Client->>Server: POST /api/v1/analysis/run
    Server->>Gemini: Batch Reviews (15 per prompt) with Strict JSON Schema
    Note over Server,Gemini: Prompt Injection Safeguard applied<br/>Reviews treated as untrusted text
    Gemini-->>Server: JSON array of sentiment, topics, complaints, & demand
    Server->>Server: Zod Schema Validation
    Server->>DB: Update Review documents & save aggregated Insight
    Server-->>Client: Returns refreshed sentiment, complaints & demand signals
```

### Safety & Guardrail Implementation:
1. **Prompt Injection Defense**: Customer reviews are explicitly demarcated as untrusted external strings. Instructions embedded within review text are neutralized.
2. **Strict JSON Schema Enforcement**: Gemini API is requested with `responseMimeType: "application/json"` and strict structure.
3. **Zod Validation**: Every item in the returned array is validated against `aiReviewItemSchema`. Malformed items fall back to deterministic regex extraction.
4. **Anti-Hallucination Guardrail in Marketing**: The Marketing Studio prompt explicitly forbids fabricating non-existent discount percentages or phantom sales.
