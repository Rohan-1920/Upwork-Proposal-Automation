/**
 * Upwork AI Opportunity Intelligence & Proposal Automation - Terminal CLI
 * 
 * Usage:
 *   node src/cli.js --file examples/sample-job.json
 *   node src/cli.js --test
 */

const fs = require('fs');
const path = require('path');
const { normalizeJobData } = require('./parser');
const { evaluateOpportunity } = require('./scorer');
const { buildProposalPrompt, generateMockProposal } = require('./proposal');

function printBanner() {
  console.log(`
====================================================================
🚀 UPWORK AI OPPORTUNITY INTELLIGENCE & PROPOSAL AUTOMATION ENGINE
====================================================================
  `);
}

function processJobFile(filePath) {
  const absolutePath = path.resolve(filePath);
  if (!fs.existsSync(absolutePath)) {
    console.error(`❌ File not found: ${absolutePath}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(absolutePath, 'utf8');
  let jobJson;
  try {
    jobJson = JSON.parse(rawData);
  } catch (e) {
    console.error(`❌ Invalid JSON in file ${filePath}: ${e.message}`);
    process.exit(1);
  }

  // Support array of jobs or single job object
  const jobs = Array.isArray(jobJson) ? jobJson : [jobJson];

  console.log(`🔍 Processing ${jobs.length} job opportunity(ies)...\n`);

  jobs.forEach((job, index) => {
    const parsed = normalizeJobData(job);
    const score = evaluateOpportunity(parsed);
    const proposalPrompt = buildProposalPrompt(parsed, score);
    const proposalDraft = generateMockProposal(parsed, score);

    console.log(`--------------------------------------------------------------------`);
    console.log(`📌 JOB #${index + 1}: ${parsed.title}`);
    console.log(`--------------------------------------------------------------------`);
    console.log(`🆔 Job ID:         ${parsed.jobId}`);
    console.log(`💰 Budget:         ${parsed.budget.raw} (${parsed.budget.type})`);
    console.log(`⭐ Client Rating:  ${parsed.client.rating ? parsed.client.rating + ' / 5' : 'New / Unrated'}`);
    console.log(`💵 Client Spend:   $${parsed.client.spent.toLocaleString()}`);
    console.log(`🔗 Upwork URL:     ${parsed.upworkUrl}`);
    console.log(`🛠️  Skills Needed:  ${parsed.skillsRequired.join(', ') || 'Not specified'}`);
    console.log(`\n📊 INTELLIGENCE ANALYSIS:`);
    console.log(`   - Overall Score:    ${score.totalScore} / 100`);
    console.log(`   - Priority Level:   [ ${score.priority.toUpperCase()} ]`);
    console.log(`   - Recommended:      ${score.recommendedAction}`);
    console.log(`   - Score Breakdown:  Skill=${score.breakdown.skillScore}/30 | Client=${score.breakdown.clientScore}/25 | Budget=${score.breakdown.budgetScore}/20 | Clarity=${score.breakdown.clarityScore}/15 | Strategic=${score.breakdown.strategicScore}/10`);
    console.log(`   - Matched Skills:   ${score.matchedSkills.join(', ') || 'None'}`);

    if (score.detectedRedFlags.length > 0) {
      console.log(`   ⚠️ RED FLAGS:        ${score.detectedRedFlags.join(', ')}`);
    }

    if (score.totalScore >= 70) {
      console.log(`\n✍️ AI PROPOSAL DRAFT (${proposalDraft.split(' ').length} words):`);
      console.log(`--------------------------------------------------------------------`);
      console.log(proposalDraft);
      console.log(`--------------------------------------------------------------------`);
    } else {
      console.log(`\n⏭️  Skipping AI Proposal generation (Score < 70 threshold).`);
    }

    console.log(`\n`);
  });
}

function runDemoTest() {
  const sampleJob = {
    title: "n8n Automation Architect for AI Email Processing ($1,500)",
    link: "https://www.upwork.com/jobs/~01a2b3c4d5e6f7g8",
    description: "Looking for an expert n8n workflow engineer to build an automated email triage pipeline. Must integrate OpenAI GPT-4o for email classification, extract lead data, and save directly to Airtable. Client Rating: 4.9 of 5. $25,000 total spent. Payment method verified.",
    skills: "n8n, OpenAI, API Integration, Python, Airtable",
    pubDate: new Date().toISOString()
  };

  const tempPath = path.join(__dirname, '../examples/sample-job.json');
  fs.writeFileSync(tempPath, JSON.stringify(sampleJob, null, 2));
  processJobFile(tempPath);
}

// MAIN ENTRY POINT
printBanner();

const args = process.argv.slice(2);
if (args.includes('--test')) {
  console.log(`🧪 Running inline demo test...`);
  runDemoTest();
} else if (args.includes('--file')) {
  const fileIndex = args.indexOf('--file') + 1;
  const filePath = args[fileIndex];
  if (!filePath) {
    console.error('❌ Please specify a file path after --file');
    process.exit(1);
  }
  processJobFile(filePath);
} else {
  console.log(`Defaulting to demo test run... Use '--file <path>' to analyze custom JSON.`);
  runDemoTest();
}
