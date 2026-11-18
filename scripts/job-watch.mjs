import { createHash } from "node:crypto";
import { pathToFileURL } from "node:url";

const SOURCE_URL =
  "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/.github/scripts/listings.json";

const BOARD_AGE_HOURS = 30 * 24;
const STRONG_MATCH_AGE_HOURS = 7 * 24;
const MAX_ALERT_AGE_HOURS = 24;
const JUST_POSTED_HOURS = 1;

const DEFAULT_WISHLIST = [
  "Google",
  "Uber",
  "Meta",
  "Amazon",
  "DoorDash",
  "TikTok",
  "Shopify",
  "Costco",
  "Stripe",
];

const SEATTLE_AREA =
  /\b(seattle|bellevue|kirkland|redmond|tacoma|renton|kent|bothell|woodinville|issaquah|mercer island|everett|lynnwood|shoreline|sammamish|tukwila|auburn|federal way)\b/i;
const SOFTWARE_ROLE = /\b(software|developer|development|swe|backend|full[ -]?stack)\b/i;
const EARLY_CAREER_SIGNAL =
  /\b(new grad(?:uate)?|recent grad(?:uate)?|university grad(?:uate)?|college grad(?:uate)?|graduate software|early career|entry[ -]?level|junior|associate software|software engineer (?:i|1)|software developer (?:i|1)|software development engineer (?:i|1)|swe (?:i|1)|sde (?:i|1)|level (?:i|1)|2026 start|2026 grad(?:uate)?|class of 2026|0\s*(?:-|–|to)\s*2 years?|no (?:professional )?experience)\b/i;
const EXCLUDED_LEVEL =
  /\b(intern(ship)?|co[ -]?op|ph\.?d|doctoral|doctorate|postdoc(?:toral)?|research scientist|researcher|mid[ -]?(?:level|career)|senior|staff|principal|manager|director|lead|architect|software engineer (?:ii|iii|2|3)|software developer (?:ii|iii|2|3)|software development engineer (?:ii|iii|2|3)|swe (?:ii|iii|2|3)|sde (?:ii|iii|2|3)|level (?:ii|iii|2|3))\b/i;
const INELIGIBLE_YEAR = /\b20(?:27|28|29)\b/i;
const REMOTE_ROLE = /\bremote\b/i;
const NON_GENERAL_ROLE = /\b(intern(ship)?|co[ -]?op|ph\.?d|doctoral|doctorate|postdoc(?:toral)?)\b/i;

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;|&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)));
}

function htmlToText(value) {
  return decode(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim(),
  );
}

function cleanUrl(value) {
  try {
    const url = new URL(decode(value));
    if (url.protocol !== "https:" || url.username || url.password) return "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|ref$|gh_src$|source$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return "";
  }
}

function requisitionToken(value) {
  // Decode valid escapes while tolerating older rows with malformed URLs.
  const decoded = value.replace(/%[0-9a-f]{2}/gi, (escape) => String.fromCharCode(parseInt(escape.slice(1), 16)));
  const named = decoded.match(/(?:jr|req|requisition)[-_]?(\d{5,})/i);
  if (named) return named[0].toLowerCase().replace(/[-_]/g, "");
  const uuid = decoded.match(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i);
  if (uuid) return uuid[0].toLowerCase();
  const numeric = decoded.match(/(?:^|\D)(\d{7,})(?:\D|$)/);
  return numeric?.[1] ?? "";
}

function normalizedTitle(value) {
  return value
    .toLowerCase()
    .replace(/\b(new grad(?:uate)?|entry[ -]?level|early career|college grad(?:uate)?|university grad(?:uate)?)\b/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function makeExternalId({ company, title, url }) {
  const companyKey = company.toLowerCase().replace(/[^a-z0-9]/g, "");
  const jobKey = requisitionToken(url) || normalizedTitle(title);
  return createHash("sha256").update(`${companyKey}|${jobKey}`).digest("hex");
}

function hoursSince(timestamp, nowMs) {
  if (!Number.isFinite(timestamp) || timestamp <= 0 || timestamp * 1000 > nowMs) return null;
  return (nowMs - timestamp * 1000) / 3_600_000;
}

function ageLabel(hours) {
  hours = Math.floor(hours);
  if (hours < 1) return "Less than 1 hour";
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"}`;
  const days = Math.floor(hours / 24);
  return `${days} ${days === 1 ? "day" : "days"}`;
}

export function parseListings(rawText, nowMs = Date.now(), wishlistCompanies = DEFAULT_WISHLIST) {
  const sourceListings = JSON.parse(rawText);
  if (!Array.isArray(sourceListings)) throw new Error("Simplify listings payload is not an array.");

  const wishlist = wishlistCompanies
    .map((company) => String(company).toLowerCase().replace(/[^a-z0-9]/g, ""))
    .filter(Boolean);
  const uniqueListings = new Map();

  for (const item of sourceListings) {
    if (!item?.active || !item?.is_visible || item.category !== "Software") continue;

    const company = String(item.company_name ?? "").trim();
    const title = String(item.title ?? "").trim();
    const locations = Array.isArray(item.locations) ? item.locations.map(String) : [];
    const location = locations.join(", ");
    const url = cleanUrl(String(item.url ?? ""));
    const degrees = Array.isArray(item.degrees) ? item.degrees.map((degree) => String(degree).toLowerCase()) : [];
    const ageHours = hoursSince(Number(item.date_posted), nowMs);
    const eligibilityText = `${title} ${url}`;

    if (!company || !title || !url || ageHours === null || ageHours > BOARD_AGE_HOURS) continue;
    if (!SEATTLE_AREA.test(location) || REMOTE_ROLE.test(`${location} ${title}`)) continue;
    if (!SOFTWARE_ROLE.test(title) || NON_GENERAL_ROLE.test(title)) continue;

    const acceptsBachelors = degrees.some((degree) => /bachelor/.test(degree));
    const phdOnly = degrees.some((degree) => /ph\.?d|doctor/.test(degree)) && !acceptsBachelors;
    if (phdOnly) continue;

    const normalizedCompany = company.toLowerCase().replace(/[^a-z0-9]/g, "");
    const listing = {
      company,
      title,
      location,
      url,
      posted_at: new Date(Number(item.date_posted) * 1000).toISOString(),
      discovered_at: new Date(nowMs).toISOString(),
      source: "Simplify New Grad Positions",
      is_wishlist: wishlist.some((wishlistCompany) => normalizedCompany.includes(wishlistCompany)),
      strong_candidate: ageHours <= STRONG_MATCH_AGE_HOURS
        && EARLY_CAREER_SIGNAL.test(eligibilityText)
        && !EXCLUDED_LEVEL.test(eligibilityText)
        && !INELIGIBLE_YEAR.test(eligibilityText),
      age_hours: ageHours,
      age: ageLabel(ageHours),
    };
    listing.external_id = makeExternalId(listing);

    const previous = uniqueListings.get(listing.external_id);
    if (!previous || (listing.strong_candidate && !previous.strong_candidate)) {
      uniqueListings.set(listing.external_id, listing);
    }
  }

  return [...uniqueListings.values()].sort(
    (a, b) => Number(b.is_wishlist) - Number(a.is_wishlist) || Date.parse(b.posted_at) - Date.parse(a.posted_at),
  );
}

async function loadWishlist() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const ownerId = process.env.OWNER_USER_ID;

  if (!supabaseUrl || !secretKey || !ownerId) return DEFAULT_WISHLIST;

  const response = await fetch(
    `${supabaseUrl}/rest/v1/job_preferences?owner_id=eq.${ownerId}&select=wishlist_companies&limit=1`,
    { headers: { apikey: secretKey } },
  );
  if (!response.ok) {
    console.log("Wishlist preferences are not available yet; using the default company list.");
    return DEFAULT_WISHLIST;
  }

  const rows = await response.json();
  const savedWishlist = rows[0]?.wishlist_companies;
  return Array.isArray(savedWishlist) ? savedWishlist : DEFAULT_WISHLIST;
}

export function evaluateJobDescription(rawText) {
  const text = htmlToText(rawText);
  if (text.length < 200) return { eligible: null, reason: "description unavailable" };

  if (/(?:minimum|basic|required)\s+qualifications?[^.]{0,180}\b(?:ph\.?d|doctoral)\b|\b(?:ph\.?d|doctoral)\s+degree\b[^.]{0,80}\brequired\b/i.test(text)) {
    return { eligible: false, reason: "PhD or doctoral degree required" };
  }
  if (/\bat least\s+(?:one|two|three|four|\d+)\s+(?:previous\s+)?(?:software engineering\s+|technical\s+)?internships?\b|\bminimum(?:\s+of)?\s+(?:one|two|three|four|\d+)\s+(?:software engineering\s+|technical\s+)?internships?\b/i.test(text)) {
    return { eligible: false, reason: "prior internships required" };
  }
  if (/\b(?:graduating|graduation|class of|start(?:ing)?)\b[^.;]{0,100}\b20(?:27|28|29)\b|\b20(?:27|28|29)\b[^.;]{0,100}\b(?:graduat|class|start)/i.test(text)) {
    return { eligible: false, reason: "graduation or start date is after June 2026" };
  }
  if (/\b(?:graduating|graduation date)\b[^.;]{0,80}\b(?:fall|autumn)\s+2026\b/i.test(text)) {
    return { eligible: false, reason: "requires Fall 2026 or later graduation" };
  }

  const experienceText = text
    .replace(/\bno more than\s+(?:one|two|three|\d+)\s+years?[^.;]{0,80}\bexperience\b/gi, " ")
    .replace(/\bup to\s+(?:one|two|three|\d+)\s+years?[^.;]{0,80}\bexperience\b/gi, " ")
    .replace(/\b0\s*(?:-|–|to)\s*2\s+years?[^.;]{0,80}\bexperience\b/gi, " ");
  if (/\b(?:at least|minimum(?:\s+of)?)\s+(?:one|two|three|four|five|\d+)\s+years?[^.;]{0,100}\bexperience\b|\b(?:one|two|three|four|five|[1-9]\d*)\+\s+years?[^.;]{0,100}\bexperience\b|\b(?:one|two|three|four|five|[1-9]\d*)\s+years?[^.;]{0,80}\bexperience\s+required\b/i.test(experienceText)) {
    return { eligible: false, reason: "prior professional experience required" };
  }
  const requiredSection = experienceText
    .split(/\b(?:minimum|basic|required)\s+(?:qualifications|requirements)\b/i)[1]
    ?.split(/\b(?:preferred qualifications|preferred experience|nice to have|benefits|about (?:us|the company))\b/i)[0];
  if (requiredSection && /\b(?:one|two|three|four|five|[1-9]\d*)(?:\s*(?:-|–|to)\s*\d+)?\s+years?[^.;]{0,80}\bexperience\b/i.test(requiredSection)) {
    return { eligible: false, reason: "prior professional experience listed in minimum qualifications" };
  }

  return /\b(?:qualifications?|requirements?|bachelor|experience)\b/i.test(text)
    ? { eligible: true, reason: "description passed" }
    : { eligible: null, reason: "job requirements unavailable" };
}

async function inspectListing(listing) {
  try {
    const response = await fetch(listing.url, {
      redirect: "follow",
      signal: AbortSignal.timeout(12_000),
      headers: { "User-Agent": "Muhammadbager-Career-Deck/1.0" },
    });
    if (!response.ok) return { listing, eligible: null, reason: `description HTTP ${response.status}` };
    const result = evaluateJobDescription((await response.text()).slice(0, 2_000_000));
    return { listing, ...result };
  } catch (error) {
    return { listing, eligible: null, reason: error instanceof Error ? error.message : "description fetch failed" };
  }
}

export async function classifyListings(listings, inspect = inspectListing) {
  const candidates = listings.filter((listing) => listing.strong_candidate);
  const verifiedIds = new Set();
  let cursor = 0;

  async function worker() {
    while (cursor < candidates.length) {
      const listing = candidates[cursor++];
      const result = await inspect(listing);
      if (result.eligible === true) {
        verifiedIds.add(listing.external_id);
      } else {
        console.log(`Dashboard only: ${listing.company}: ${listing.title} (${result.reason}).`);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(5, candidates.length) }, () => worker()));
  return listings.map(({ strong_candidate: _candidate, ...listing }) => ({
    ...listing,
    is_strong_match: verifiedIds.has(listing.external_id),
  }));
}

// Legacy "new" and "expired" rows already participated in alert deduplication.
function alertHandled(status) {
  return status === "new" || status === "browse_seen" || status === "expired";
}

export function listingStatus(listing, previousStatus, initialBaseline) {
  const handled = alertHandled(previousStatus);
  if (!listing.is_strong_match) return handled ? "browse_seen" : "browse";
  return handled || initialBaseline || listing.age_hours > MAX_ALERT_AGE_HOURS
    ? "new"
    : "match_pending";
}

async function syncMatches(listings) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const ownerId = process.env.OWNER_USER_ID;

  if (!supabaseUrl || !secretKey || !ownerId) {
    console.log("Private backend secrets are not configured; discovery completed in dry-run mode.");
    return [];
  }

  const matchesUrl = `${supabaseUrl}/rest/v1/job_matches`;
  const existingMatches = [];
  const pageSize = 500;
  let afterId = "";
  while (true) {
    const cursor = afterId ? `&id=gt.${afterId}` : "";
    const response = await fetch(
      `${matchesUrl}?owner_id=eq.${ownerId}&select=id,external_id,status,company,title,url,discovered_at&order=id.asc&limit=${pageSize}${cursor}`,
      { headers: { apikey: secretKey } },
    );
    if (!response.ok) throw new Error(`Supabase lookup failed (${response.status}): ${await response.text()}`);
    const page = await response.json();
    existingMatches.push(...page);
    if (page.length < pageSize) break;
    afterId = page.at(-1).id;
  }

  const existingByCanonicalId = new Map();
  for (const match of existingMatches) {
    const canonicalId = makeExternalId(match);
    const previous = existingByCanonicalId.get(canonicalId);
    if (!previous || (alertHandled(match.status) && !alertHandled(previous.status))) {
      existingByCanonicalId.set(canonicalId, match);
    }
  }
  const currentIds = new Set(listings.map((listing) => listing.external_id));
  const staleMatches = existingMatches.filter(
    (match) => !match.status.startsWith("expired") && !currentIds.has(match.external_id),
  );

  for (const handled of [true, false]) {
    const staleIds = staleMatches.filter((match) => alertHandled(match.status) === handled).map((match) => match.external_id);
    for (let index = 0; index < staleIds.length; index += 40) {
      const staleFilter = encodeURIComponent(`(${staleIds.slice(index, index + 40).join(",")})`);
      await updateStatus(`external_id=in.${staleFilter}`, handled ? "expired" : "expired_browse");
    }
  }

  const pendingAlerts = [];
  const payload = listings.map(({ age: _age, age_hours, is_strong_match, ...listing }) => {
    const previous = existingByCanonicalId.get(listing.external_id);
    const status = listingStatus({ age_hours, is_strong_match }, previous?.status, !existingMatches.length);
    if (status === "match_pending") pendingAlerts.push({ ...listing, age_hours, age: _age });
    return { ...listing, discovered_at: previous?.discovered_at ?? listing.discovered_at, status, owner_id: ownerId };
  });

  for (let index = 0; index < payload.length; index += 100) {
    const response = await fetch(`${matchesUrl}?on_conflict=owner_id,external_id`, {
      method: "POST",
      headers: {
        apikey: secretKey,
        "Content-Type": "application/json",
        Prefer: "return=minimal,resolution=merge-duplicates",
      },
      body: JSON.stringify(payload.slice(index, index + 100)),
    });
    if (!response.ok) throw new Error(`Supabase insert failed (${response.status}): ${await response.text()}`);
  }

  console.log(`Synced ${listings.length} dashboard jobs and archived ${staleMatches.length} stale jobs.`);
  if (!existingMatches.length) console.log("Initial baseline stored without sending Discord alerts.");
  return pendingAlerts;
}

async function updateStatus(filter, status) {
  const { SUPABASE_URL: url, SUPABASE_SECRET_KEY: key, OWNER_USER_ID: ownerId } = process.env;
  const response = await fetch(`${url}/rest/v1/job_matches?owner_id=eq.${ownerId}&${filter}`, {
    method: "PATCH",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) throw new Error(`Supabase status update failed (${response.status}): ${await response.text()}`);
}

async function notifyDiscord(matches) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook || !matches.length) return 0;

  const discordUserId = /^\d{15,22}$/.test(process.env.DISCORD_USER_ID ?? "")
    ? process.env.DISCORD_USER_ID
    : null;

  for (const match of matches) {
    const justPosted = match.age_hours <= JUST_POSTED_HOURS;
    const mention = justPosted && discordUserId ? `<@${discordUserId}> ` : "";
    // Record the attempt before delivery to avoid duplicate pings if the webhook outcome is ambiguous.
    await updateStatus(`external_id=eq.${match.external_id}&status=eq.match_pending`, "new");
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Seattle Job Watch",
        content: `${mention}${justPosted ? "JUST POSTED" : "New posting"} — ${match.company}`,
        allowed_mentions: { parse: [], users: justPosted && discordUserId ? [discordUserId] : [] },
        embeds: [{
          title: match.title,
          url: match.url,
          color: match.is_wishlist ? 0xad667d : 0x2f6f58,
          description: `${match.company} · ${match.location}`,
          timestamp: match.posted_at,
          fields: [
            { name: "Priority", value: match.is_wishlist ? "Wishlist company" : "Strong match", inline: true },
            { name: "Posted", value: match.age, inline: true },
            { name: "Source", value: match.source, inline: true },
          ],
          footer: { text: "Greater Seattle · Bachelor's/new grad · No remote" },
        }],
      }),
    });
    if (!response.ok) throw new Error(`Discord notification failed (${response.status}): ${await response.text()}`);
  }
  return matches.length;
}

async function main() {
  const response = await fetch(SOURCE_URL, { headers: { "User-Agent": "Muhammadbager-Career-Deck/1.0" } });
  if (!response.ok) throw new Error(`Source fetch failed (${response.status})`);
  const wishlist = await loadWishlist();
  const parsedListings = parseListings(await response.text(), Date.now(), wishlist);
  const listings = await classifyListings(parsedListings);
  console.log(`Loaded ${wishlist.length} wishlist companies.`);
  console.log(`Found ${listings.length} Greater Seattle jobs for the dashboard (${listings.filter((job) => job.is_strong_match).length} strong matches).`);
  if (process.env.DEBUG_MATCHES === "1") {
    for (const listing of listings) {
      console.log(`- ${listing.company}: ${listing.title} | ${listing.age} | ${listing.location} | ${listing.url}`);
    }
  }
  const pendingAlerts = await syncMatches(listings);
  if (process.env.REFRESH_ONLY === "true") {
    console.log("Dashboard refresh complete. Discord alerts remain queued.");
    return;
  }
  const sent = await notifyDiscord(pendingAlerts);
  console.log(`Sent ${sent} Discord alerts for ${pendingAlerts.length} eligible jobs.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  });
}
