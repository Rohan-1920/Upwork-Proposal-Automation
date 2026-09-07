/**
 * Upwork AI Opportunity Intelligence & Scoring Engine (0-100)
 */

const config = require('./config');

function evaluateOpportunity(parsedJob) {
  const { freelancer, scoringWeights, thresholds } = config;
  const textToScan = `${parsedJob.title} ${parsedJob.description} ${parsedJob.skillsRequired.join(' ')}`.toLowerCase();

  // -------------------------------------------------------------
  // 1. Skill Match Score (0 - 30 Points)
  // -------------------------------------------------------------
  const matchedCoreSkills = freelancer.coreSkills.filter(skill => textToScan.includes(skill.toLowerCase()));
  const matchedSecondarySkills = freelancer.secondarySkills.filter(skill => textToScan.includes(skill.toLowerCase()));

  const totalSkillMatches = matchedCoreSkills.length + (matchedSecondarySkills.length * 0.5);
  
  let skillScore = 0;
  if (totalSkillMatches >= 4) skillScore = scoringWeights.skillMatch;
  else if (totalSkillMatches === 3) skillScore = 24;
  else if (totalSkillMatches === 2) skillScore = 18;
  else if (totalSkillMatches === 1) skillScore = 10;
  else skillScore = 0;

  // -------------------------------------------------------------
  // 2. Client Quality Score (0 - 25 Points)
  // -------------------------------------------------------------
  let clientScore = 0;
  const { rating, spent, paymentVerified } = parsedJob.client;

  // Client Rating (max 12 pts)
  if (rating === null || rating === undefined) {
    clientScore += 8; // Neutral score for new clients with no feedback yet
  } else if (rating >= 4.8) {
    clientScore += 12;
  } else if (rating >= 4.5) {
    clientScore += 9;
  } else if (rating >= 4.0) {
    clientScore += 5;
  } else {
    clientScore += 0; // Penalty for rating < 4.0
  }

  // Client Spending (max 8 pts)
  if (spent >= 50000) clientScore += 8;
  else if (spent >= 10000) clientScore += 6;
  else if (spent >= 1000) clientScore += 4;
  else if (spent > 0) clientScore += 2;
  else clientScore += 1;

  // Payment Verification (max 5 pts)
  if (paymentVerified) clientScore += 5;
  else clientScore += 2;

  // -------------------------------------------------------------
  // 3. Budget Fit Score (0 - 20 Points)
  // -------------------------------------------------------------
  let budgetScore = 0;
  const { budget } = parsedJob;

  if (budget.type === 'fixed') {
    if (budget.min >= 1500) budgetScore = scoringWeights.budgetFit;
    else if (budget.min >= 800) budgetScore = 16;
    else if (budget.min >= freelancer.minFixedBudget) budgetScore = 12;
    else if (budget.min > 0) budgetScore = 5;
    else budgetScore = 8; // Unspecified fixed budget
  } else if (budget.type === 'hourly') {
    if (budget.max >= freelancer.targetHourlyRate) budgetScore = scoringWeights.budgetFit;
    else if (budget.max >= freelancer.minHourlyRate) budgetScore = 14;
    else if (budget.max > 0) budgetScore = 6;
    else budgetScore = 8;
  } else {
    budgetScore = 10; // Unknown budget
  }

  // -------------------------------------------------------------
  // 4. Competition & Scope Clarity Score (0 - 15 Points)
  // -------------------------------------------------------------
  let clarityScore = 0;
  const descLength = parsedJob.description.length;

  if (descLength > 800) clarityScore += 10; // Comprehensive prompt details
  else if (descLength > 300) clarityScore += 7;
  else clarityScore += 3;

  // Positive clarity indicators
  const clarityKeywords = ['architecture', 'api', 'n8n', 'webhook', 'database', 'deliverable', 'scope'];
  const hasClarity = clarityKeywords.some(kw => textToScan.includes(kw));
  if (hasClarity) clarityScore += 5;

  // -------------------------------------------------------------
  // 5. Strategic Fit & Red Flag Penalty (0 - 10 Points)
  // -------------------------------------------------------------
  let strategicScore = 7; // Base score
  
  // High value AI / Automation keywords bonus
  if (textToScan.includes('n8n') || textToScan.includes('openai') || textToScan.includes('agent')) {
    strategicScore += 3;
  }

  // Red Flags Penalty
  const redFlags = ['unpaid', 'free sample', 'test job without pay', 'cheap', 'telegram only', 'whatsapp'];
  const detectedRedFlags = redFlags.filter(rf => textToScan.includes(rf));
  if (detectedRedFlags.length > 0) {
    strategicScore = Math.max(0, strategicScore - 10);
  }

  // -------------------------------------------------------------
  // Final Score Aggregation (0 - 100)
  // -------------------------------------------------------------
  const totalScore = Math.min(100, Math.round(skillScore + clientScore + budgetScore + clarityScore + strategicScore));

  let priority = 'Ignore';
  let recommendedAction = 'Skip application - low match or high risk';

  if (totalScore >= thresholds.highPriority) {
    priority = 'High Priority';
    recommendedAction = 'Generate proposal immediately & alert on Slack/Email';
  } else if (totalScore >= thresholds.worthReviewing) {
    priority = 'Worth Reviewing';
    recommendedAction = 'Generate proposal draft & queue for human review';
  } else if (totalScore >= thresholds.lowPriority) {
    priority = 'Low Priority';
    recommendedAction = 'Log to CRM dashboard for passive review';
  }

  return {
    jobId: parsedJob.jobId,
    title: parsedJob.title,
    totalScore,
    priority,
    recommendedAction,
    breakdown: {
      skillScore: Math.round(skillScore),
      clientScore: Math.round(clientScore),
      budgetScore: Math.round(budgetScore),
      clarityScore: Math.round(clarityScore),
      strategicScore: Math.round(strategicScore)
    },
    matchedSkills: matchedCoreSkills.concat(matchedSecondarySkills),
    detectedRedFlags
  };
}

module.exports = {
  evaluateOpportunity
};
