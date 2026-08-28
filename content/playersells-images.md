# PlayerSells, image inventory

> This is a shot list, not a record of shipped files. Nothing has been captured yet.
> Every page below is public and needs no login. Capture them from
> `https://playersells.com`, then process and place them the way the CRMSolid set was.

**Ground rules, same as the CRMSolid set:**

- Every shot must be opened and looked at before it is copied into `public/projects/playersells/`.
- Nothing that shows a real buyer or seller: no listing detail with a seller name, no dashboard,
  no deal thread, no message, no wallet, no KYC, no admin panel. All of those are behind auth
  anyway, which is most of the protection.
- The rank and insights pages print real handles of real accounts. That is fine, they are public
  figures' public follower counts, and the site already publishes them. Prefer large, obviously
  public accounts over small ones.
- No URL bar showing a `?u=` result for a private person's handle.
- Target: at most 1600px wide, flattened to RGB, 256 colour palette unless the image has gradients
  that band (the rank tier chips and the insights bars do band, so those stay true colour).
- The site is **dark theme only**. Do not try to shoot a light variant.

---

## Priority set, in the order the page needs them

### 1. `rank-result.png` — the money shot

- **URL:** `https://playersells.com/tools/twitter-follower-rank?u=levelsio`
  (or any large, clearly public handle; `?n=25000` also works and shows the typed-number path).
- **Shows:** The H1, the lookup form, and the result card: the percentile sentence
  ("Larger than N% of the 18.5M accounts we index"), the tier chip, and the estimated position.
- **Why it matters:** This is the single image that explains the whole rank engine in one glance.
  It shows a percentile, a denominator, and an honesty label at the same time.
- **alt:** "PlayerSells X follower rank tool showing an account's percentile against 18.5 million
  indexed X accounts, with its tier and estimated position."
- **caption:** "One handle, one indexed lookup, and a percentile read off a 101-point ladder that
  was measured offline. The page does not run the percentile query."
- **Placement:** Section 1 hero, or the top of the rank deep dive.

### 2. `rank-distribution.png` — the part people actually came for

- **URL:** same page, scrolled to **The X follower distribution** table.
- **Shows:** The seven-row breakpoint table (p10 through p99), and directly under it the
  provenance line: sample size, catalog size, measurement date.
- **Why it matters:** It is the proof that the numbers have a denominator and a date. This is the
  section that renders with no database call at all.
- **alt:** "Distribution table showing X follower counts at the 10th through 99th percentile, with
  the sample size and measurement date printed underneath."
- **caption:** "The distribution table renders on a cold container, during a build, and through a
  database outage. It is checked into the repository with the date it was measured."
- **Placement:** Rank deep dive, immediately after the ladder explanation.

### 3. `rank-tiktok-caveat.png` — the honesty shot

- **URL:** `https://playersells.com/tools/tiktok-follower-rank`
- **Shows:** The intro paragraph, which opens with the caveat that the TikTok catalog was seeded
  from large creators and is not a platform-wide percentile.
- **Why it matters:** This is the best single illustration of the `framing: "population" | "tracked"`
  decision, and it is the kind of thing nobody ships unless they thought about it.
- **alt:** "The TikTok follower rank page, whose introduction states that the catalog is seeded
  toward large creators and should be read as a benchmark rather than a platform percentile."
- **caption:** "Two of the five catalogs cannot honestly be phrased as a platform percentile, so
  they are not. The wording is a field on the platform record, not a copy decision."
- **Placement:** Rank deep dive, in the framing subsection. Crop tight to the paragraph.

### 4. `tools-hub.png` — scale in one frame

- **URL:** `https://playersells.com/tools`
- **Shows:** The grid of tool cards. Twenty-five tools plus the 2FA generator.
- **Why it matters:** It is the "this is larger than it sounds" image.
- **alt:** "The PlayerSells free tools hub, a grid of twenty-five analysis tools across X, TikTok,
  Instagram, YouTube, Telegram and Bluesky."
- **caption:** "Twenty-five tools, five data sources, one gate. Every one of them passes through
  the same `toolGuard` before it is allowed to spend anything."
- **Placement:** Section on the shared tool layer. Shoot the full grid, then also keep a tight
  crop of four or five cards for a smaller inline placement.

### 5. `insights-hub.png`

- **URL:** `https://playersells.com/insights`
- **Shows:** The insights hub with its topic pages and the freshness / coverage line.
- **alt:** "The PlayerSells X insights hub listing its published studies, with the measurement
  window and coverage counts."
- **caption:** "Aggregate studies built from the post catalog. The window and the coverage count
  are printed on the page, because a benchmark with no denominator is a claim, not a measurement."
- **Placement:** Top of the insights deep dive.

### 6. `insights-benchmark.png`

- **URL:** `https://playersells.com/insights/engagement-rate-benchmarks`
- **Shows:** The benchmark distribution bars / peer-group table.
- **Why it matters:** This is the visual counterpart to the rank ladder: same idea (a distribution
  with a stated denominator), different subject.
- **alt:** "Engagement rate benchmark page showing the distribution of engagement rates by
  follower-count peer group."
- **caption:** "Same discipline as the rank ladder: a distribution, a peer group, a window, and a
  date, all on the page."
- **Placement:** Insights deep dive.

### 7. `overlap-result.png`

- **URL:** `https://playersells.com/tools/twitter-audience-overlap` with two large public handles
  filled in.
- **Shows:** The two account cards, the shared-follower count, and, critically, the wording that
  says the number is measured against the indexed sets rather than the full follower counts.
- **alt:** "Audience overlap tool comparing two X accounts, showing shared followers counted
  against the indexed portion of each audience."
- **caption:** "The overlap is reported against what the follow graph actually holds, never against
  the public follower counts. Dividing by the public number would be wrong by three orders of
  magnitude and would look entirely reasonable."
- **Placement:** Follow-graph subsection.

### 8. `report-card.png` — the OG image, not a screenshot

- **URL:** `https://playersells.com/api/og/report/<handle>` for a handle that already has a stored
  report. This returns a 1200x630 PNG directly, so it needs no browser capture and no cropping.
- **Shows:** The generated share card: verdict, handle, and the numbers behind the verdict.
- **Why it matters:** The article argues that for a link whose distribution model is being pasted
  into a group chat, the card *is* the product. This image is that argument.
- **alt:** "The generated Open Graph share card for an account trust report, showing the verdict
  and the numbers that support it."
- **caption:** "Generated per report, at a fixed address, with no network call and no avatar fetch.
  For a link that travels by being pasted into a Telegram group, this card is the whole message."
- **Placement:** Shared-layer section, next to the OG discussion.
- **Note:** If no stored report exists for a handle you are willing to publish, skip this rather
  than generating one about a private person.

---

## Optional, if the page has room

### `sitemap-index.png`

- **URL:** `https://playersells.com/sitemap.xml`
- **Shows:** The ten child sitemaps, split by platform.
- **caption:** "Ten child sitemaps. Two of them carry a real `lastmod`; the other eight are honest
  about not knowing, which is the point."
- **Note:** Raw XML in a browser is an ugly screenshot. Only worth it if the page has a slot for a
  small monospace thumbnail. A code block in the article is probably better.

### `insights-data-json.png`

- **URL:** `https://playersells.com/insights/data.json`
- **Shows:** The machine-readable dataset endpoint.
- **caption:** "The dataset is published as JSON under CC BY 4.0 with Dataset markup on the pages
  that use it."
- **Note:** Same caveat as above. A short excerpt in a code block may serve better than a shot.

### `rank-miss.png`

- **URL:** `https://playersells.com/tools/twitter-follower-rank?u=<a handle not in the index>`
- **Shows:** The "not in our index" notice, which explains what a miss means and offers the manual
  path instead of an error.
- **caption:** "A miss is a miss. The page says so, explains why it does not mean anything is wrong
  with the account, and offers the manual path that gives the identical percentile."
- **Why it might be worth it:** It is a small, concrete example of the error-copy discipline the
  article spends a section on. Use a nonsense handle you invent, never a real person's.

---

## Explicitly do not shoot

| Surface | Why |
|---|---|
| `/dashboard/*` | Real user data. Behind auth. |
| `/admin/*` | Admin console, moderation queues, API keys page. |
| Any listing detail page `/marketplace/<id>` | Shows a real seller's account and asking price. |
| Any `/report/<handle>` page for a small or private account | It is a verdict about a real person's account. Use the OG endpoint for a large public handle instead, or skip. |
| `/users/<username>` | Member profiles. |
| Anything with a `?d=` share payload | The encoded blob contains a real result for a real handle. |
| Terminal windows, `.env`, deploy logs, `docker compose` output | The deploy logs and env carry the production host address and secret names. Nothing from the server side goes on the page. |

---

## Processing note

The rank tier chips (`text-sky-400`, `text-emerald-400`, `text-violet-400`, `text-amber-400` on
translucent backgrounds) and the insights distribution bars both use low-alpha fills over a dark
background. 256 colour quantization bands those visibly. Keep 1, 2, 3, 6 and 7 as true colour PNG
and run a lossless optimize instead; 4 and 5 quantize fine.
