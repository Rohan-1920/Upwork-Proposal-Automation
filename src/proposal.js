/**
 * AI Proposal Generation & Payload Builder Engine
 */

const config = require('./config');

function buildProposalPrompt(parsedJob, scoreAnalysis) {
  const { freelancer } = config;
  const matchedSkillsStr = scoreAnalysis.matchedSkills.join(', ') || 'n8n, AI Automation, Node.js, OpenAI';

  const systemMessage = `You are an expert Upwork proposal writer crafting custom, high-converting proposals for top 1% AI automation freelancers.

STRICT WRITING RULES:
1. NEVER use generic openings ("I am writing to express my interest...", "I hope this message finds you well", "I read your job post with great interest").
2. OPENING LINE: Hook the client immediately by referencing a SPECIFIC detail or technical challenge mentioned in their job post.
3. PROOF & EXPERIENCE: Directly state relevant past work with real metrics (e.g. built n8n workflows handling 20,000+ daily events, OpenAI LLM routing).
4. PRACTICAL APPROACH: Offer a concrete 1-2 sentence solution, architecture idea, or quick win.
5. SOFT CALL-TO-ACTION: End with a low-friction, non-pushy next step (e.g., "Happy to share a quick video demo of a similar n8n pipeline if useful.").
6. LENGTH & TONE: Keep it between 140 - 220 words. Concise, direct, professional, conversational. Absolutely no buzzwords or filler.`;

  const userMessage = `Generate a tailored Upwork proposal for this job opportunity:

JOB TITLE: ${parsedJob.title}
BUDGET: ${parsedJob.budget.raw}
REQUIRED SKILLS: ${parsedJob.skillsRequired.join(', ') || 'Not explicitly listed'}
MATCHED FREELANCER SKILLS: ${matchedSkillsStr}
OPPORTUNITY SCORE: ${scoreAnalysis.totalScore}/100 (${scoreAnalysis.priority})

JOB DESCRIPTION:
"${parsedJob.description}"

FREELANCER PROFILE:
- Name: ${freelancer.name}
- Title: ${freelancer.title}
- Core Expertise: ${freelancer.coreSkills.slice(0, 8).join(', ')}
- Achievements: Architected enterprise n8n workflows processing 20K+ daily events, automated LLM routing with cost optimization, complex API integrations (REST, Webhooks, GraphQL).`;

  return {
    model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
    temperature: 0.7,
    max_tokens: 500,
    messages: [
      { role: 'system', content: systemMessage },
      { role: 'user', content: userMessage }
    ]
  };
}

function generateMockProposal(parsedJob, scoreAnalysis) {
  const { freelancer } = config;
  const topSkill = scoreAnalysis.matchedSkills[0] || 'n8n automation';
  
  return `Hi there,

I noticed you're looking for an automated workflow around ${parsedJob.title.replace(/[\(\)]/g, '')}. Build-outs like this often hit bottlenecks with error handling and API rate limits if not architected cleanly.

I recently built an enterprise ${topSkill} pipeline handling over 20,000 automated events daily with automated retry mechanisms and OpenAI LLM classification. 

For your project, I'd approach this by:
1. Setting up modular ${topSkill} sub-workflows to decouple intake from processing.
2. Integrating fallback logic and rate limit buffers to ensure 99.9% execution reliability.
3. Structuring clean JSON outputs directly synced to your target database/CRM.

Would you be open to a quick 5-minute chat or seeing a brief demo of a similar pipeline I've deployed?

Best regards,  
${freelancer.name}  
${freelancer.title}`;
}

module.exports = {
  buildProposalPrompt,
  generateMockProposal
};
