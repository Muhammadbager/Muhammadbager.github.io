import { readFile } from "node:fs/promises";
import { parse } from "csv-parse/sync";

const sourcePath = process.argv[2];
if (!sourcePath) throw new Error("Usage: node scripts/import-applications.mjs <tracker.csv>");

const supabaseUrl = process.env.SUPABASE_URL;
const secretKey = process.env.SUPABASE_SECRET_KEY;
const ownerId = process.env.OWNER_USER_ID;

function toIsoDate(value) {
  if (!value?.trim()) return null;
  const parts = value.trim().split("/").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return null;
  const [month, day, rawYear] = parts;
  const year = rawYear < 100 ? 2000 + rawYear : rawYear;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const raw = await readFile(sourcePath, "utf8");
const records = parse(raw.split(/\r?\n/).slice(5).join("\n"), {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true,
  trim: true,
});

const applications = records
  .filter((row) => row.Company || row["Job Title"] || row["Job URL"])
  .map((row) => ({
    owner_id: ownerId,
    company: row.Company,
    job_title: row["Job Title"],
    job_url: row["Job URL"] || null,
    location: row.Location || null,
    listing_date: toIsoDate(row["Job Listing Date"]),
    applied_date: toIsoDate(row["Date Applied"]),
    stage: row["Current stage"] || "Applied",
    source: row["Where Job was Found"] === "Linkedin" ? "LinkedIn" : row["Where Job was Found"] || null,
    application_method: row["Application Method"] || null,
    resume_name: row["Resume used to Apply"] || null,
    notes: row["Additional Notes"] || null,
  }));

if (!supabaseUrl || !secretKey || !ownerId) {
  console.log(`Parsed ${applications.length} application records in dry-run mode; no private data was uploaded.`);
  process.exit(0);
}

const response = await fetch(`${supabaseUrl}/rest/v1/applications`, {
  method: "POST",
  headers: {
    apikey: secretKey,
    "Content-Type": "application/json",
    Prefer: "return=representation",
  },
  body: JSON.stringify(applications),
});

if (!response.ok) throw new Error(`Import failed (${response.status}): ${await response.text()}`);
const imported = await response.json();
console.log(`Imported ${imported.length} application records.`);

