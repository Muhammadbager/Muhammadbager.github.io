import assert from "node:assert/strict";
import test from "node:test";

import { evaluateJobDescription, makeExternalId, parseListings } from "./job-watch.mjs";

const NOW = Date.parse("2026-11-17T12:00:00.000Z");

function listing(overrides = {}) {
  return {
    source: "Simplify",
    category: "Software",
    company_name: "Example",
    id: crypto.randomUUID(),
    title: "Software Engineer New Grad",
    active: true,
    date_updated: Math.floor(NOW / 1000),
    date_posted: Math.floor(NOW / 1000) - 3_600,
    url: `https://example.com/jobs/${crypto.randomUUID()}`,
    locations: ["Seattle, WA"],
    company_url: "https://example.com",
    is_visible: true,
    sponsorship: "Other",
    degrees: ["Bachelor's"],
    ...overrides,
  };
}

test("keeps only recent Seattle bachelor-level early-career software roles", () => {
  const eligible = listing({ company_name: "Stripe", url: "https://stripe.com/jobs/8128744" });
  const phd = listing({ company_name: "Google", title: "Software Engineer Early Career", degrees: ["PhD"] });
  const year2027 = listing({
    company_name: "Amazon",
    title: "Software Development Engineer Early Career",
    url: "https://amazon.jobs/jobs/1234567/early-career-2027",
  });
  const remote = listing({ locations: ["Seattle, WA", "Remote"] });
  const generic = listing({ title: "Software Engineer" });
  const old = listing({ date_posted: Math.floor((NOW - 8 * 24 * 3_600_000) / 1000) });

  const results = parseListings(JSON.stringify([eligible, phd, year2027, remote, generic, old]), NOW);

  assert.equal(results.length, 1);
  assert.equal(results[0].company, "Stripe");
  assert.equal(results[0].age_hours, 1);
});

test("rejects descriptions that require later graduation, internships, or professional experience", () => {
  const doorDash = `
    <h1>Software Engineer I, Entry-Level</h1>
    <p>We are looking for students graduating between Fall 2026 and Summer 2027.</p>
    <p>At least two previous software engineering internships or equivalent practical experience,
    with no more than two years of full-time professional experience.</p>
  `;
  const experienced = `<p>Basic qualifications include at least 2 years of professional software experience.</p>${"x".repeat(220)}`;
  const zeroExperience = `<p>Bachelor's degree. This is a new graduate role and no professional experience is required.</p>${"x".repeat(220)}`;

  assert.equal(evaluateJobDescription(doorDash).eligible, false);
  assert.equal(evaluateJobDescription(experienced).eligible, false);
  assert.equal(evaluateJobDescription(zeroExperience).eligible, true);
});

test("uses the underlying requisition ID to deduplicate alternate application URLs", () => {
  const first = makeExternalId({
    company: "Salesforce",
    title: "Software Engineer New Grad",
    url: "https://salesforce.wd12.myworkdayjobs.com/Futureforce/job/a/Software-Engineer_JR368047",
  });
  const second = makeExternalId({
    company: "Salesforce",
    title: "Software Engineering AMTS New Grad",
    url: "https://salesforce.wd12.myworkdayjobs.com/External/job/b/Software-Engineer_JR368047-1",
  });

  assert.equal(first, second);
});

test("uses a saved company wishlist instead of the built-in defaults", () => {
  const stripe = listing({ company_name: "Stripe", url: "https://stripe.com/jobs/8128744" });
  const microsoft = listing({ company_name: "Microsoft", url: "https://jobs.microsoft.com/jobs/9876543" });

  const results = parseListings(JSON.stringify([stripe, microsoft]), NOW, ["Microsoft"]);

  assert.equal(results.find((result) => result.company === "Microsoft")?.is_wishlist, true);
  assert.equal(results.find((result) => result.company === "Stripe")?.is_wishlist, false);
});
