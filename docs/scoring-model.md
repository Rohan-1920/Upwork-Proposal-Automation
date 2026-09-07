# 📊 0–100 Opportunity Intelligence Scoring Model

The Intelligence Engine scores incoming jobs from **0 to 100** using a 5-factor weighted algorithm designed to maximize ROI for senior AI & workflow automation engineers.

---

## 1. Score Breakdown

### 🎯 Factor 1: Technical Skill Alignment (30 Points Max)
Compares job requirements against candidate core & secondary skill sets.
- **4+ Core Skill Matches**: 30 pts
- **3 Core Skill Matches**: 24 pts
- **2 Core Skill Matches**: 18 pts
- **1 Core Skill Match**: 10 pts
- **0 Skill Matches**: 0 pts

### 🏢 Factor 2: Client Quality & Financial Standing (25 Points Max)
Evaluates client trustworthiness and spending behavior.
- **Client Rating**:
  - 4.8 – 5.0 stars: 12 pts
  - 4.5 – 4.7 stars: 9 pts
  - 4.0 – 4.4 stars: 5 pts
  - Unrated / New client: 8 pts (neutral fallback)
  - < 4.0 stars: 0 pts
- **Total Spend**:
  - >= $50,000+: 8 pts
  - >= $10,000+: 6 pts
  - >= $1,000+: 4 pts
  - > $0: 2 pts
- **Payment Verification**:
  - Verified: 5 pts
  - Unverified: 2 pts

### 💰 Factor 3: Budget Fit (20 Points Max)
Assesses contract value against target rates.
- **Fixed-Price Contracts**:
  - >= $1,500: 20 pts
  - >= $800: 16 pts
  - >= $300 (Minimum threshold): 12 pts
  - < $300: 5 pts
- **Hourly Contracts**:
  - Target Rate >= $60/hr: 20 pts
  - Min Rate >= $35/hr: 14 pts
  - < $35/hr: 6 pts

### 📜 Factor 4: Scope Clarity & Competition Risk (15 Points Max)
Measures specification quality and project feasibility.
- Description length > 800 chars: 10 pts
- Description length > 300 chars: 7 pts
- Technical keywords present (`architecture`, `api`, `n8n`, `database`, `webhook`): +5 pts

### 🚩 Factor 5: Strategic Alignment & Red Flags (10 Points Max)
- Domain Alignment (`n8n`, `openai`, `agent`, `automation`): +3 pts bonus
- **Red Flag Penalties**: Keywords such as `unpaid`, `free sample`, `cheap`, `test job without pay` result in an immediate -10 pts penalty.

---

## 2. Priority Classification Table

| Score Range | Classification | Workflow Action |
| :--- | :--- | :--- |
| **85 – 100** | 🔥 **High Priority** | Generate AI proposal immediately & send instant high-priority alert to Slack & Email |
| **70 – 84** | ⚡ **Worth Reviewing** | Draft AI proposal & queue for human review |
| **50 – 69** | 📋 **Low Priority** | Log opportunity to Airtable CRM passively (no proposal generated) |
| **Below 50** | ⛔ **Ignore / Skip** | Automatically discard to optimize workflow performance |
