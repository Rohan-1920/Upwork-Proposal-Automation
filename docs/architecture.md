# 🏗️ System Architecture & Workflow Pipeline

The **Upwork AI Opportunity Intelligence & Proposal Automation System** is architected to eliminate manual job searching and proposal boilerplate while strictly preserving **human submission control**.

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           UPWORK OPPORTUNITY SOURCES                        │
│             (Vollna RSS / Upwork RSS Feeds / Inbound Webhooks)              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 01. INGESTION & DATA NORMALIZATION                                          │
│ - Decodes raw Upwork URLs & extracts Job IDs                                │
│ - Cleans HTML formatting and standardizes job titles & budgets               │
│ - Parses client signals (Rating, Total Spend, Payment Status, Country)       │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 02. DUPLICATE CHECK & CACHE LOOKUP                                          │
│ - Compares Job ID / URL hash against Airtable CRM / local cache             │
│ - Prevents duplicate alerts or redundant OpenAI token spending              │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 03. 0–100 OPPORTUNITY INTELLIGENCE SCORING ENGINE                            │
│ - Skill Match (0-30 pts)     - Client Reputation (0-25 pts)                 │
│ - Budget Suitability (0-20 pts)- Scope & Clarity (0-15 pts)                 │
│ - Strategic Fit & Red Flags (0-10 pts)                                      │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                   ┌───────────────────┴───────────────────┐
                   │ Score Threshold Evaluation            │
                   └─────────┬───────────────────┬─────────┘
                             │                   │
                     Score >= 70             Score < 70
                             │                   │
                             ▼                   ▼
┌──────────────────────────────────────┐  ┌───────────────────────────────────┐
│ 04. AI PROPOSAL GENERATOR            │  │ LOG LOW PRIORITY                  │
│ - Multi-stage prompt (GPT-4o-mini)   │  │ - Passively log to Airtable CRM   │
│ - Direct Hook -> Proof -> 3-Step     │  │ - Skip proposal generation        │
│   Solution -> Soft CTA               │  └───────────────────────────────────┘
└──────────────────┬───────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 05. HUMAN-IN-THE-LOOP APPROVAL & SLACK NOTIFICATION                          │
│ - Instant Slack alert containing full score breakdown + proposal draft     │
│ - Action buttons: [ Approve & Submit ] | [ Edit Proposal ] | [ Reject ]    │
└──────────────────────────────────────┬──────────────────────────────────────┘
                                       │
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│ 06. CRM PERSISTENCE & ANALYTICS                                             │
│ - Synchronizes proposal, client metrics, and application status to Airtable │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Key Architectural Principles
- **No Mass Automation**: Automation evaluates and drafts proposals; submission remains 100% under human decision.
- **Modularity**: Every module (Parser, Scorer, Generator, CRM sync) can be executed independently in n8n or offline via the Node.js CLI engine (`src/cli.js`).
- **Token Efficiency**: LLM API calls are only made for qualified leads scoring 70+.
