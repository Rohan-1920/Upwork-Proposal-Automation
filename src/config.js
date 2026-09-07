/**
 * Freelancer Technical Profile & Intelligence Engine Configuration
 */
module.exports = {
  freelancer: {
    name: "Rohan Majeed",
    title: "AI Automation Architect & Full-Stack Engineer",
    coreSkills: [
      "n8n", "automation", "workflow", "zapier", "make.com", "integromat",
      "email automation", "ai", "gpt", "openai", "claude", "llm",
      "api integration", "web scraping", "python", "javascript", "typescript",
      "node.js", "aws", "bedrock", "langchain", "chatbot", "data pipeline"
    ],
    secondarySkills: [
      "react", "next.js", "express", "postgresql", "mongodb", "docker",
      "fastapi", "airtable", "google sheets", "slack bot"
    ],
    experienceYears: 5,
    minFixedBudget: 300,        // Minimum fixed-price budget in USD
    minHourlyRate: 35,          // Minimum hourly rate in USD
    targetHourlyRate: 60
  },

  scoringWeights: {
    skillMatch: 30,             // Max points for technical skill coverage
    clientQuality: 25,          // Max points for client rating, spend, history
    budgetFit: 20,              // Max points for budget suitability
    competitionClarity: 15,     // Max points for job description clarity & low competition
    strategicFit: 10            // Max points for strategic domain alignment & low risk
  },

  thresholds: {
    highPriority: 85,           // Auto-generate proposal & urgent alert
    worthReviewing: 70,         // Draft proposal & queue for human review
    lowPriority: 50,            // Log to CRM, optional review
    ignoreBelow: 50             // Automatically filter out
  }
};
