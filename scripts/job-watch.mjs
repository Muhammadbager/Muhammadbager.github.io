import { createHash } from "node:crypto";

const SOURCE_URL =
  "https://raw.githubusercontent.com/SimplifyJobs/New-Grad-Positions/dev/README.md";

const WISHLIST = new Set([
  "google",
  "uber",
  "meta",
  "amazon",
  "doordash",
  "tiktok",
  "shopify",
  "costco",
  "stripe",
]);

const SEATTLE_AREA =
  /\b(seattle|bellevue|redmond|kirkland|bothell|renton|issaquah|mercer island|greater seattle)\b|\bWA\b/i;
const SOFTWARE_ROLE = /\b(software|developer|development|swe|backend|full[ -]?stack)\b/i;
const EXCLUDED_LEVEL = /\b(intern(ship)?|senior|staff|principal|manager|director|lead|architect)\b/i;
const REMOTE_ROLE = /\bremote\b/i;

function decode(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;|&mdash;/g, "-")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)));
}

function stripTags(value) {
  return decode(value.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim());
}

function cleanUrl(value) {
  try {
    const url = new URL(decode(value));
    for (const key of [...url.searchParams.keys()]) {
      if (/^(utm_|ref$|gh_src$|source$)/i.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch {
    return decode(value);
  }
}

export function parseListings(markdown) {
  const softwareSection = markdown.split("## 💻 Software Engineering New Grad Roles")[1]?.split("## ")[0] ?? "";
  const rows = [...softwareSection.matchAll(/<tr>([\s\S]*?)<\/tr>/gi)].map((match) => match[1]);
  const listings = [];
  let currentCompany = "";

  for (const row of rows) {
    const cells = [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((match) => match[1]);
    if (cells.length < 5) continue;

    const companyCell = stripTags(cells[0]);
    if (companyCell && companyCell !== "↳") currentCompany = companyCell.replace(/[🔥🛂🇺🇸🔒🎓]/gu, "").trim();

    const title = stripTags(cells[1]);
    const location = stripTags(cells[2]);
    const age = stripTags(cells[4]);
    const hrefs = [...cells[3].matchAll(/href="([^"]+)"/gi)].map((match) => cleanUrl(match[1]));
    const applyUrl = hrefs.find((url) => !/simplify\.jobs/i.test(url));

    if (!currentCompany || !title || !location || !applyUrl) continue;
    if (!SEATTLE_AREA.test(location) || REMOTE_ROLE.test(location)) continue;
    if (!SOFTWARE_ROLE.test(title) || EXCLUDED_LEVEL.test(title)) continue;

    const normalizedCompany = currentCompany.toLowerCase().replace(/[^a-z0-9]/g, "");
    listings.push({
      external_id: createHash("sha256").update(applyUrl).digest("hex"),
      company: currentCompany,
      title,
      location,
      url: applyUrl,
      posted_at: null,
      discovered_at: new Date().toISOString(),
      source: "Simplify New Grad Positions",
      is_wishlist: [...WISHLIST].some((company) => normalizedCompany.includes(company)),
      status: "new",
      age,
    });
  }

  return listings.sort((a, b) => Number(b.is_wishlist) - Number(a.is_wishlist));
}

async function saveNewMatches(listings) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const ownerId = process.env.OWNER_USER_ID;

  if (!supabaseUrl || !serviceKey || !ownerId) {
    console.log("Private backend secrets are not configured; discovery completed in dry-run mode.");
    return listings;
  }

  const payload = listings.map(({ age: _age, ...listing }) => ({ ...listing, owner_id: ownerId }));
  const response = await fetch(`${supabaseUrl}/rest/v1/job_matches?on_conflict=owner_id,external_id`, {
    method: "POST",
    headers: {
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation,resolution=ignore-duplicates",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error(`Supabase insert failed (${response.status}): ${await response.text()}`);
  return response.json();
}

async function notifyDiscord(matches) {
  const webhook = process.env.DISCORD_WEBHOOK_URL;
  if (!webhook || !matches.length) return;

  for (let index = 0; index < matches.length; index += 10) {
    const batch = matches.slice(index, index + 10);
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "Seattle Job Watch",
        content: index === 0 ? `Found ${matches.length} new Greater Seattle software role${matches.length === 1 ? "" : "s"}.` : undefined,
        embeds: batch.map((match) => ({
          title: match.title,
          url: match.url,
          color: match.is_wishlist ? 0xad667d : 0x2f6f58,
          description: `${match.company} · ${match.location}`,
          fields: [
            { name: "Priority", value: match.is_wishlist ? "Wishlist company" : "Broader match", inline: true },
            { name: "Source age", value: match.age ?? "New", inline: true },
          ],
          footer: { text: "Greater Seattle · Entry level · On-site/hybrid" },
        })),
      }),
    });
    if (!response.ok) throw new Error(`Discord notification failed (${response.status}): ${await response.text()}`);
  }
}

async function main() {
  const response = await fetch(SOURCE_URL, { headers: { "User-Agent": "Muhammadbager-Career-Deck/1.0" } });
  if (!response.ok) throw new Error(`Source fetch failed (${response.status})`);
  const listings = parseListings(await response.text());
  console.log(`Found ${listings.length} matching Greater Seattle roles (${listings.filter((job) => job.is_wishlist).length} wishlist).`);
  const newMatches = await saveNewMatches(listings);
  await notifyDiscord(newMatches);
  console.log(`Processed ${newMatches.length} new matches.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});

