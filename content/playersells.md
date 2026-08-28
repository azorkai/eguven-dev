# PlayerSells

> Source-of-truth content for the PlayerSells project page.
> Language: English. A Turkish translation is a separate pass.
> Every number here was measured on the repository, read out of a production
> deploy log, or quoted from a code comment that states when and where it was
> measured. Where a figure comes from a comment rather than from something I ran
> myself, the text says so.
> The repository is private, so this page is the evidence.

---

## 1. Summary

**slug:** `playersells`
**role:** Sole developer. Crawlers, database, application, deploy, on call.
**status:** In production since March 2026. Live at playersells.com.
**one-line hook:** A marketplace that grew a data layer: 25.3 million indexed
social accounts across five networks, a 79.8 million edge follow graph, and a
statistics engine that publishes effect sizes with confidence intervals and a
multiple-comparison correction.

**Intro paragraph:**

PlayerSells is an escrow marketplace for buying and selling social accounts and
promotion services. The marketplace itself is ordinary software: listings, deals,
a state machine, a wallet, disputes. The interesting part is what got built
underneath it to answer one question a buyer always asks and nobody could answer
honestly: is this account actually worth anything?

Answering that needed data nobody sells. So the project grew a crawler stack, a
25 million row account catalog, a follow graph, a post-level intelligence layer,
and three public products on top: 25 free tools, five follower-rank pages, and a
set of published studies about what actually moves engagement on X. This page is
about those three.

The rank pages are the clearest illustration of the whole approach. They answer
"how many followers is a lot" with a real distribution over 18.5 million indexed
accounts, and they answer it in zero database queries.

### Stat cards (4 to 6 shown in the hero)

| value | label | note for the designer |
|---|---|---|
| `25.3M` | social accounts indexed across 5 networks | primary card |
| `12-44s → 0` | percentile query at page load, before and after. The "after" is zero queries, not a faster query | primary card, use an arrow glyph not a dash |
| `79.8M` | follow-graph edges | |
| `25` | free tools behind one gate | |
| `1,156` | pages statically generated per build, in 24 seconds | |
| `18,002` | lines of Python behind the crawler stack | |

---

## 2. The problem

Somebody has been offered an X account in a Telegram DM and is about to send a
stranger between $150 and $2,000. They have a screenshot of a follower count and
nothing else. The seller has the opposite problem: they own something real and
have no way to prove it.

Three concrete problems fall out of that.

**Nobody knows what a follower count means.** "42,000 followers" is a number with
no denominator. Is that big? The platforms do not publish the distribution, and
every third-party tool that claims to is either guessing or quietly reporting a
sample as though it were the population. Answering it properly needs a corpus,
and a corpus needs a crawler.

**The signals that matter are not on the profile.** Follower count is the one
number everybody looks at and close to the least informative one available. A
100,000-follower account pulling three likes a tweet is a completely different
asset from one pulling three thousand, and nothing on the profile page separates
them. That needs post-level data, which means reading timelines, which is
expensive.

**The data source is a shared, finite, bannable resource.** The X data path runs
on a pool of 35 throwaway logged-in accounts driving the unofficial GraphQL
endpoints. That same pool verifies handle ownership when a seller creates a
listing. Free public tools and revenue-critical seller onboarding drink from the
same well, and the well can be poisoned by one shell loop. This turned out to
shape more of the design than anything else in the system.

---

## 3. Architecture

### What it is

Two stacks on one Hetzner box, joined by a Docker network, with a hard read-only
boundary between them.

| Piece | Tech | What it is |
|---|---|---|
| **Engine stack** | Python, 14 containers, its own Postgres | The crawlers. One service per network plus a shared discovery and rollup layer. Writes the catalog. |
| **App** | Next.js 16 App Router, React, TypeScript | The marketplace and every public page. Reads the catalog. Cannot write to it. |
| **Marketplace DB** | Postgres 17 + PostgREST 12.2.3 | Users, listings, deals, wallet. Self-hosted since June 2026. |
| **Edge** | Caddy 2 | TLS, the `/rest` route to PostgREST, and client-IP normalisation. |

### Why the split is a database role and not a service boundary

The app reaches the engine's Postgres over a shared Docker network as
`directory_reader`, a role with `SELECT` and nothing else. That is the whole
isolation mechanism. There is no API between the two stacks, no message queue,
no contract to version.

That sounds lazy until you look at what it buys. The public directory pages serve
on every request out of that connection. Whatever a future route handler does,
however badly, it cannot write to the catalog, because the database will not let
it. The admin console does need to write, for LinkedIn lead management, so it
gets a **second pool on a second role** (`linkedin_writer`, three verbs and one
column-level grant) rather than widening the first. The comment in
`directory-db.ts` is explicit that this is on purpose: the read path "must stay
incapable of writing no matter what a route handler does".

The second pool is deliberately small, `max: 3` against the read pool's `max: 8`,
and the reason is written down: "two runaway pools have already exhausted twice
on this box".

### Why a crawler stack at all, rather than an API

Because the API does not exist at a price this can pay. The paid vendor
(twitterapi.io) bills per call and its balance ran out on 2026-08-11, which took
nine tools down. The official YouTube Data API is available but its terms cap
storage at 30 days and forbid redistribution, which is why YouTube channels are
the one platform in the catalog with **no public profile pages**, only aggregate
statistics. Everything else runs on `twscrape` against a pool of throwaway
accounts, which costs nothing in money and a great deal in care.

### Runtime shape

- **Engine:** 41 Python files, 18,002 lines, plus 13 SQL schema files, 2,802
  lines. 14 compose services: one crawler per network (X, X-free, X-tweets,
  Telegram web, Telegram bot, Bluesky, YouTube, TikTok, TikTok discovery,
  LinkedIn), a shared discovery engine, the `xlookup` read service, an IPv6
  proxy, and Postgres.
- **App:** 1,196 TypeScript and TSX files, 314,842 lines, mock-data fixtures
  excluded. 245 route handlers, 244 page files. The production build emits 617
  distinct routes and statically generates 1,156 pages.
- **Catalog:** `xdir_accounts` 18.5M rows, `bdir_accounts` 3.8M, `tgdir_chats`
  3.0M, `ytdir_channels` 35.1k, `ttdir_accounts` 17.5k. Plus `xedges`, the
  follow graph, at 79.8M rows, and `scraper.x_tweets`, the post stream, on a
  90-day retention window.
- **Localisation:** four locales built (`en`, `es`, `tr`, `pt-br`), one live.
  English is served unprefixed so the already-indexed URLs never move.
- **Sitemap:** one index over ten children, split by platform.

### Diagram description (for the SVG)

Four bands, top to bottom, with one thick horizontal line between bands 2 and 3
that is the point of the whole picture.

**Band 1, top, "Sources".** Six small boxes in a row:
`X (twscrape pool, 35 accounts)`, `Telegram (web + bot)`, `Bluesky (firehose)`,
`TikTok`, `YouTube Data API`, `LinkedIn`. Under the X box, a small red subtitle:
`shared with seller verification`.

**Band 2, "Engine stack (Python, 14 containers)".** A wide container holding four
inner boxes: `crawlers, one per network`, `discovery (forwards, mentions, follow
graph)`, `rollups (SQL aggregates)`, `xlookup (read service, HTTP)`.
Arrows come down into it from every source box.

**The boundary line.** A thick horizontal rule between bands 2 and 3, labelled on
the line itself: `directory_reader, SELECT only`. Every arrow crossing it points
downward except one, which is explained below.

**Band 3, "Engine Postgres".** A wide box holding stacked table labels with their
row counts: `xdir_accounts 18.5M`, `xedges 79.8M`, `xdir_account_engagement`,
`xdir_viral_patterns`, `xdir_research_findings`, `bdir_accounts 3.8M`,
`tgdir_chats 3.0M`, `ytdir_channels 35.1K`, `ttdir_accounts 17.5K`,
`scraper.x_tweets (90d)`. Band 2 writes into it with a thick arrow labelled
`write`.

**Band 4, "Next.js app".** A wide container with three inner boxes:
`Rank pages (5)`, `Insights (9 pages + data.json)`, `Free tools (25)`.
To its right, two separate boxes outside the container: `Marketplace Postgres 17`
and `PostgREST`, with `Caddy 2` above them at the page edge.

**Arrows to draw:**
- `Rank pages` reaching UP through the boundary into `xdir_accounts`, thin,
  labelled `one indexed handle lookup`. Draw it thin on purpose.
- A separate arrow from `Rank pages` going sideways to a small box labelled
  `BAKED ladders (checked into the repo)`, thick, labelled `101 breakpoints,
  0 queries`. This is the contrast the diagram exists to show: the thick arrow
  does not cross the boundary.
- `Insights` up into `xdir_viral_patterns` and `xdir_account_engagement`, solid,
  labelled `aggregates only, never the raw stream`.
- `Free tools` sideways into a box `tool-guard`, then from `tool-guard` up to
  `xlookup`, labelled `9 gates, then the pool`.
- A dashed arrow from `tool-guard` to `xlookup`'s `/health`, labelled
  `pressure probe, fails closed`.
- One upward arrow crossing the boundary from the app: `Admin console` to
  `lidir_*`, dashed, thin, labelled `linkedin_writer, 3 verbs`. Label it as the
  single exception.
- A separate arrow from `xlookup` to `Seller listing flow`, drawn in the same red
  as the source subtitle, labelled `handle ownership check`. This is why the
  guard exists.

Two colours plus grey. If a reader takes one thing away it should be that the
public pages sit under a read-only boundary, and that the busiest page on the
site does not cross it at all.

---

## 4. Technical deep dives

### 4.1 The rank engine: a percentile with no query behind it

**The need.** Five pages, one per network, that answer "how many followers is a
lot". The honest version of that answer is a percentile against a real corpus.

**Why the obvious build does not work.** The query is a 101-point
`percentile_disc` over a sample of an 18.5 million row table. Measured on
production it runs in **12 to 44 seconds**. The app's directory pool sets
`statement_timeout: 15000`. So the query does not merely make the page slow, it
cannot complete inside the connection that would have to run it. Putting a cache
in front only moves the 44 seconds onto whichever visitor arrives after the TTL
expires.

**The fix.** The ladders are computed out of band and **checked into the source
file**. `scripts/refresh-rank-ladders.mjs` runs on the host that can reach the
engine database, measures all five, and rewrites the `BAKED` block in
`src/lib/audience-rank.ts` along with the measurement date. The pages then render
the distribution table with zero database access, and print the date next to it.

The consequences are worth listing, because they are why this is the right shape
and not a shortcut:

- A rank page with no handle in the URL touches the database **zero times** and
  ships **zero JavaScript**. It absorbs any amount of search traffic at no
  marginal cost.
- It renders correctly on a cold container, during a Docker build (where the
  engine database is unreachable by design), and through a database outage.
- It never shows a percentile it does not have.

The refresh script is the only place the heavy query lives, and it validates
before it writes: exactly 101 breakpoints, all finite and non-negative,
**monotonic non-decreasing**, and at least 5,000 sampled rows. The monotonicity
check earns its place. A ladder that decreases anywhere means the query is wrong,
and publishing it would make the binary search in `percentileForValue` return
nonsense for a whole band of the curve rather than fail visibly.

**Sampling.** X is sampled at `tablesample system(0.25)` for 45,308 rows, Bluesky
at 3% for 115,643, Telegram at 4% for 119,346. TikTok and YouTube are small
enough to measure whole. The fractions were chosen so every one of the 101
breakpoints has enough rows behind it: under roughly 10,000 sampled rows the top
percentiles get noisy enough to move between runs, which would show up publicly
as the numbers drifting for no reason. Corpus size comes from `pg_stat_user_tables.n_live_tup`,
the planner's live estimate, because it is instant and close enough for a
headline count.

**Two details in the percentile function that are not obvious.**

Ladders have long runs of identical values at the bottom. The Telegram ladder
holds the value `1` from p4 through p18. A naive `upper_bound` search gives a
channel with one subscriber the percentile of the **last** tied breakpoint, p18,
rather than the first. So the search seeks backwards over equal values before
interpolating, and a value at or below p0 returns 0 outright instead of
interpolating into the tie.

The estimated position on the page ("roughly Nth out of 18.5 million") is derived
from the percentile and the corpus size, not counted. An exact
`count(*) where followers_count > n` over
18.5M rows does not finish inside 30 seconds. Every surface that prints the
number labels it as an estimate, in words, next to the figure, and it returns
`null` below p1 because at 1% granularity a number down there would be invented
rather than estimated.

**The framing decision, which is the part I would defend hardest.** The five
catalogs are not the same kind of thing. X, Bluesky and Telegram were crawled by
following links and forwards and carry a genuine long tail: the median indexed X
account has **550 followers**, Bluesky **133**, Telegram **48**. Those are fair
population statements. The TikTok and YouTube catalogs were seeded from creators
other creators reference, so their medians are **10,200** and **62,000**, and
those numbers are an artifact of the seeding, not of the platform.

Presenting the second pair as a platform-wide percentile would tell every small
creator they are in the bottom 1%. That is confidently wrong output, which is
worse than no tool at all. So `framing` is a field on the platform record with
two values, `"population"` and `"tracked"`, and it changes the verb in the
generated sentence: "the 18.5M accounts we **index**" against "the 17.5K creators
we **track**". The TikTok page opens by telling you the caveat before it tells
you anything else.

**What happens on a miss.** Nothing. A handle the catalog has never seen is
answered as "not in our index", with copy explaining that this usually means the
account is new, private, or spelled differently, and an invitation to type the
follower count instead, which gives the identical percentile. It is explicitly
**not** fetched live, and the comment says why: pulling an unknown handle would
put a public, ungated page in front of the same scraper pool that seller
verification depends on.

Five pages, one shared server component, one copy record per platform. A new
network is a copy entry plus a three-line page file.

### 4.2 The insight engine: paired effects, and the estimator that could not find anything

`/insights` publishes studies about what actually moves engagement on X:
engagement-rate benchmarks, best time and day to post, links and reach, images
versus text, tweet length, hashtags, plus a changelog of what changed since last
run. Nine pages, a per-account report template, and a machine-readable mirror at
`/insights/data.json` under CC BY 4.0.

**The input.** The `xtweets` engine reads timelines through `twscrape` and stores
one row per post: the six counters (likes, retweets, replies, quotes, bookmarks,
views) plus content features (character length, media counts, link presence,
hashtag count, thread position, UTC hour, day of week, client). Raw rows are kept
90 days and the tweet text is nulled at 30.

The site never reads that raw stream. Everything on the pages comes from
aggregates, and the reason is stated in the service: the raw table is on a
sliding retention window, so a page built on it would quietly lose content as the
window moved.

**The first estimator did not work, and it took real data to see it.** The
original version computed, for each tweet, `viral_multiple`: engagement divided by
its own author's median engagement. Then it took a median of those per bucket.

That cannot work, and the reason is one line: an account's own median multiple is
1.0 by definition. Pooling ratios that are each centred on 1.0 and re-taking a
median gives you back 1.0 whatever the truth is. In production, **72 of the 138
rows it published sat at exactly 1.000**, and the largest effect it could find in
the entire catalog was -17%. The tool ran, produced output, and was incapable of
detecting anything.

**What replaced it.** A paired within-account design, in three steps:

1. For each account, take the mean of `ln(1 + counter)` over its tweets **in** the
   bucket, minus the same mean over its tweets **outside** it. Logs because
   engagement is heavy-tailed by orders of magnitude. Means rather than medians,
   deliberately: with means the complement follows from a sum and a count
   (`sum_all - sum_in`) and needs no self-join, which is what keeps the whole
   pass at about 20 seconds over 240,000 tweets.
2. Across accounts, take the **median** of those differences. That is a
   Hodges-Lehmann style location estimate, so one freak account cannot move it.
   `exp()` of it is the multiple; as a percentage it is the published lift.
3. A **distribution-free confidence interval** from the order statistics of the
   same differences, at positions `k` and `n+1-k` with
   `k = floor(n/2 - 0.98*sqrt(n))`. No distribution is assumed anywhere.

On the same data the old version called flat, this reports media at **+53%
engagement, interval [+45, +61]**, and links at **-52%, [-54, -49]**.

The publication rule is that `accounts_sampled`, not `sample_size`, is what makes
a row publishable. Tweets inside one account are not independent observations.
Accounts are. A row needs at least 200 tweets and at least 30 accounts before it
is written at all.

**Then a second correctness problem showed up: too many tests.** The estimator
produces roughly 2,648 buckets. Testing that many at the 95% level yields around
130 rows that clear an uncorrected interval by chance. Measured against live
data, **137 of the 904 rows flagged significant did not survive correction**, and
they were all small per-decile hour and day cells sitting a hair inside the line,
being rendered with exactly the same confidence as media at +53%.

So a correction pass was added: an exact two-sided **sign test** on the
accounts-up / accounts-down counts, computed with integer binomials in log space,
then **Benjamini-Hochberg** step-up with the family scoped per metric. Nothing
publishes unless `is_significant_bh` is true and the correction is newer than the
computation that produced it.

The choice of test is not arbitrary and the reasoning is worth quoting, because
it is the tidiest thing in the codebase: the sign test "inverts the interval the
page already publishes", since `k = floor(n/2 - 0.98*sqrt(n))` is exactly the
sign-test interval with the binomial quantile taken from its normal approximation
(z = 1.96, and 1.96/2 = 0.98). The p-value and the interval are two readings of
one test, so they cannot contradict each other on the page. Checked against 2,648
live rows they agreed on 2,606, and all 42 disagreements were the interval being
slightly conservative between p = 0.043 and p = 0.049.

**Is there AI in this?** No. Every number on `/insights` is SQL and arithmetic.
The engine says so at the top of the research module, and gives the operational
reason as well as the principled one: the production Anthropic key has no credit,
so "anything whose correctness depended on a model call would be dead on
arrival".

There is exactly one model call in the whole subsystem and it is worth describing
because of how tightly it is fenced. An optional pass rewrites **changelog
sentences** into less mechanical prose. It is off by default behind an env flag,
capped at 25 events per run with a 20 second timeout, and the result is rejected
unless it still contains the same percentage figure as the sentence it was given.
The API contract restates it in public: `detail_source` is `template` or `llm`,
and "the template is authoritative; nothing about whether an event exists, or
what its numbers are, depends on a model call". The prose is decoration. The
arithmetic is the product.

**Caching.** Every read goes through `unstable_cache` on a one-hour TTL under a
shared tag, and the research module matches that TTL on purpose so a page reading
both cannot show two different vintages of the same pass. Nine of the ten routes
are `force-dynamic` rather than ISR, and the reason is specific: the engine
database is unreachable from the Docker build, so an ISR window would prerender
against a failed read and ship a shell reading "not measurable yet" to the first
hour of visitors after every deploy, on the one page whose entire value is the
data. The database load is identical either way, because of the one-hour cache
underneath. Only the staleness of the HTML differs.

### 4.3 One gate for twenty-five tools

`toolGuard` is a single function every public tool route calls before it does any
work. It is 1,200 lines and it is the most defended file in the project.

**Why it exists.** The X tools used to read through twitterapi.io, which was
self-limiting in the only way that reliably works: abuse cost real money and the
bill made it visible. They now read through `xlookup`, an in-house twscrape
service, and that changes the threat model completely:

- The account pool is **shared** with seller onboarding. A visitor draining it
  does not break a free tool, it breaks the ability to publish a listing.
- The pool is **finite and fragile**. Hammering X from those accounts gets them
  banned and re-provisioning is manual work nobody has queued.
- The tools are **public and unauthenticated**. One shell loop can spend the
  whole pool in a few minutes, and since nothing bills for it, nothing would say
  so.

The limit that used to be enforced by an invoice had to be enforced in code.

**Nine checks, in a deliberate order.** Input validation, email, per-IP burst,
global ceilings, per-IP daily, email daily, abuse shape, captcha, pool pressure.
The ordering is the design. Cheap local reasons to refuse run first; the only
network call (the pressure probe) runs last, after every cheap reason has been
exhausted.

**A written cost table instead of scattered limits.** Every tool declares
`poolReads`, the worst-case number of upstream reads one successful call fans out
to, counted from the service implementations rather than guessed. Tiers derive
from that: `none`, `cheap` (1 read), `standard` (3), `heavy` (4+ or a paged
walk), `external` (a vendor credit, zero pool reads). `shadowban-check` fans out
to five reads. The Account Trust Report, which runs valuation plus follower audit
plus shadowban check in one build, costs twelve, and is the most expensive single
request on the site.

The comment on the table explains why it is one table: "limits scattered across
eighteen route files is how they drift apart, and how the expensive ones end up
carrying the cheap ones' allowance".

**Global ceilings, because per-IP limits are blind.** Per-IP limits cannot see a
scrape spread across a thousand addresses. So there are three counters that do
not care how traffic is distributed: 30 pool-backed calls per minute, 10 heavy
calls per minute, 300 pool-backed calls per hour. The sizing arithmetic is
written out: `xlookup` runs four concurrent workers and a heavy call is about
four upstream reads, so 30 a minute is up to 90 reads a minute as a burst, and
300 an hour is roughly 900 reads an hour, which a handful of twscrape accounts
can serve indefinitely without collecting bans.

The per-IP numbers are deliberately looser than the pool arithmetic alone would
justify, and the reason is stated: an IP is not a person. Mobile carriers put
thousands of subscribers behind one CGNAT address, and a cap tuned to one user
would lock out a whole network. The per-IP limits exist to stop one obvious
offender. The global ceiling is the hard bound.

**Refunds, which turn out to be a security property.** Every consuming check
pushes its reversal onto an undo stack, and any later refusal runs all of them.
Without that, the global ceiling is itself a denial-of-service vector: an
attacker who gets refused would still burn the ceiling for everybody else, so
enough refusals alone would lock out every legitimate visitor. The refund loop
swallows its own exceptions, because a failed refund must never turn a refusal
into a 500.

**A circuit breaker with two independent inputs.** The first is `xlookup`'s own
`/health`. The second is what the routes have actually been seeing: a bounded
ring of the last 64 infrastructure failures over a two-minute window, three of
which is `elevated` and eight `critical`. The comment on the second one is the
reason it exists: "`/health` is xlookup's opinion of itself, and an opinion can
be wrong or stale. The requests that actually failed are evidence."

Only infrastructure failures feed the breaker. A private account or a handle with
no tweets says nothing about the pool, and counting those would have the tools
switch themselves off over perfectly normal user input. Equally, the six
ScrapeCreators calculators and the two Claude-backed tools do **not** feed it,
because their budgets fail on their own schedule and a dead third party
throttling the X tools would be the mirror image of the bug the whole gate exists
to prevent: one budget's state being reported as another's.

**It fails closed, and there is a reason.** If the health probe times out, errors,
or cannot be reached, that is graded as pressure, never as calm. The comment
names the incident: an unreachable or silent health endpoint "is exactly the
state the paid API sat in for eight days while the guard waved traffic through".

The health parser is deliberately paranoid in one specific way. It accepts
several spellings of the same signal (`breaker`, `breaker_open`, `circuit`,
`state`, `degraded`, and a pressure value that may be a label, a 0..1 saturation
or a 0..100 percentage) because the breaker being added on the xlookup side might
name its signal differently, and "a guard that only understood one spelling would
read 'no pressure' off a payload that was screaming". An unrecognisable payload is
never read as calm.

**Tiers yield in order.** `heavy` stops being served at `elevated`, `standard` at
`critical`, `cheap` only at `down`. Tools that do not touch the pool are never
blocked by its state at all. And a caller who passed the captcha gate without
actually solving anything yields first, at any pressure, whatever tier it is in.

**One measurement that changed the product.** The email wall on the free tools was
measured before it was touched: **118 net-new addresses in 158 days**, 0.75 a day,
against total tool usage of about 5 a day, with six tools never used at all. It
was not a lead source, it was a bounce. So it came off the three tools that carry
74% of usage. The email field stays and a volunteered address is still captured;
what went away is the refusal when one is absent. The note is careful that
nothing about abuse protection changed with it, because `requireEmail` only ever
gated a limit keyed on a string the caller types in, which is not a limit.

Removing it exposed a small bug that is a good illustration of the class: with the
email gate off there is no email budget to report, and every tool page disables
its submit button on `remaining === 0`. Reporting the absent budget anyway would
have replaced the wall with a dead button. The gate reports the per-IP daily
allowance instead, which is the limit actually binding the visitor.

### 4.4 The error contract: infrastructure before content

`classifyToolError` maps a thrown error to a status and a client-facing message.
It is 156 lines and the ordering of its five rules is the entire design.

The rules run: not-configured, exhausted or throttled upstream, upstream never
answered, then account-level errors (404), then insufficient-data errors (422).
Everything unrecognised stays a generic 500 with a generic message, so internal
failure detail never reaches a browser.

The reason infrastructure signals are ranked above content signals is a specific
production incident. twitterapi.io answered an exhausted balance with the literal
string **"Credits is not enough"**, which matches the insufficient-activity rule
on the substring "not enough". Ranked the other way round, our own lapsed invoice
was reported to the visitor as "that account has too little activity": a
confident wrong statement about **their** data, which they would then act on, with
the raw upstream body echoed into their browser alongside it.

The free twscrape pool has the same failure shape (`pool_unavailable`,
`rate limit`, `no accounts`), so the ordering matters more now, not less. The
rule the file states is two clauses: infrastructure first, always, and never echo
the upstream's own words.

The classifier also returns a `kind` field, `"infrastructure" | "input" |
"unknown"`, which is what feeds the guard's local breaker in 4.3. That is the
join between the two files: the same classification that decides what to tell the
visitor decides whether the system should start protecting itself.

There is a note in the file about why it was built at all, and it is the honest
version: mapping every non-configuration error to "An unexpected error occurred"
meant a private, suspended or missing account read as a broken tool, and users
reported working tools as broken.

### 4.5 The follow graph, and saying what you actually measured

The audience overlap tool compares two X accounts and reports who follows both.
The graph is 79.8 million edges, collected two ways: by reading the following
list of every crawled account, and by reading a capped sample of each crawled
account's followers.

Neither gives a complete follower list for anybody. The example in the code is
the useful one: **@naval has 3.9 million followers and the graph holds 2,666 of
them.**

So the tool does not measure "the overlap between two audiences". It measures the
overlap between the indexed parts of two audiences, and because of how those
parts were collected they skew toward accounts substantial enough to have been
crawled themselves. That turns out to be the more useful question ("which notable
accounts follow both of these" beats "how many anonymous accounts do they share"
for every real use), but it has to be **said on the page, next to the number**.

The arithmetic consequence is the part that would be easy to get wrong. The rate
is expressed against the indexed sets, never against the public follower counts.
Dividing a sampled intersection by a full follower count produces a number wrong
by three orders of magnitude that looks entirely reasonable.

**The cost model.** `idx_xedges_dst` is a btree on `(dst_user_id, edge_type)` over
79.8M rows, so "who follows this account" is an index scan of a few thousand rows
per side. Measured on production: **5.7 seconds cold, 85 milliseconds warm**. The
cold number is disk, not planning; the index is large enough that its pages are
usually not resident. Hence a 24 hour cache, and a hard 25,000 edge scan cap so a
hub account cannot turn one page view into a sequential read.

Two small things in there that took thought. The cache key is the **sorted** pair,
because (a,b) and (b,a) are the same comparison and without the sort a shared link
and its mirror each pay the cold cost. And an account that exceeds the scan cap is
reported as `capped` rather than silently truncated, because a truncated
intersection is a smaller number that looks exactly like a real one.

Zero external calls. A handle the graph has never seen is answered as "not in the
index", for the same reason the rank tool answers a miss that way.

### 4.6 SEO as an engineering constraint

The public surface is the product's distribution channel, so several decisions
that look like marketing are actually constraints on the code.

**Result views are noindex.** A `?u=` or `?n=` URL on a rank page is one reading
of the same page. Letting Google index them would build thousands of
near-identical thin copies competing with the page that should rank. They stay
`follow`, and canonicalise back to the tool.

**One redirect, stated twice, in agreement.** `/tools/shadowban-checker` exists
only to point at `/tools/shadowban-check`. It is declared in `next.config.ts` as
`permanent: true` (a 308) and the page itself calls `permanentRedirect()`, which
is also 308. It used to call `redirect()`, which answers **307**, a temporary
redirect, which tells Google to keep the duplicate indexed and keep coming back
to it: the exact cannibalisation the stub was added to stop. The stub is also
excluded from the sitemap, and `scripts/validate-sitemap.mjs` reads that exclusion
from the same config file so a build cannot quietly add the route back.

**The sitemap index tells the truth about `lastmod`.** Ten child sitemaps, split
by platform (`core`, `listings`, `content`, `x`, `insights`, `reports`,
`telegram`, `tiktok`, `bluesky`, `youtube`). Only two of them carry a real
`lastmod`, and the reason the other eight do not is written in the registry: the
index previously stamped the request time on all of them, which tells a crawler
every sitemap on the site changed the moment it was fetched. A crawler that
concludes `lastmod` is meaningless here stops using it for scheduling on the
honest entries too. Chunks with no defensible timestamp are absent from the map
and fall back to now, which is at least not a claim about content.

**Four locales built, one live.** `BUILT_LOCALES` holds `en`, `es`, `tr`,
`pt-br`; `LIVE_LOCALES` holds only `en`. A locale is built first so its pages can
be reviewed on a real URL, and pages in a built-but-not-live locale are served
noindex so a half-translated tree cannot be discovered. The comment gives the
reason plainly: shipping unreviewed machine translation is what Google's scaled
content abuse policy targets, and a manual action would hit the whole site,
directories included. English stays unprefixed because relocating roughly 50,000
already-indexed URLs under a locale segment would reset every ranking the site
has.

**Open Graph cards as a delivery mechanism, not decoration.** For a trust report,
the distribution model is a person forwarding the link: a buyer sends it to the
seller, the seller pastes it into a group, somebody there posts it in another
one. Every hop renders the card and nothing else. The site previously shipped one
static card with `twitter:card: "summary"`, the small one, so a link to a verdict
about a specific account looked identical to a link to the homepage.

The card is now generated per report from a shared builder. It runs on the
`nodejs` runtime rather than edge, because the Inter faces are read off disk and
real type is most of the difference between a card that looks designed and one
that looks generated. It makes no network call and fetches no avatar: a card that
has to reach an external host before it renders is a card that intermittently
times out in the one place where a timeout makes the link look broken.

**A note against the site's own interest.** The SEO module carries a paragraph
saying not to expect the JSON-LD to move AI citations, and cites the one
matched-control experiment on the question it could find (Ahrefs, May 2026: 1,885
pages that added JSON-LD against 4,000 matched controls, measured at -4.6% on AI
Overviews and no effect on AI Mode or ChatGPT). The `llms.txt` route
opens with the same kind of honesty: no major provider has committed to fetching
it, there is no public evidence it is a ranking input, and "the file is cheap,
standardised, and might be read, which is the entire case for it". The thing
measured to actually work is server-rendered prose that survives being quoted
with no surrounding context, which is why the trust report's editorial rule is
that every finding states a measurement with its number, its date and its
denominator.

---

## 5. What did not work

This is the honest section. Every item is something that shipped, failed in
production or in a measured test, and was replaced.

**Pooling ratios to find an effect.** Covered in 4.2 and still the worst one. The
first pattern estimator divided each tweet's engagement by its own author's
median, then took a median per bucket. An account's own median multiple is 1.0 by
definition, so the answer was 1.0 whatever the data said. 72 of 138 published
rows sat at exactly 1.000. The tool produced confident output and was
mathematically incapable of finding anything. The rewrite finds media at +53%
with a [+45, +61] interval on the same data.

**Publishing uncorrected significance.** Testing 2,648 buckets at 95% produces
about 130 false positives by chance. 137 of 904 flagged rows did not survive
Benjamini-Hochberg, and they were being rendered with the same visual confidence
as the real effects.

**A filter that made the site read as though nothing works.** A minimum-lift
filter dropped every dimension whose honest answer was "no measurable
difference". What survived were the negatives, so the page showed four cards,
three of them negative, and read as if posting on X were hopeless. A null result
is a result: "no measurable difference across 158K posts" is a finding and now
gets said out loud.

**Means instead of medians in the benchmark bands.** A 999-follower account with
three sampled posts and a 455,506 median view count produced a band "average"
engagement rate of **288 percent**. Not a rate at all, an artifact of dividing two
small noisy numbers. Medians everywhere now, in SQL.

**Computing percentiles in JavaScript over a fetched top-N.** The benchmark page
used to fetch the top 5,000 accounts and compute percentiles over them. The only
available proof that 5,000 was the whole population was asking for more rows than
existed and getting fewer back. That proof expires the moment the cohort grows
past the limit, at which point the page would have silently dropped every
percentile it exists to publish, exactly as the cohort was being widened to make
those percentiles worth reading. It is a SQL aggregate now, and an aggregate
cannot be truncated.

**A missing cast that killed every rollup silently.** `percentile_cont` returns
`double precision`, and `numeric / double precision` is `double precision`, for
which Postgres has no `round(x, int)` signature. Three expressions divided by an
uncast percentile. Each one made its whole statement fail to **prepare**, so the
engagement aggregate, the authenticity pass and the pattern analysis had never
once completed. It read as correct because the casts on the other side of the
same divisions were already there.

**Running four post-scan writes as a straight line.** The first of them contends
with every other engine writing `xdir_accounts`. It lost a lock race, raised, and
took the three after it down with it. The scraper worked perfectly for two days
and put **114,000 tweets** in the raw table; not one aggregate was ever built on
top of them. `/insights` read zero while the data sat right there. The rule that
came out of it: the stamp is bookkeeping, the aggregates are the product, and
losing the first must never cost the second.

**A rollup that held locks for 22 hours.** `citation_score` and `out_degree` were
rebuilt as two UPDATEs joined against a full `GROUP BY` of the follow graph,
inside the daily rollup's transaction. The planner estimated that join at 193
million rows against an actual 756,000.

**Answering 404 when the database is unreachable.** The best failure in the repo
and the most expensive. `withRetries(fn, [])` returned an empty array when a query
kept failing, `rows[0]` came out `undefined`, and the page called `notFound()`.
So "the query failed" and "there is no such account" produced the same 404. On
2026-08-15 a crawler worker left an UPDATE holding a row lock for 26 hours,
inserts queued behind it one connection at a time until `max_connections` was
exhausted, and for the next **fifteen hours every profile in all five directories
answered 404** to users and to Googlebot. The accounts existed the whole time and
the rows were intact; the site simply could not ask.

404 is the one status Google reads as "drop this URL from the index". A 500 is
read as "come back later" and costs a crawl retry. When you cannot find out
whether a page exists, claiming it does not is the most expensive possible guess.
The fix was a second helper, `withRetriesOrThrow`, used for the one read a page's
existence hinges on.

**Monitoring that could not tell "zero" from "broken".** A timed-out count and a
dead engine both read as 0. On 2026-08-25 and again on 2026-08-26 the engines
dashboard called six healthy engines dead while they were writing tens of
thousands of rows an hour. The mechanism underneath was worse than the display: it
ran `Promise.all` over all seven engines, four queries each, 28 queries against an
8-connection pool with a 10 second connect timeout. One slow table held its slots
for the full 15 second statement timeout and every other engine died on
**connect**, not on its own query. The logs showed it exactly: one statement
timeout, twenty-four connect timeouts. Fixed with a concurrency of two,
`Promise.allSettled` per engine, and an explicit distinction in the model between
"failed" and "honestly zero".

**A guard that failed open when the money ran out.** twitterapi.io's balance ran
out on 2026-08-11 and nine X tools went dead. The guard waved traffic through for
**eight days** and told nobody. Everything about `tool-guard`'s fail-closed
posture comes from that, and the fix was not just the guard: `xlookup` was wrapped
in an adapter that returns twitterapi.io's exact response shapes so the nine tuned
service files were never touched. Rewriting them to a new shape is where the
regressions would have come from.

**Reporting an infrastructure failure as a fact about the user's account.**
Covered in 4.4. "Credits is not enough" matched an insufficient-activity rule.

**An email wall as a lead source.** 118 addresses in 158 days against 5 uses a
day. Removed from the three tools that carry 74% of usage.

**Chasing misspellings in an abuse filter.** Not one of the three subsystems this
page is about, but it is the clearest rework story in the repository and it took
six rounds. The off-platform message guard matched spellings exactly, so every new
misspelling was a fresh hole: a seller whose "we can deal on WhatsApp" was blocked
simply retyped it as "WasApp" and it sailed through with nothing firing at all.
One earlier iteration ran a fuzzy pass on the wrong side of the normalisation and
produced **264 false-positive blocks across 19 users** in a week, because "seller"
and "excellent" are one edit from "zelle" and "message" is one from "imessage".
The seventh version inverted the approach: repair the input, do not extend the
rules. Verified by replaying production traffic: of 6,352 delivered messages 58
now block, all genuine attempts; of 515 past blocks only 10 now pass, all of them
the earlier false positives.

**An unbounded heap on a shared box.** On 2026-08-24 a Docker build ran with 2.8GB
free on a 7.5GB host shared with two Postgres instances and eight crawlers. The
TypeScript phase grew past it and the kernel's OOM killer chose **three Postgres
backends** rather than the build. The site went down for about a minute while the
process that caused it kept running. Capped at `--max-old-space-size=3072`, with
the reasoning in the Dockerfile: an unbounded heap turns "this build needs more
memory than we have" into a machine-wide event, a bounded one turns it into a
failed build, which is a problem you can read in a log and retry.

**Trusting `X-Forwarded-For` from the origin.** Caddy previously set it to
`{remote_host}`, the immediate peer, which is correct only while the origin is
reached directly. The moment the Cloudflare zone flips from DNS-only to proxied,
that line overwrites the real client IP with a Cloudflare edge address. Nine
places in the app read the client IP and two of them are security decisions: a
payment webhook that allowlists a single source address, and an IP-keyed admin
rate limit. The webhook would have started rejecting its own callbacks and
balances would quietly have stopped being credited. Replaced with `{client_ip}`,
which is correct in both modes, and the trusted-proxy list is pinned with the date
it was fetched.

**Success as a bug, twice.** After the directories shipped, the sitemap grew to
about 28,000 URLs and the article generator's prompt reached **1,053,556 tokens**
against a 1,000,000 limit, failing every run. Capped, and the prompt dropped to
about 8,200 tokens. A month later the X catalog reached about 14 million rows and
exact `count(*)` aggregates started taking 10 to 12 seconds even as index-only
scans, blowing the 15 second statement timeout, with six of them observed running
in parallel and saturating the engine disk. Replaced with `reltuples` estimates
and 1% block samples.

**A GDPR deletion that sent 424 emails and deleted nothing.**
`anonymize_user_account()` built an anonymous username of `'deleted_' + 32 hex`
= 40 characters, and the identity guard trigger enforces 3 to 30. Every call
aborted, the request stayed "approved", and the sweep retried it on every admin
page load because a badge poll hits the same endpoint every five minutes. The
detail that turned a silent failure into a storm: the email was sent **before**
the work.

**Deploying without committing.** The deploy is a tar-and-scp of the working
tree, not a git checkout, so it is entirely possible to ship code that exists
nowhere else. It has happened repeatedly, and the repository names the pattern
itself: one commit exists purely to "recover live xfree engine code into git"
from a running container image, because that image was the only copy. A
push-to-deploy workflow was added to fix it and did not stick. It remains the
clearest piece of operational debt in the project, and it is a process problem
rather than a code one, which is exactly why it is the hard kind.

The theme across all of these is the same as the last project: the failures that
cost the most were the silent ones. An estimator returning 1.000, a statement that
failed to prepare, a 404 that meant "we could not ask", a dashboard reading zero
because it timed out, a guard waving traffic through because nothing had thrown.
Most of the fixes are really one fix, which is refusing to let two different
things produce the same output.

---

## 6. Tech stack

Grouped by what it does in this system.

**Application**
Next.js 16 App Router, React 19, TypeScript 5, Tailwind CSS 4, shadcn/ui built on
`@base-ui-components/react` rather than Radix, Framer Motion. Server components by
default; the rank pages ship no client JavaScript at all.

**Data collection**
Python. `twscrape` against X's GraphQL endpoints on a 35-account pool, the
Bluesky firehose and follow graph, Telegram web and bot crawlers, TikTok, the
official YouTube Data API, LinkedIn. 14 compose services, 18,002 lines.

**Databases**
Postgres for both stacks. The engine database holds the catalogs, the follow
graph and the aggregates; the marketplace runs Postgres 17 with PostgREST 12.2.3
in front of it, self-hosted since June 2026. `node-postgres` pools with explicit
`statement_timeout`, one read-only role and one narrow write role.

**Statistics**
All in SQL and Python: `percentile_cont` and `percentile_disc`, `ntile`,
`percent_rank`, `tablesample system`, `grouping sets`, Hodges-Lehmann location
estimates, distribution-free order-statistic confidence intervals, an exact sign
test, and Benjamini-Hochberg correction.

**AI**
Anthropic Claude via forced tool use for schema-constrained JSON: the tool's
`input_schema` is a Zod 4 schema converted with `z.toJSONSchema`, `tool_choice`
forces the call, and the model's output is validated back through the same schema
so callers get a typed, runtime-checked object. These tools were originally built
on OpenAI's Responses API with Zod structured outputs and were ported because
production had an Anthropic key and had never had an OpenAI one. Used by two free
tools, the KYC review agent, the message guard and the support suggester. Not used
anywhere in the insights path.

**Infrastructure**
Docker Compose, Caddy 2 with automatic TLS, Cloudflare in front, one Hetzner box.
Multi-stage Node 22 Alpine build with a capped V8 heap. Cloudflare Turnstile for
captcha.

**Security**
Read-only database role as the primary isolation boundary. CSP, HSTS and the rest
of the security headers set in `next.config.ts`. Encrypted credential storage.
Client-IP normalisation at the edge so a forwarded header can never be a client's
claim about itself.

**SEO**
Ten-chunk sitemap index, per-platform. JSON-LD (`Dataset`, `ItemList`,
`ProfilePage`, `FAQPage`, `BreadcrumbList`). Generated Open Graph cards on the
Node runtime. `llms.txt`. Locale-aware canonicals and hreflang behind a single
switch.

---

## 7. Numbers

Measured on the repository, in a production deploy log, or quoted from a code
comment that records when it was measured. The catalog row counts and the timing
figures come from comments written by the person who ran them and are dated
2026-08-24 or earlier; they are not something I re-ran.

| Metric | Value |
|---|---|
| Accounts indexed across five networks | 25,296,740 |
| X catalog (`xdir_accounts`) | 18,486,455 |
| Bluesky (`bdir_accounts`) | 3,802,535 |
| Telegram (`tgdir_chats`) | 2,955,123 |
| YouTube (`ytdir_channels`) | 35,149 |
| TikTok (`ttdir_accounts`) | 17,478 |
| Follow-graph edges (`xedges`) | 79,800,000 |
| Median indexed account, X / Bluesky / Telegram | 550 / 133 / 48 followers |
| Median tracked creator, TikTok / YouTube | 10,200 / 62,000 |
| Ladder query, live | 12 to 44 s |
| Directory pool statement timeout | 15 s |
| Ladder queries per rank page view | 0 |
| Ladder breakpoints, per platform | 101 |
| Ladder sample sizes | 45,308 / 115,643 / 119,346 / 10,803 / 35,149 |
| Audience overlap, cold / warm | 5.7 s / 85 ms |
| Edge scan cap per account | 25,000 |
| @naval: real followers vs indexed | 3,900,000 vs 2,666 |
| Free tools | 25, plus a 2FA generator |
| Tool API endpoints | 18 |
| Tools in the guard's cost table | 19 |
| Checks in `toolGuard`, in order | 9 |
| Global ceilings | 30/min pool, 10/min heavy, 300/hr pool |
| Most expensive single request | Trust report build, 12 upstream reads |
| twscrape pool | 35 accounts, ~45 reads each per 15 min |
| Cost of one timeline scan | 2.42 UserTweets requests |
| Pool ceiling | ~6,300 requests/hr, ~2,600 scans/hr |
| Insights pages | 9, plus a per-account template and `data.json` |
| Buckets tested per pattern run | ~2,648 |
| Findings lost to Benjamini-Hochberg | 137 of 904 |
| Largest effect: media on engagement | +53%, interval [+45, +61] |
| Largest negative: links on reach | -52%, interval [-54, -49] |
| Pattern pass runtime | ~20 s over 240,000 tweets |
| Publication floor | 200 tweets and 30 accounts per row |
| Old estimator: rows stuck at exactly 1.000 | 72 of 138 |
| Route handlers | 245 |
| Page files | 244 |
| Routes in the production build | 617 |
| Pages statically generated per build | 1,156 in 24.0 s |
| Build / deploy wall time | 259 s / 298 s |
| TypeScript check | 71 s |
| TypeScript and TSX | 314,842 lines across 1,196 files, fixtures excluded |
| Python | 18,002 lines across 41 files |
| Engine SQL schema | 2,802 lines across 13 files |
| Sitemap children | 10, split by platform |
| Locales built / live | 4 / 1 |
| Email wall yield before removal | 118 addresses in 158 days |
| Longest outage from a 404-on-failure bug | 15 hours, all five directories |
| Worst false-positive incident | 264 blocks across 19 users in one week |
| Prompt that stopped fitting | 1,053,556 tokens against a 1,000,000 limit |

---

## 8. Links

The repository is private. These are the public surfaces.

| Link | What it is |
|---|---|
| https://playersells.com/tools | The 25 free tools. No account needed. |
| https://playersells.com/tools/twitter-follower-rank | The rank engine. Try a handle, or just read the distribution table. |
| https://playersells.com/insights | The published studies, with intervals and denominators. |
| https://playersells.com/insights/data.json | The same findings, machine-readable, CC BY 4.0. |
| https://playersells.com | The marketplace. |

---

## 9. Notes for whoever builds the page

- The sections that do the most work are **5 (What did not work)**, **4.1 (the
  rank engine)** and **4.2 (the insight engine)**. If the page has to be
  shortened, shorten 4.6 and 6, not those.
- Section 5 is long on purpose. It is the section that proves the rest is real.
  If it has to be cut, cut individual items rather than compressing them, because
  the specificity is what makes them credible.
- Suggested reading order for a recruiter skimming: hero stats, then the first
  three items of section 5, then 4.1.
- Nothing here contains a credential, a hostname beyond the public product
  domain, a server address, a customer name, or a real user's data. Keep it that
  way if the copy is edited. In particular: do not add the production IP, the
  deploy host, or anything from the deploy logs.
- The handles named on this page (@naval) are public figures cited in code
  comments as sample sizes. No buyer, seller or private individual is named.
- No em dashes or en dashes anywhere in this file, on purpose. Please keep it
  that way when this becomes JSX, and watch for editors that autocorrect a double
  hyphen.
- The word "engine" is overloaded in this codebase and I have kept it out of the
  copy where possible. Internally, `x-insights` is the public studies and
  `engine-insights` is an admin health dashboard for the crawlers. They share a
  word and nothing else.
