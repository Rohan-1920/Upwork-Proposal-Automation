/**
 * Upwork Job Data Normalizer & Parser
 */

function safeMultiDecode(str, times = 3) {
  if (typeof str !== 'string' || !str) return '';
  let prev = str, cur = str;
  for (let i = 0; i < times; i++) {
    try { cur = decodeURIComponent(prev); } catch (e) { break; }
    if (cur === prev) break;
    prev = cur;
  }
  return cur;
}

function extractCleanUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  try {
    if (rawUrl.includes('url=')) {
      const part = rawUrl.split('url=')[1];
      return safeMultiDecode(part);
    }
    const parsed = new URL(rawUrl);
    if (parsed.hostname.includes('upwork.com')) return rawUrl;
    return rawUrl;
  } catch (e) {
    return rawUrl;
  }
}

function generateJobId(url, title = '') {
  if (url && typeof url === 'string') {
    const match = url.match(/~([a-zA-Z0-9]+)/);
    if (match) return match[1];
  }
  // Fallback hash generator for job title + timestamp string
  let hash = 0;
  const str = (title || '') + (url || '');
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return `job_${Math.abs(hash).toString(36)}`;
}

function parseBudget(description, title = '') {
  const combined = `${title} ${description}`;
  
  // Fixed budget match ($1,000, $500, etc.)
  const fixedMatch = combined.match(/Budget:\s*\$?([\d,]+)/i) || 
                     combined.match(/Fixed[- ]Price:\s*\$?([\d,]+)/i) ||
                     title.match(/\(\$?([\d,]+)\)$/);
  
  if (fixedMatch) {
    const amount = parseInt(fixedMatch[1].replace(/,/g, ''), 10);
    return { type: 'fixed', min: amount, max: amount, raw: `$${amount}` };
  }

  // Hourly range match ($30-$50/hr or $40/hr)
  const hourlyRangeMatch = combined.match(/\$([\d.]+)\s*-\s*\$([\d.]+)\s*\/?(hr|hour)/i);
  if (hourlyRangeMatch) {
    const min = parseFloat(hourlyRangeMatch[1]);
    const max = parseFloat(hourlyRangeMatch[2]);
    return { type: 'hourly', min, max, raw: `$${min}-$${max}/hr` };
  }

  const hourlySingleMatch = combined.match(/\$([\d.]+)\s*\/?(hr|hour)/i);
  if (hourlySingleMatch) {
    const rate = parseFloat(hourlySingleMatch[1]);
    return { type: 'hourly', min: rate, max: rate, raw: `$${rate}/hr` };
  }

  return { type: 'unknown', min: 0, max: 0, raw: 'Not specified' };
}

function parseClientDetails(description) {
  if (!description || typeof description !== 'string') {
    return { rating: null, spent: 0, paymentVerified: false, country: 'Unknown' };
  }

  const ratingMatch = description.match(/([\d.]+)\s*of\s*5/i) || description.match(/Rating:\s*([\d.]+)/i);
  const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;

  const spentMatch = description.match(/\$([\d,]+)\+?\s*(total\s*)?spent/i);
  const spent = spentMatch ? parseInt(spentMatch[1].replace(/,/g, ''), 10) : 0;

  const paymentVerified = /payment\s+(verified|method\s+verified)/i.test(description);

  const countryMatch = description.match(/Country:\s*([A-Za-z\s]+)/i);
  const country = countryMatch ? countryMatch[1].trim() : 'Unknown';

  return { rating, spent, paymentVerified, country };
}

function parseSkills(description, rawSkills = '') {
  let skillList = [];
  if (rawSkills && typeof rawSkills === 'string') {
    skillList = rawSkills.split(',').map(s => s.trim()).filter(Boolean);
  }

  const extractedMatch = description ? description.match(/^Skill(?:s)?:?\s*([^\n\r]+)/im) : null;
  if (extractedMatch) {
    const extra = extractedMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    skillList = Array.from(new Set([...skillList, ...extra]));
  }

  return skillList;
}

function normalizeJobData(rawJob) {
  const title = rawJob.title || rawJob.jobTitle || 'Untitled Job';
  const rawDescription = rawJob.content || rawJob.jobDescription || rawJob.description || '';
  const rawUrl = rawJob.link || rawJob.jobUrl || rawJob.upwork_link || '';

  // Clean description of HTML tags & entities
  const description = rawDescription
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();

  const upworkUrl = extractCleanUrl(rawUrl);
  const jobId = rawJob.jobId || generateJobId(upworkUrl, title);
  const budget = parseBudget(description, title);
  const client = parseClientDetails(description);
  const skillsRequired = parseSkills(description, rawJob.skills || rawJob.skillsRequired);

  return {
    jobId,
    title,
    upworkUrl,
    description,
    postedAt: rawJob.pubDate || rawJob.postedAt || new Date().toISOString(),
    budget,
    client,
    skillsRequired,
    rawGuid: rawJob.guid || rawUrl
  };
}

module.exports = {
  normalizeJobData,
  parseBudget,
  parseClientDetails,
  extractCleanUrl,
  generateJobId
};
