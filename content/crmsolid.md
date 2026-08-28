# CRMSolid

> Source-of-truth content for the CRMSolid project page.
> Language: English. A Turkish translation is a separate pass.
> Every number here was measured on the repository or read out of production logs.
> The repository is private, so this page is the evidence.

---

## 1. Summary

**slug:** `crmsolid`
**role:** Sole developer. Design, code, deploy, on call.
**status:** In production since 2025. Paying users.
**one-line hook:** A CRM that runs five services on one Hetzner box, serves 1.79 million business records in 15ms, and exposes the whole thing to AI assistants over MCP.

**Intro paragraph:**

CRMSolid is a multi-tenant SaaS CRM for teams that sell over messaging apps rather than email.
I built and still run all of it: a .NET 8 API, a Next.js panel, a .NET 9 desktop agent, a health
monitor, and a landing site, behind Traefik on a single Linux server. The interesting parts are
not the CRUD. They are a 1.79 million row business directory built from open map data, an MCP
server that lets Claude and other assistants use the CRM as a tool, and a per-account rate
budget that decides which background work is allowed to spend it.

The backend is a modular monolith. That was a decision, not an accident, and section 3 explains it.

### Stat cards (4 to 6 shown in the hero)

| value | label | note for the designer |
|---|---|---|
| `1.79M` | business records, searched locally | primary card |
| `277s → 15ms` | catalogue lookup, before and after | primary card, use an arrow glyph not a dash |
| `5` | separately deployed services | |
| `62` | MCP tools exposed to AI assistants | |
| `516` | NUnit test methods | |
| `211K` | lines of hand-written C# | 686 files, migrations excluded |

---

## 2. The problem

Sales teams in Turkey do a large share of their selling inside Telegram and X, not email. The CRMs
built for that market assume email threads, a web form, and a contact who fills it in. None of that
matches how the work actually happens: the first touch is a direct message, the deal moves in the
same thread, and the salesperson is juggling several accounts at once.

So there were three things to solve.

**Getting people into the CRM.** Buying lead lists is expensive and the data is stale. Overture Maps
publishes an openly licensed global place dataset (CDLA-Permissive-2.0, commercial use allowed) that
includes roughly 1.9 million Turkish businesses with names, categories, phone numbers and websites.
That is a better starting point than any list vendor, if you can query it fast enough to put behind
a search box.

**Sending messages without getting the account limited.** Telegram enforces per-account flood limits
and escalates them when you keep hitting the wall. A CRM that sends on the user's behalf is spending
the user's own budget, and the moment background housekeeping spends it too, the product stops
working. This turned out to be the hardest constraint in the system.

**One person operating all of it.** No SRE, no platform team, no on-call rotation. Every architectural
choice had to be one I could still run at 2am, alone, a year later.

---

## 3. Architecture

### What it is

A modular monolith with five separately deployed pieces. Most of the product lives in one .NET 8
process. Three things are split out, and each split has a reason that is about deployment or blast
radius, not about fashion.

| Piece | Tech | Why it is separate |
|---|---|---|
| **API** (`TelegramSimple`) | .NET 8, EF Core, Npgsql, Redis, DuckDB | The product. One process, one database, one deploy. |
| **Panel** | Next.js 15, React 19, TypeScript | Different runtime, different release cadence. Ships as its own container so a UI fix does not restart the API and drop every SignalR connection. |
| **Desktop agent** (`PC_APP`) | .NET 9, Photino.NET + Blazor, SQLite | Runs on the user's machine because Telegram MTProto sessions belong on the user's IP, not on a shared server IP. Cannot be a server component. |
| **Health monitor** | .NET, separate container | Has to survive the thing it watches. If it lived in the API it would go down with it, which is the one moment it matters. |
| **Landing** | React 18 + Vite, prerendered | Static. No reason to couple it to a backend deploy. |

### Why not microservices

I am one person. Microservices move complexity out of the code and into the operations: service
discovery, distributed tracing, per-service deploy pipelines, versioned contracts between services,
and a distributed transaction problem where a database transaction used to be enough. That is a real
cost, paid every week, in exchange for independent scaling I do not need at this size.

The modular monolith gives me the thing I actually wanted, which is a single transaction boundary.
When a message arrives, the CRM writes the message, updates the conversation, moves the contact's
stage, and queues a webhook delivery. In one process that is one `SaveChanges`. Split across services
it is a saga with compensation logic, and every one of those compensations is code I would have to
write and test alone.

The parts that are split out are split because they physically cannot be together (the desktop agent),
because they must not fail together (the health monitor), or because they have a different runtime
and release rhythm (the panel and the landing site). Those are the reasons that survive scrutiny.

Inside the monolith the boundaries are enforced by module: `Services/Mcp`, `Services/Assistant`,
`Services/Bot`, `Services/Webhooks`, `Services/Email`, `Services/Alerts`, `Services/Clipper`,
`Services/Ads`, `Services/PaymentProviders`. If the product ever needs to split, those are the seams.

### Runtime shape

- 168 `DbSet` properties on one `AppDbContext` (2,521 lines of configuration), on PostgreSQL 16.
- Over 100 REST controllers under `Controllers/Api`, plus a dedicated MCP controller pair.
- 17 hosted background services. The important ones: `JobWorker` polls the queue every 5 seconds and
  sends messages, `SequenceProcessor` runs campaign steps, `BusinessDiscoveryWorker` and
  `SocialHarvestWorker` enrich the catalogue, `SubscriptionEnforcementService` applies plan limits.
- 3 SignalR hubs (1,223 lines): panel chat, the embeddable live chat widget, and live visitor presence.
- Redis for the rate limit counters and the distributed lock that guards them.
- Serilog to console and compact JSON files, with a correlation id attached per request.

### Diagram description (for the SVG)

A left-to-right flow in three bands.

**Band 1, left, "Clients".** Four boxes stacked:
`Browser (Next.js panel)`, `Desktop agent (Photino + Blazor, user machine)`,
`AI assistant (Claude, any MCP client)`, `Chat widget (embedded on customer sites)`.

**Band 2, middle, "Edge".** One wide box labelled `Traefik 3.1` with a small subtitle
`TLS via Let's Encrypt, HTTP to HTTPS redirect`. Every arrow from band 1 enters here.
Four labelled arrows leave it, one per hostname: `crmsolid.com`, `app.crmsolid.com`,
`api.crmsolid.com`, `health.crmsolid.com`.

**Band 3, right, "Server".** A large rounded container labelled
`TelegramSimple API (.NET 8, single process)` holding five stacked inner boxes:
`REST controllers`, `MCP server (JSON-RPC over Streamable HTTP)`, `SignalR hubs`,
`17 background workers`, `EF Core AppDbContext`.
Outside that container, to its right, three separate boxes:
`PostgreSQL 16`, `Redis`, `Health monitor (separate container)`.

**Arrows to draw:**
- `EF Core AppDbContext` to `PostgreSQL 16`, solid, labelled `EF Core + Npgsql binary COPY`.
- `Background workers` to `Redis`, solid, labelled `rate limit counters + locks`.
- `Health monitor` to `REST controllers`, dashed, labelled `probes`, drawn as a loop coming from
  outside the API container so it reads as "watches from outside".
- `SignalR hubs` back to `Browser` and `Chat widget`, dashed, labelled `live updates`.
- `Desktop agent` to `REST controllers`, solid, labelled `device token`.
- A separate arrow from `Desktop agent` going off to the left edge to a small box
  `Telegram MTProto`, labelled `user's own IP`. This is the point of the whole diagram:
  that call does not originate from the server.
- `Background workers` to a small box `Overture Maps S3 (parquet)`, dotted, labelled
  `catalogue sync, DuckDB`.

Keep the palette to two colours plus grey. The one thing a reader should take away is that the
MCP server and the REST API are the same process reading the same database, and that the Telegram
connection leaves from the user's machine rather than the server.

---

## 4. Technical deep dives

### 4.1 A 1.79 million row business directory, 277 seconds down to 15 milliseconds

**The need.** Users need to find companies to sell to. Overture Maps publishes place data as parquet
files on public S3. DuckDB can read remote parquet directly, so the first version simply pointed a
query at the bucket whenever a user searched.

**Why that failed.** Measured from a Turkish host, a single province lookup against Overture's S3
took 277 seconds. That is not a slow search box, it is a broken feature. Latency to us-west-2 plus
the volume of parquet scanned made per-query remote reads impossible regardless of how the query
was written.

**The fix.** Pull the country once, serve searches from a local table. `BusinessCatalogSyncService`
builds `business_catalog`, a shared, workspace-independent table with roughly 1.79 million rows. The
same query then costs 15ms. Because it is a full pull rather than a per-search fetch, the catalogue
actually contains every business, not just whatever somebody happened to search for.

**Why the write path is not EF Core.** Loading 1.9 million rows through EF Core means 1.9 million
tracked entities and hours of change tracking. The sync uses Npgsql binary `COPY` into a temporary
staging table in 20,000 row batches, then one upsert per batch keyed on the Overture id. That makes
the whole job idempotent: a re-run refreshes rather than duplicates, and an interrupted run is just
repeated.

**Why province assignment is a real point-in-polygon test.** The obvious approach is bounding boxes.
Turkish province bounding boxes overlap heavily, and picking the smallest containing box puts central
İzmir in Manisa and central Antalya in Burdur. So the sync loads Overture's own administrative
boundary polygons and uses `ST_Within` against the real geometry.

**Why the address field is not used at all.** Overture's `region` field is null on about 92% of
Turkish rows and inconsistent on the rest. Province and district filtering is entirely geographic.

### 4.2 An MCP server, hand written against the spec

CRMSolid speaks the Model Context Protocol, so an AI assistant can use the CRM as a set of tools
rather than through a scraped UI or a generic HTTP wrapper.

- **62 tools**, from `crm_search_contacts` and `crm_get_contact` through `crm_create_deal`,
  `crm_schedule_social_post`, `crm_list_invoices` and `crm_run_agent`.
- **21 resources** and **15 prompt definitions**, so a client can list what the CRM offers and get
  a working prompt for it, not just a bare function signature.
- About **8,400 lines** across `Services/Mcp` and `Controllers/Mcp`.

**The protocol is hand rolled.** I wrote the JSON-RPC 2.0 and MCP DTOs myself instead of taking the
preview C# SDK. The reason is upgrade timing: MCP moved fast through 2025 and 2026, and I did not
want a preview dependency deciding when my production API changed shape. The implementation targets
spec revision 2025-06-18 and covers `initialize`, `tools/list`, `tools/call`, `resources/list`,
`resources/read`, `prompts/list`, `prompts/get` and `ping`, plus an SSE channel for
server-initiated notifications.

**Sessions are optional on purpose.** `McpSessionManager` tracks Streamable HTTP sessions, each with
a 256-bit random id, the authenticated user it belongs to, and a channel of outbound notification
frames drained by a `GET /mcp` SSE reader. Clients that never send an `Mcp-Session-Id` simply never
create a session and keep working. Session ownership is checked in the controller before the manager
ever hands a session out, so one user's MCP session cannot be addressed by another.

It has its own test suites, `McpServerTests` and `McpSocialSurfaceTests`.

### 4.3 Multi-tenancy: shared pool, and a header you cannot forge

Workspaces let several people share one CRM. The model is a shared pool rather than a row-level
security policy or a database per tenant.

Data ownership stays keyed by `UserId`, so inserts never changed. Reads, edits and deletes are scoped
to the union of `UserId`s belonging to the members of the caller's active workspace. Queries filter
with `scopedIds.Contains(x.UserId)`.

The active workspace arrives in an `X-Workspace-Id` request header, which means it is attacker
controlled. `WorkspaceScope` always verifies it against actual membership, and an unknown or foreign
id falls back silently to the caller's personal scope. A forged header can therefore never widen
access, only fail to widen it. That single rule is the security foundation of the feature, and it is
written into the interface documentation so it does not get refactored away.

Write access is a separate concern. `RequireWorkspaceWriteAttribute` is an action filter applied to
mutation endpoints only. It returns 403 for the Viewer role. The comment on it says what matters:
the backend is the authority, and the frontend role gating is UX.

Member lists are cached for 45 seconds with explicit invalidation from `WorkspaceService`, and the
resolved scope is memoized per request.

### 4.4 The flood budget: rate limiting as a product constraint

Every MTProto call the system makes on a user's account is spent from the same per-account flood
budget that the user's outgoing messages need. This makes rate limiting a resource allocation problem,
not a politeness feature.

`RateLimiter` keeps per-account counters in Redis behind a distributed lock with a 5 second timeout,
and fails closed if it cannot take the lock. The defaults are deliberately conservative: 20 messages
per hour, 10 seconds minimum between messages, a forced break after 10 consecutive sends, and a 2
hour penalty on `PEER_FLOOD` that escalates to 8 hours on repeats. Scrapers use exponential backoff
on consecutive `FLOOD_WAIT` responses, reading the wait length out of the error itself.

The public REST API has its own limiter, `PublicApiRequestLimiter`, on a per-minute window keyed by
API key id, with the per-key limit carried in the JWT as a claim and a 60 rpm default if the claim
is missing or unparseable.

The failure that shaped all of this is in section 5.

### 4.5 Real time updates, and the interceptor bug that hid them

Live updates go over SignalR. Rather than remembering to broadcast at every call site, broadcasting
hangs off an EF Core `SaveChangesInterceptor`: anything that saves a message or conversation
publishes it, with no cooperation needed from the code doing the save.

Getting that right required a specific piece of EF Core knowledge. The interceptor is a singleton, so
per-save state has to be keyed by the `DbContext` instance, which it does with a
`ConditionalWeakTable`. More importantly, entities are captured in `SavingChanges`, while their
`EntityState` is still `Added` or `Modified`, and broadcast in `SavedChanges`. Reading
`EntityState.Added` inside `SavedChanges` finds nothing, because EF Core has already called
`AcceptAllChanges` and reset every entity to `Unchanged`.

That was a long-standing bug: messages saved correctly, the UI just never heard about them, and
nothing appeared in the logs because nothing had thrown.

### 4.6 Choosing a model per turn instead of per feature

The in-app assistant sends work to Claude. Its traffic is bimodal: most turns are lookups such as
"show unpaid invoices" or "who messaged me today", which are one tool call and a sentence of
narration. A minority are the turns the feature exists for, such as comparing two periods, planning
a follow-up sequence, or staging a write whose confirmation card the user is about to approve.

`AssistantModelRouter` routes on intent and picks the cheaper, faster model for lookups. Two details
matter more than the routing itself. When the guess is wrong, it is wrong upward, and a write
proposal always escalates, because the confirmation card is a promise about what will happen and the
user approves it without re-deriving it. And the escalation markers are multilingual, because the
panel ships Turkish, English and Russian, and an operator asking in Turkish should get the same model
an English speaker gets for the same question.

Every routing decision is logged with its reason so the choices can be audited later.

### 4.7 Tests and production operations

**Tests.** 516 NUnit test methods across 34 files in the API suite, plus a separate suite for the
.NET SDK. They cover the parts where being wrong is expensive: `RateLimiterTests`,
`BusinessCatalogSyncTests` and `BusinessCatalogFullSyncTests`, `McpServerTests`,
`PublicApiRequestLimiterTests`, `OutreachSafetyTests`, `OutreachRetryTests`,
`JobFailureClassifierTests`, `WebhookSignatureTests`.

**Deploys.** GitHub Actions, manually triggered with a target selector, so I choose what ships. The
test job runs first. Deployment authenticates to the server by SSH key from a repository secret,
never a password.

**Runtime.** Docker Compose behind Traefik 3.1, with Let's Encrypt certificates issued automatically
and a permanent HTTP to HTTPS redirect per hostname. PostgreSQL 16 in its own container with a
health check. A separate health monitor container probes the API from outside the API.

**One build detail worth keeping.** The API image is Debian (`aspnet:8.0-bookworm-slim`), not Alpine.
DuckDB's native `libduckdb.so` is built against glibc and will not load on musl: missing
`libstdc++.so.6`, missing `libgcc_s.so.1`, unresolved `std::` symbols. The smaller base image was not
an option once the catalogue existed, and the reason is written in the Dockerfile so nobody
"optimizes" it back.

---

## 5. What did not work

This is the honest section. Every item below is something I shipped or tried, watched fail in
production or in a measured test, and replaced.

**Reading remote parquet per search.** Pointing DuckDB at Overture's S3 bucket on every user search
cost 277 seconds for a single province. Replaced with a full local sync.

**Streaming the spatial join against S3.** The natural next attempt was to keep the data remote but
do the filtering in one query: `ST_Within` joined directly against the remote parquet. DuckDB
materializes the entire join before emitting a row. It sat at 2.5 GB of RAM and produced zero rows
after 15 minutes. Splitting it into two stages fixed it: download the country inside a bounding box
first with no spatial work at all, then join province by province against local data. Each step is
bounded and, just as importantly, observable. I could see progress.

**Trusting bounding boxes for province assignment.** Turkish province boxes overlap heavily. Choosing
the smallest containing box put central İzmir in Manisa and central Antalya in Burdur. Real
point-in-polygon against Overture's boundary geometry was the only thing that worked.

**Assuming 81 provinces.** Turkey has 81. Overture ships 109 province rows, because Adana, Antalya
and Artvin each appear more than once. Without merging, stage two processes those provinces twice and
so double-counts their companies. `ST_Union_Agg` merges geometries per name and the count comes back
to 81.

**Assuming company names are valid UTF-8.** Real company names in the dataset contain lone
surrogates, usually half an emoji pair left behind by a truncated source record. Npgsql's UTF-8
encoder throws on those and aborts the entire binary `COPY` batch. Truncating a string to a column
width can also split a valid pair and create the same problem, so sanitising has to run after
truncation, not before. Null bytes are dropped outright because Postgres rejects them in text columns.

**Letting a cosmetic feature spend the flood budget.** This is the worst one. The first version of
avatar syncing called `Contacts_GetContacts`, `Messages_GetDialogs` and `Contacts_ResolveUsername`
once per contact. With a 150 contact batch every 15 minutes that came to roughly 2,500
`ResolveUsername` calls a day on the same account the user's messages go out through. The account sat
permanently inside a flood window and ordinary chat messages started failing with `FLOOD_WAIT_300`.
Profile pictures broke the product.

Worse, the first fix was not enough. A per-cycle flag reset every fifteen minutes, so the next cycle
started fresh, spent its calls, hit the same wall, and Telegram lengthened the penalty each time.
Production went from `FLOOD_WAIT_15062`, about 4 hours, to `FLOOD_WAIT_80024`, about 22 hours, in one
night. The fix that held was a per-account "do not touch until" timestamp kept across cycles.

**Using `ResolveUsername` as a fallback at all.** Most contacts without avatars reach the CRM from
other channels, so their stored "username" is a phone number, not a handle. Ten hours of production
resolved exactly zero of them and earned the account a 22 hour penalty. Removed. Contacts we actually
talk to arrive with an id and access hash from their first message, so their avatars still resolve
from cache, and whatever gets resolved is written back so the send path never has to resolve it again.

**Reading `EntityState.Added` in `SavedChanges`.** Covered in 4.5. EF Core has already called
`AcceptAllChanges` by then, so the check silently matched nothing and real-time message delivery
quietly did not happen.

**Building a chat-learning prompt in one shot.** The single-prompt build silently dropped everything
past roughly 28,000 characters. No error, just a model reasoning over a fraction of the input.
Replaced with batched windows, newest conversations first, with the merged result and honest coverage
statistics reporting which conversations actually made it in.

**Alpine as a base image.** Smaller, and completely incompatible with DuckDB's glibc-linked native
library.

The theme across all of these: the failures that cost the most time were the silent ones. Zero rows,
a dropped prompt tail, an event that never fired. Several of the fixes above are really the same fix,
which is making the failure visible.

---

## 6. Tech stack

Grouped by what it actually does in this system, not by resume category.

**Backend**
C#, .NET 8 (API), ASP.NET Core Web API, Entity Framework Core, LINQ, SignalR, Serilog.

**Data**
PostgreSQL 16 with Npgsql, including binary `COPY` for bulk load. DuckDB with the `httpfs` and
`spatial` extensions for the Overture pipeline. Redis for rate limit counters and distributed locks.
SQLite inside the desktop agent.

**Frontend**
Next.js 15, React 19, TypeScript, Tailwind CSS, and an in-house design system ("Solid DS") of
semantic tokens plus UI primitives. The landing site is React 18 on Vite, prerendered with Puppeteer.
Internationalisation with next-intl.

**Desktop**
.NET 9, Photino.NET with Blazor, plus an Electron build. Windows and macOS releases are built by a
matrix GitHub Actions workflow on tag push.

**AI**
Anthropic API for the in-app assistant, with per-turn model routing. OpenAI API for message analysis
and lead scoring. A hand-written MCP server (JSON-RPC 2.0 over Streamable HTTP with SSE) exposing 62
tools, 21 resources and 15 prompts.

**Infrastructure**
Docker and Docker Compose, Traefik 3.1, Let's Encrypt, GitHub Actions with key based SSH deploys,
Hetzner Linux server administration, a separate health monitor service.

**Auth and security**
JWT with BCrypt password hashing. Workspace scoping verified server side. HMAC-signed webhooks.
Encrypted API key storage. Security headers middleware. A demo mode that is read-only at the
middleware layer.

**Testing**
NUnit. 516 test methods in the API suite, a separate suite for the .NET SDK.

**Integrations and SDKs**
Three SDKs (.NET, Node, MCP) and four integrations (ikas, WordPress, Zapier, MCP registry).
LemonSqueezy and WeePay for billing, Resend for transactional email, WTelegramClient for MTProto.

---

## 7. Numbers

All measured on the repository or read from production logs.

| Metric | Value |
|---|---|
| Business records in the local catalogue | 1,790,000 |
| Catalogue lookup, before | 277 s |
| Catalogue lookup, after | 15 ms |
| Failed streaming attempt | 2.5 GB RAM, 0 rows after 15 min |
| Overture province rows shipped vs actual provinces | 109 vs 81 |
| Overture rows with a null `region` field | about 92% |
| Bulk load batch size | 20,000 rows per `COPY` |
| Hand-written C# | 211,066 lines across 686 files, migrations excluded |
| TypeScript and React | 305,928 lines across 1,069 `.tsx` files |
| Tracked files in the repository | 3,770 |
| `DbSet` properties on one `DbContext` | 168 |
| REST controllers | over 100 |
| Background workers | 17 |
| SignalR hubs | 3 (1,223 lines) |
| MCP tools / resources / prompts | 62 / 21 / 15 |
| MCP implementation size | about 8,400 lines |
| NUnit test methods | 516 across 34 files, plus a separate SDK suite |
| Separately deployed services | 5 |
| Default send rate limit | 20 per hour, 10 s apart |
| Worst flood penalty observed | `FLOOD_WAIT_80024`, about 22 hours |

---

## 8. Links

The CRM itself is closed source. These pieces of it are public and MIT licensed.

| Link | What it is |
|---|---|
| https://github.com/CRM-Solid/crmsolid-dotnet | .NET SDK for the CRMSolid API. Typed resources, HMAC and bearer credentials, a retrying rate limit handler, its own NUnit suite. |
| https://github.com/CRM-Solid/crmsolid-mcp | MCP server in TypeScript. Lets AI assistants use the CRM. |
| https://github.com/CRM-Solid/crmsolid-clipper | Chrome extension, published on the Chrome Web Store. |
| https://crmsolid.com | The product. |

---

## 9. Notes for whoever builds the page

- The two sections that do the most work are **5 (What did not work)** and **4.1 (the catalogue)**.
  If the page has to be shortened, shorten section 6 and 7, not those.
- Nothing here contains a credential, a hostname beyond the public product domain, a customer name,
  or a private IP. Keep it that way if the copy is edited.
- No em dashes anywhere in this file, on purpose. Please keep it that way when this becomes JSX,
  and watch out for editors that autocorrect a double hyphen.
- Suggested reading order for a recruiter skimming: hero stats, section 5, then 4.1.
