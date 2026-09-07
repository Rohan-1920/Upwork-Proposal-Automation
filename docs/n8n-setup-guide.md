# ⚙️ n8n Setup & Import Guide

This guide explains how to import and configure the production n8n workflows provided in `/workflows`.

## Prerequisites
- **n8n** (Self-hosted via Docker, Cloud instance, or local CLI: `n8n start`)
- **OpenAI API Key** (for proposal generation and job intelligence)
- **Airtable Personal Access Token & Base** (for CRM storage)
- **Slack Incoming Webhook / Bot Token** (for Human-in-the-Loop review notifications)

---

## Step-by-Step Import Instructions

### 1. Import Workflow JSON
1. Log in to your n8n dashboard.
2. Click **Workflows** → **Add Workflow** → **Import from File**.
3. Select `workflows/complete-pipeline.json` from this repository.

### 2. Configure Credentials in n8n
- **OpenAI API**: Add an **OpenAI** API credential and paste your API key.
- **Airtable API**: Create an **Airtable Personal Access Token** with read/write permissions for your base.
- **Slack API / Webhook**: Set up Slack OAuth or Webhook credentials for your alert channel.

### 3. Environment Variables Setup
Set the following environment variables in your n8n runtime host or `.env` file:

```env
VOLLNA_RSS_URL=https://www.vollna.com/rss/your_custom_feed_id
OPENAI_MODEL=gpt-4o-mini
```

### 4. Activate Workflow
Toggle the workflow switch from **Inactive** to **Active**. The schedule trigger will run every 3 minutes.
