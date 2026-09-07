# 🚀 Upwork AI Opportunity Intelligence & Proposal Automation

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![n8n](https://img.shields.io/badge/n8n-v1.0+-ff6d5a.svg)](https://n8n.io)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-green.svg)](https://nodejs.org)
[![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4o--mini-412991.svg)](https://openai.com)
[![Architecture: Human--in--the--Loop](https://img.shields.io/badge/Architecture-Human--in--the--Loop-brightgreen.svg)]()

> **An enterprise-grade freelance opportunity intelligence engine and AI proposal automation system built with n8n, OpenAI, JavaScript, and Human-in-the-Loop approval workflows.**

---

## 🎯 Overview

Finding high-value freelance projects on Upwork is rarely about volume — it is about **identifying the right opportunities early**, evaluating client reliability, filtering out spam or low-budget jobs, and delivering a **highly customized, non-generic proposal** in minutes.

This project automates the manual research, qualification, and drafting process while strictly maintaining **human oversight** over proposal submissions.

```text
┌───────────────────┐    ┌───────────────────┐    ┌───────────────────┐
│  Upwork Job Feed  │───>│ Data Parsing &    │───>│ Duplicate Check   │
│  (RSS / Webhook)  │    │ Normalization     │    │ & Cache Lookup    │
└───────────────────┘    └───────────────────┘    └─────────┬─────────┘
                                                            │
┌───────────────────┐    ┌───────────────────┐              │
│ Human Approval &  │<───│ AI Proposal Draft │<─────────────┘ (Score >= 70)
│ Submission (Slack)│    │ (GPT-4o-mini)     │    ┌───────────────────┐
└─────────┬─────────┘    └───────────────────┘    │ 0-100 Intelligence│
          │                                       │ Scoring Engine    │
          ▼                                       └───────────────────┘
┌───────────────────┐                                       │
│ Airtable CRM &    │<──────────────────────────────────────┘ (Score < 70)
│ Performance Log   │
└───────────────────┘
```

---

## ✨ Key Capabilities

- **📡 Multi-Source Intake**: Ingests job posts via Upwork/Vollna RSS feeds, custom Webhooks, or batch JSON files.
- **🧹 Data Normalization & URL Decoding**: Standardizes job descriptions, decodes raw redirect URLs, and extracts budget structures (fixed vs. hourly).
- **📊 0–100 Opportunity Intelligence Scoring**: Multi-factor algorithm evaluating skill fit, client rating, total spend, budget size, project scope clarity, and red flag indicators.
- **✍️ Non-Generic AI Proposal Generation**: Prompts OpenAI using a proven 4-stage formula: **Direct Hook → Proof with Real Metrics → Practical 3-Step Solution → Low-Friction CTA**.
- **👤 Human-in-the-Loop Oversight**: Sends instant Slack notifications with action controls (**Approve**, **Edit**, **Reject**) to prevent blind mass applications.
- **🗄️ Integrated CRM Tracking**: Logs opportunity scores, client data, proposal drafts, and status history to Airtable.
- **💻 Standalone Local CLI Suite**: Test parsing, scoring formulas, and prompt generation offline via `npm run analyze` without needing a live n8n instance.

---

## 📊 0–100 Intelligence Scoring Model

The system evaluates every incoming opportunity against a **5-factor weighted matrix**:

```text
Skill Match (0-30 pts)     → Hard skill & technology alignment
Client Quality (0-25 pts)  → Rating (0-5 stars), spend history, payment status
Budget Fit (0-20 pts)      → Fixed price threshold (>= $300) or hourly rate fit
Scope Clarity (0-15 pts)   → Description depth & clear technical specs
Strategic Fit (0-10 pts)   → Domain alignment & absence of red flags
-------------------------------------------------------------------------
OVERALL SCORE (0-100 pts)  → Priority Tier Classification
```

### Classification Tiers

| Score Range | Tier | Action |
| :--- | :--- | :--- |
| **85 – 100** | 🔥 **High Priority** | Generate proposal immediately & trigger urgent Slack/Email alert |
| **70 – 84** | ⚡ **Worth Reviewing** | Draft proposal & queue for human review |
| **50 – 69** | 📋 **Low Priority** | Log passively to Airtable CRM |
| **Below 50** | ⛔ **Ignore** | Automatically skip to preserve API tokens |

---

## ✍️ AI Proposal Generation Framework

Proposals avoid generic openers ("I am writing to apply...") and follow a high-converting 4-stage structure:

1. **Direct Technical Hook**: References a specific problem or requirement mentioned in the post.
2. **Proof & Metrics**: Mentions candidate achievements (e.g. *"Architected n8n production pipelines processing 20K+ daily events"*).
3. **Proposed Solution**: 2–3 practical architectural steps tailored to the client's needs.
4. **Soft CTA**: Low-friction call-to-action (e.g. *"Open to a 5-minute chat or seeing a live video demo?"*).

---

## 📂 Repository Structure

```text
.
├── .env.example                  # Environment configuration template
├── .gitignore                    # Git ignore rules
├── package.json                  # Node.js manifest & CLI scripts
├── README.md                     # Documentation overview
│
├── workflows/                    # Production n8n Workflows
│   ├── complete-pipeline.json    # Master end-to-end workflow
│   ├── job-intake-normalization.json
│   ├── opportunity-scoring-engine.json
│   └── ai-proposal-generator.json
│
├── src/                          # Standalone Local Intelligence Engine
│   ├── config.js                 # Freelancer profile & scoring parameters
│   ├── parser.js                 # Job metadata & URL normalizer
│   ├── scorer.js                 # 0-100 Opportunity Scoring engine
│   ├── proposal.js               # Proposal builder & OpenAI payload generator
│   └── cli.js                    # Terminal CLI evaluation tool
│
├── prompts/                      # Modular System & User Prompts
│   ├── proposal-generation.md    # High-converting proposal prompt
│   ├── job-analysis.md           # Requirement extraction prompt
│   ├── opportunity-scoring.md    # LLM scoring rules
│   └── client-qualification.md   # Client risk matrix
│
├── docs/                         # Architecture & Guides
│   ├── architecture.md           # Deep-dive workflow architecture
│   ├── scoring-model.md          # Scoring algorithm specification
│   ├── n8n-setup-guide.md        # Step-by-step n8n deployment guide
│   └── airtable-schema.md        # Database CRM layout
│
└── examples/                     # Sample Datasets
    └── sample-job.json           # Sample job payload for CLI testing
```

---

## 🚀 Quick Start (Local CLI Mode)

No n8n instance required to test local evaluation logic!

### 1. Clone the Repository
```bash
git clone https://github.com/Rohan-1920/Upwork-Proposal-Automation.git
cd Upwork-Proposal-Automation
```

### 2. Run the Offline CLI Engine
```bash
# Run inline test evaluation
npm run test

# Analyze custom job dataset
npm run analyze
```

### Example CLI Output:

```text
====================================================================
🚀 UPWORK AI OPPORTUNITY INTELLIGENCE & PROPOSAL AUTOMATION ENGINE
====================================================================

📌 JOB #1: n8n Automation Architect for AI Email Processing ($1,500)
--------------------------------------------------------------------
🆔 Job ID:         01a2b3c4d5e6f7g8
💰 Budget:         $1500 (fixed)
⭐ Client Rating:  4.9 / 5
💵 Client Spend:   $25,000
🛠️ Skills Needed:  n8n, OpenAI, API Integration, Python, Airtable

📊 INTELLIGENCE ANALYSIS:
   - Overall Score:    91 / 100
   - Priority Level:   [ HIGH PRIORITY ]
   - Recommended:      Generate proposal immediately & alert on Slack/Email
   - Score Breakdown:  Skill=30/30 | Client=23/25 | Budget=20/20 | Clarity=8/15 | Strategic=10/10

✍️ AI PROPOSAL DRAFT (124 words):
--------------------------------------------------------------------
Hi there,

I noticed you're looking for an automated workflow around n8n Automation Architect for AI Email Processing $1,500. Build-outs like this often hit bottlenecks with error handling and API rate limits if not architected cleanly.

I recently built an enterprise n8n pipeline handling over 20,000 automated events daily with automated retry mechanisms and OpenAI LLM classification.

For your project, I'd approach this by:
1. Setting up modular n8n sub-workflows to decouple intake from processing.
2. Integrating fallback logic and rate limit buffers to ensure 99.9% execution reliability.
3. Structuring clean JSON outputs directly synced to your target database/CRM.

Would you be open to a quick 5-minute chat or seeing a brief demo of a similar pipeline I've deployed?

Best regards,  
Rohan Majeed  
AI Automation Architect & Full-Stack Engineer
--------------------------------------------------------------------
```

---

## ⚙️ n8n Deployment

1. Copy `.env.example` to `.env` and fill in your API keys (`OPENAI_API_KEY`, `AIRTABLE_API_KEY`, `VOLLNA_RSS_URL`).
2. Open n8n and import `workflows/complete-pipeline.json`.
3. Configure API credentials for OpenAI, Airtable, and Slack.
4. Activate the workflow. Detailed instructions can be found in [docs/n8n-setup-guide.md](docs/n8n-setup-guide.md).

---

## 👨‍💻 Author

**Rohan Majeed**  
*Full-Stack Engineer • AI Automation Architect • n8n Workflow Builder*

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
