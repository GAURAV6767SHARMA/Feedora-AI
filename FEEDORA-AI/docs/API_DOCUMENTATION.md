# LocalPulse AI — REST API Documentation

All API routes are prefixed with `/api/v1` except for the root health check at `/api/health`.

---

## 1. System Health

### `GET /api/health`
Returns the operational status of the server, database connectivity, and active AI inference provider.

**Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2026-11-04T17:12:47.551Z",
  "service": "LocalPulse AI Engine",
  "version": "1.0.0",
  "database": {
    "connected": true,
    "isMemoryStore": false,
    "provider": "MongoDB Atlas"
  },
  "aiProvider": "Google Gemini API"
}
```

---

## 2. Business Management

### `POST /api/v1/businesses`
Creates a new business profile.

**Request Body:**
```json
{
  "name": "The Spice Garden Bistro",
  "category": "restaurant",
  "description": "Authentic North Indian bistro",
  "location": "Indiranagar, Bangalore",
  "preferredLanguage": "English"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "664fa19e34...",
    "name": "The Spice Garden Bistro",
    "category": "restaurant",
    "location": "Indiranagar, Bangalore",
    "preferredLanguage": "English",
    "createdAt": "2026-11-04T17:00:00.000Z"
  }
}
```

### `GET /api/v1/businesses`
Lists all business profiles.

### `GET /api/v1/businesses/:id`
Retrieves a specific business by ID.

### `PATCH /api/v1/businesses/:id`
Updates an existing business profile.

### `POST /api/v1/businesses/demo/reset`
Resets the demo workspace to a clean synthetic baseline.

---

## 3. Customer Reviews

### `POST /api/v1/reviews/upload`
Uploads a CSV file of customer reviews (multipart/form-data with fields `file` and `businessId`).

**Response (201 Created):**
```json
{
  "success": true,
  "message": "CSV processing complete. 102 reviews imported.",
  "data": {
    "importedCount": 102,
    "rejectedCount": 0,
    "duplicatesCount": 0,
    "validationErrors": []
  }
}
```

### `POST /api/v1/reviews`
Adds a single review manually.

**Request Body:**
```json
{
  "businessId": "demo-restaurant-1",
  "reviewText": "Amazing butter chicken and crispy garlic naan! Best dinner in weeks.",
  "rating": 5,
  "source": "Google"
}
```

### `GET /api/v1/reviews`
Retrieves paginated reviews with search, sentiment, source, and sort filters.

**Query Parameters:**
- `businessId` (required)
- `search` (optional keyword)
- `sentiment` (`all`, `positive`, `negative`, `neutral`, `mixed`)
- `source` (`all`, `Google`, `Swiggy`, `Zomato`, `Instagram`, `Walk-in`)
- `sort` (`newest`, `oldest`, `highest`, `lowest`)
- `page` (default 1)
- `limit` (default 20)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "rev-1",
      "reviewText": "The butter chicken was phenomenal! Quick service.",
      "rating": 5,
      "source": "Google",
      "sentiment": "positive",
      "topics": [{ "name": "Food Quality", "sentiment": "positive" }],
      "complaints": [],
      "preferences": ["North Indian Specialties (Butter Chicken)"],
      "featureRequests": []
    }
  ],
  "pagination": {
    "total": 102,
    "page": 1,
    "limit": 20,
    "totalPages": 6
  }
}
```

### `DELETE /api/v1/reviews/:id`
Deletes a review record.

---

## 4. AI Analysis

### `POST /api/v1/analysis/run`
Triggers Gemini AI ingestion and demand extraction over reviews.

**Request Body:**
```json
{
  "businessId": "demo-restaurant-1",
  "forceAll": true
}
```

### `GET /api/v1/analysis/summary/:businessId`
Returns aggregated sentiment breakdown, top topics, recurring complaints, and customer preferences.

### `GET /api/v1/analysis/trends/:businessId`
Returns chronological monthly review volume and positive/negative trends.

---

## 5. Demand Radar™

### `GET /api/v1/demand/:businessId`
Returns ranked demand signals with opportunity scores, trends, confidence levels, and supporting customer excerpts.

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "businessId": "demo-restaurant-1",
    "businessName": "The Spice Garden Bistro",
    "signalsCount": 4,
    "signals": [
      {
        "title": "Iced Matcha Latte & Specialty Plant Milk Brews",
        "demandScore": 88,
        "trend": "Rising",
        "confidence": "High (Broad customer recurrence)",
        "uniqueReviews": 6,
        "totalMentions": 7,
        "suggestedExperiment": "Introduce a limited Plant-Based Special drink menu for 2 weeks.",
        "supportingReviews": [
          {
            "reviewId": "rev-45",
            "text": "Could you add iced matcha latte? Craving it every time I visit.",
            "rating": 5
          }
        ]
      }
    ]
  }
}
```

---

## 6. AI Business Advisor

### `POST /api/v1/advisor/generate`
Formulates 3–5 high-leverage business recommendations based on aggregated complaints and demand signals.

### `GET /api/v1/recommendations/:businessId`
Lists current recommendations for a business.

### `PATCH /api/v1/recommendations/status/:id`
Updates recommendation execution status (`pending`, `in-progress`, `completed`).

**Request Body:**
```json
{
  "status": "completed"
}
```

---

## 7. AI Marketing Studio

### `POST /api/v1/marketing/generate`
Generates authentic social copy grounded in customer evidence.

**Request Body:**
```json
{
  "businessId": "demo-restaurant-1",
  "platform": "Instagram",
  "language": "Hinglish",
  "tone": "Warm & Engaging",
  "objective": "Highlight customer favorite Dal Makhani"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "platform": "Instagram",
    "language": "Hinglish",
    "caption": "Craving something truly special this weekend? 🌟\n\nHumare regular customers ka all-time favorite: \"Butter Chicken & Dal Makhani\"!...",
    "hashtags": ["#LocalFavorite", "#FoodieDelight", "#WeekendVibes"],
    "campaignIdea": "Customer Favorites Spotlight",
    "callToAction": "Tag your foodie partner and visit us this Friday!",
    "contentRationale": "Uses verified positive customer sentiment around signature dishes."
  }
}
```

### `POST /api/v1/campaigns`
Saves a generated campaign to the business library.

### `GET /api/v1/campaigns/:businessId`
Retrieves all saved campaigns.

---

## 8. Growth Tracker

### `GET /api/v1/growth/:businessId`
Returns period-over-period sentiment deltas, complaint reduction rates, and action execution history.
