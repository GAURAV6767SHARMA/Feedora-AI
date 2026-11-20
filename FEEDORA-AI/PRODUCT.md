# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users
Independent local business owners and operators (restaurants, neighborhood cafes, hair salons, boutique clothing stores) monitoring customer feedback across fragmented review platforms (Google, Swiggy, Zomato, Instagram). They need immediate clarity on what is hurting customer retention and what new offerings customers actually want, without having to hire an analytics agency or social media manager.

## Product Purpose
LocalPulse AI transforms raw, unstructured customer reviews into quantifiable business growth. It bridges the gap between star ratings and actionable operational decisions by surfacing granular sentiment, pinpointing recurring friction, predicting unmet customer demand, recommending concrete 14-day operational experiments, and generating localized marketing copy directly rooted in customer quotes. Success means local owners increase operational efficiency, resolve complaints faster, and launch high-probability new offerings with measurable revenue uplift.

## Positioning
Demand Radar™ & AI Business Advisor: While conventional tools offer passive review aggregation or basic sentiment polarity charts, LocalPulse AI actively uncovers and empirically ranks unmet customer desires (e.g., iced matcha latte, plus-size clothing, vegan options) using an explicit heuristic opportunity formula ($0.4F + 0.3G + 0.3N$) backed by verbatim customer quotes. It bridges analysis into action via concrete operational experiment plans and authentic multilingual (English, Hindi, Hinglish) promotional copy generated from real feedback.

## Operating Context
- Environments: Desktop and mobile web dashboards used by busy owners and managers between shifts or service hours.
- Inputs: Review ingestion via direct CSV upload (e.g., Swiggy, Zomato, Google Maps exports), manual review entry, and synthetic benchmark datasets.
- Outputs: Real-time sentiment distribution charts, recurring complaint highlights with verbatim excerpts, ranked opportunity radar cards, 14-day testable operational prescriptions, and multi-lingual social copy for Instagram and WhatsApp marketing.

## Capabilities and Constraints
- Granular Sentiment Analysis: Identifies positive, negative, neutral, and mixed sentiments with nuanced multi-aspect tagging.
- Demand Radar™: Heuristic scoring assessing frequency, sentiment gap, and net demand with confidence tiers and trend velocity.
- AI Business Advisor: Prescriptive action cards detailing operational impact, effort, and risk/limitation disclosures.
- Multilingual Marketing Studio: Copy generation in English, Hindi, and conversational Hinglish grounded in customer voice.
- Zero-Friction Local Run: High-performance dual store (in-memory and file-backed for local hackathon demo; MongoDB Atlas ready for production).
- Gemini 1.5 Flash integration with structured JSON schema outputs and strict prompt injection defenses.

## Brand Commitments
- Name: LocalPulse AI ("From Customer Feedback to Business Growth").
- Voice: Pragmatic, trustworthy, grounded, empowering, and culturally fluent for Indian and global local commerce.
- Integrity: Verbatim quotes and data hashes link every claim back to raw customer words; no hallucinated metrics or fabricated testimonials.

## Evidence on Hand
- Synthetic benchmark datasets:
  - `datasets/restaurant.csv`: 102 realistic restaurant reviews across Google and Swiggy with English, Hindi, and Hinglish feedback.
  - `datasets/salon.csv`: 52 realistic hair and beauty salon reviews.
  - `datasets/clothing.csv`: 52 realistic boutique apparel reviews.
- Documented system architecture and API contracts in `docs/ARCHITECTURE.md` and `docs/API_DOCUMENTATION.md`.

## Product Principles
1. **Verbatim Truth Over Abstraction**: Every sentiment trend and demand score must link back to real, verifiable customer quotes and review IDs.
2. **Analysis Must Lead to Action**: Insights are useless without an operational next step; every finding pairs with an actionable prescription or testable 14-day experiment.
3. **Culturally Grounded Communication**: Respect how local customers and business owners actually talk, offering authentic Hindi and Hinglish communication alongside English.
4. **Zero Administrative Overhead**: Clean, glanceable metrics and low cognitive friction designed for busy non-technical operators.
