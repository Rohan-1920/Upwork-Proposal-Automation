# 🔍 Job Analysis & Requirement Extraction Prompt

## Purpose
Extract hidden technical dependencies, project complexity, client pain points, and risk signals from raw Upwork job posts.

```text
Analyze the following Upwork job posting and return a structured JSON evaluation.

--- JOB POST ---
Title: {{ $json.jobTitle }}
Description: {{ $json.jobDescription }}
Budget: {{ $json.budget }}
Skills: {{ $json.skillsRequired }}

--- JSON OUTPUT SCHEMA ---
{
  "core_objective": "Brief 1-sentence summary of what client wants built",
  "technical_stack": ["n8n", "OpenAI", "Python", "API"],
  "implied_requirements": ["Error handling", "Rate limiting", "Authentication"],
  "project_complexity": "Low | Medium | High | Enterprise",
  "estimated_hours": 10,
  "client_pain_point": "The specific bottleneck or problem causing them to hire",
  "potential_red_flags": ["Vague requirements", "Unrealistic budget", "Third-party platform restriction"],
  "recommended_strategy": "Key technical selling point to emphasize in the proposal"
}
```
