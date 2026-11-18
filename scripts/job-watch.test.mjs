import assert from "node:assert/strict";
import test from "node:test";

import { parseListings } from "./job-watch.mjs";

function row(company, title, location, id) {
  return `<tr>
    <td>${company}</td>
    <td>${title}</td>
    <td>${location}</td>
    <td><a href="https://example.com/jobs/${id}">Apply</a></td>
    <td>0d</td>
  </tr>`;
}

test("keeps explicit bachelor-level early-career roles and rejects misleading titles", () => {
  const markdown = `
## 💻 Software Engineering New Grad Roles
<table>
${row("Stripe", "Software Engineer New Grad", "Seattle, WA", "new-grad")}
${row("Amazon", "Software Development Engineer I", "Bellevue, WA", "engineer-one")}
${row("Google", "Software Engineer, Infrastructure, PhD, Early Career, 2027 Start", "Kirkland, WA", "phd")}
${row("Blue Origin", "Software Development Engineer 1 - Early Career - 2027 Starts", "Seattle, WA", "starts")}
${row("Example", "Software Engineer II, Early Career", "Seattle, WA", "mid")}
${row("Example", "Software Engineer New Grad", "Seattle, WA / Remote", "remote")}
${row("Example", "Software Engineer", "Seattle, WA", "generic")}
</table>
## Other Roles
`;

  const listings = parseListings(markdown);

  assert.deepEqual(
    listings.map(({ company, title }) => ({ company, title })),
    [
      { company: "Stripe", title: "Software Engineer New Grad" },
      { company: "Amazon", title: "Software Development Engineer I" },
    ],
  );
});
