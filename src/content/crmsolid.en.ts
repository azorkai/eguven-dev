/* ---------------------------------------------------------------------------
 *  CRMSolid case study, English. Roughly four thousand words, which is exactly
 *  why it is not in the UI dictionary.
 *
 *  Inline marks understood by src/i18n/rich.tsx:
 *      `identifier`   monospace code span
 *      ==phrase==     highlighter, at most one per section
 * ------------------------------------------------------------------------- */

export const crmsolidEn = {
    meta: {
        title: 'CRMSolid, a case study | Emirhan Güven',
        desc:
            'How CRMSolid works: five deployed services on one Linux server, a 1.79 million row ' +
            'business catalogue that answers in 15ms instead of 277 seconds, a hand written MCP ' +
            'server, and the rate limit failures that shaped the product.',
    },

    kicker: 'CASE STUDY',
    byline: 'SOLE DEVELOPER / IN PRODUCTION SINCE 2025',

    standfirst:
        'A multi-tenant SaaS CRM for teams that sell over messaging apps rather than email. I designed it, wrote it, and still run it: a .NET 8 API, a Next.js panel, a .NET 9 desktop agent, a health monitor and a landing site, ==behind Traefik on a single Linux server==.',
    intro:
        'The interesting parts are not the CRUD. They are a 1.79 million row business directory built from open map data, an MCP server that lets Claude and other assistants use the CRM as a tool, and a per account rate budget that decides which background work is allowed to spend it. The backend is a modular monolith. That was a decision, not an accident, and section 02 explains it.',

    stats: [
        ['1.79 M', 'business records, searched locally'],
        ['277s → 15ms', 'catalogue lookup, before and after'],
        ['5', 'separately deployed services'],
        ['62', 'MCP tools for AI assistants'],
        ['516', 'NUnit test methods'],
        ['211 K', 'lines of hand written C#'],
    ] as [string, string][],
    statsNote:
        'Counted on the repository or read out of production logs. The repository is private, so this page is the evidence.',

    contents: 'CONTENTS',
    contentsAria: 'Contents',

    /* Short titles for the index column. */
    toc: {
        problem: 'The problem',
        architecture: 'Architecture',
        catalogue: 'The catalogue',
        mcp: 'The MCP server',
        tenancy: 'Multi-tenancy',
        flood: 'The flood budget',
        realtime: 'Live updates, model choice',
        operations: 'Tests and operations',
        failures: 'What did not work',
        stack: 'Tech stack',
        numbers: 'Numbers',
        links: 'Links',
    },

    /* The headings actually printed above each section. */
    heading: {
        problem: 'The problem',
        architecture: 'Architecture',
        catalogue: 'A 1.79 million row directory, 277 seconds down to 15 milliseconds',
        mcp: 'An MCP server, hand written against the spec',
        tenancy: 'Multi-tenancy: a shared pool, and a header you cannot forge',
        flood: 'The flood budget: rate limiting as a product constraint',
        realtime: 'Live updates, and choosing a model per turn',
        operations: 'Tests and production operations',
        failures: 'What did not work',
        stack: 'Tech stack',
        numbers: 'Numbers',
        links: 'Links',
    },

    /* ---- 01 --------------------------------------------------------------- */
    problem: {
        intro: [
            'Sales teams in Turkey do a large share of their selling inside Telegram and X, not email. The CRMs built for that market assume email threads, a web form, and a contact who fills it in. None of that matches how the work happens: the first touch is a direct message, the deal moves in the same thread, and the salesperson is juggling several accounts at once.',
            'So there were three things to solve.',
        ],
        subs: [
            {
                head: 'Getting people into the CRM',
                body: 'Buying lead lists is expensive and the data is stale. Overture Maps publishes an openly licensed global place dataset (CDLA-Permissive-2.0, commercial use allowed) that includes roughly 1.9 million Turkish businesses with names, categories, phone numbers and websites. That is a better starting point than any list vendor, if you can query it fast enough to put behind a search box.',
            },
            {
                head: 'Sending without getting the account limited',
                body: 'Telegram enforces per account flood limits and escalates them when you keep hitting the wall. A CRM that sends on behalf of a user is spending that user own budget, and the moment background housekeeping spends it too, the product stops working. This turned out to be the hardest constraint in the system.',
            },
            {
                head: 'One person operating all of it',
                body: 'No SRE, no platform team, no on call rotation. Every architectural choice had to be one I could still run at 2am, alone, a year later.',
            },
        ],
        figure: {
            alt: 'The CRMSolid unified inbox: a mailbox list, a column of conversation threads from several channels with unread counts and lead scores, and an empty reading pane.',
            caption:
                'One inbox over every channel the deal moves through. A thread here is the same conversation the pipeline card in section 02 is tracking, which is the part email shaped CRMs get wrong.',
        },
    },

    /* ---- 02 --------------------------------------------------------------- */
    architecture: {
        intro:
            'A modular monolith with five separately deployed pieces. Most of the product lives in one .NET 8 process. Three things are split out, and each split has a reason that is about deployment or blast radius, not about fashion.',
        pieces: [
            {
                name: 'API',
                tech: '.NET 8, EF Core, Npgsql, Redis, DuckDB',
                why: 'The product. One process, one database, one deploy.',
            },
            {
                name: 'Panel',
                tech: 'Next.js 15, React 19, TypeScript',
                why: 'Different runtime, different release cadence. It ships as its own container so a UI fix does not restart the API and drop every SignalR connection.',
            },
            {
                name: 'Desktop agent',
                tech: '.NET 9, Photino.NET with Blazor, SQLite',
                why: 'Runs on the user machine because Telegram MTProto sessions belong on the user IP, not on a shared server IP. It cannot be a server component.',
            },
            {
                name: 'Health monitor',
                tech: '.NET, separate container',
                why: 'It has to survive the thing it watches. Inside the API it would go down with it, which is the one moment it matters.',
            },
            {
                name: 'Landing',
                tech: 'React 18 on Vite, prerendered',
                why: 'Static. No reason to couple it to a backend deploy.',
            },
        ],
        whyNotHead: 'Why not microservices',
        whyNot: [
            'I am one person. Microservices move complexity out of the code and into the operations: service discovery, distributed tracing, per service deploy pipelines, versioned contracts between services, and a distributed transaction problem where a database transaction used to be enough. That is a real cost, paid every week, in exchange for independent scaling I do not need at this size.',
            'The modular monolith gives me the thing I actually wanted, which is a single transaction boundary. When a message arrives, the CRM writes the message, updates the conversation, moves the contact stage, and queues a webhook delivery. In one process that is one `SaveChanges`. Split across services it is a saga with compensation logic, and every one of those compensations is code I would have to write and test alone.',
            'The parts that are split out are split because they physically cannot be together (the desktop agent), because they must not fail together (the health monitor), or because they have a different runtime and release rhythm (the panel and the landing site). Those are the reasons that survive scrutiny.',
            'Inside the monolith the boundaries are enforced by module: `Services/Mcp`, `Services/Assistant`, `Services/Bot`, `Services/Webhooks`, `Services/Email`, `Services/Alerts`, `Services/Clipper`, `Services/Ads`, `Services/PaymentProviders`. If the product ever needs to split, those are the seams.',
        ],
        runtimeHead: 'Runtime shape',
        runtime: [
            '168 `DbSet` properties on one `AppDbContext`, 2,521 lines of configuration, on PostgreSQL 16.',
            'Over 100 REST controllers under `Controllers/Api`, plus a dedicated MCP controller pair.',
            '17 hosted background services. The important ones: `JobWorker` polls the queue every 5 seconds and sends messages, `SequenceProcessor` runs campaign steps, `BusinessDiscoveryWorker` and `SocialHarvestWorker` enrich the catalogue, `SubscriptionEnforcementService` applies plan limits.',
            '3 SignalR hubs, 1,223 lines: panel chat, the embeddable live chat widget, and live visitor presence.',
            'Redis for the rate limit counters and the distributed lock that guards them.',
            'Serilog to console and to compact JSON files, with a correlation id attached per request.',
        ],
        diagramCaption:
            'One request path, end to end. The point of the drawing is that the MCP server and the REST API are the same process reading the same database, and that the Telegram connection leaves from the user own machine rather than from the server.',
        figure: {
            alt: 'The CRMSolid contacts pipeline board: four named pipelines as tabs, a counter strip, and kanban columns headed Prospect, Contacted, Negotiating and Live holding contact cards with handles, message previews and tags.',
            caption:
                'The panel, on a demo workspace. Sixteen product areas in one Next.js app on a shared design system of semantic tokens and UI primitives. Every card here is a row the API serves and a SignalR hub keeps current.',
        },
    },

    /* ---- 03 --------------------------------------------------------------- */
    catalogue: {
        subs: [
            {
                head: 'The need',
                body: 'Users need to find companies to sell to. Overture Maps publishes place data as parquet files on public S3. DuckDB can read remote parquet directly, so the first version simply pointed a query at the bucket whenever a user searched.',
            },
            {
                head: 'Why that failed',
                body: 'Measured from a Turkish host, a single province lookup against the Overture bucket took 277 seconds. That is not a slow search box, it is a broken feature. Latency to us-west-2 plus the volume of parquet scanned made per query remote reads impossible regardless of how the query was written.',
            },
            {
                head: 'The fix',
                body: 'Pull the country once, serve searches from a local table. `BusinessCatalogSyncService` builds `business_catalog`, a shared, workspace independent table with roughly 1.79 million rows. The same query then costs ==15ms instead of 277 seconds==. Because it is a full pull rather than a per search fetch, the catalogue actually contains every business, not just whatever somebody happened to search for.',
            },
            {
                head: 'Why the write path is not EF Core',
                body: 'Loading 1.9 million rows through EF Core means 1.9 million tracked entities and hours of change tracking. The sync uses Npgsql binary `COPY` into a temporary staging table in 20,000 row batches, then one upsert per batch keyed on the Overture id. That makes the whole job idempotent: a re-run refreshes rather than duplicates, and an interrupted run is just repeated.',
            },
            {
                head: 'Why province assignment is a real point in polygon test',
                body: 'The obvious approach is bounding boxes. Turkish province bounding boxes overlap heavily, and picking the smallest containing box puts central İzmir in Manisa and central Antalya in Burdur. So the sync loads the Overture administrative boundary polygons and uses `ST_Within` against the real geometry.',
            },
            {
                head: 'Why the address field is not used at all',
                body: 'The Overture `region` field is null on about 92% of Turkish rows and inconsistent on the rest. Province and district filtering is entirely geographic.',
            },
        ],
    },

    /* ---- 04 --------------------------------------------------------------- */
    mcp: {
        intro:
            'CRMSolid speaks the Model Context Protocol, so an AI assistant can use the CRM as a set of tools rather than through a scraped UI or a generic HTTP wrapper.',
        facts: [
            {
                k: '62 tools',
                v: 'from crm_search_contacts and crm_get_contact through crm_create_deal, crm_schedule_social_post, crm_list_invoices and crm_run_agent.',
            },
            {
                k: '21 resources, 15 prompts',
                v: 'so a client can list what the CRM offers and get a working prompt for it, not just a bare function signature.',
            },
            {
                k: 'About 8,400 lines',
                v: 'across Services/Mcp and Controllers/Mcp.',
            },
        ],
        subs: [
            {
                head: 'The protocol is hand rolled',
                body: 'I wrote the JSON-RPC 2.0 and MCP DTOs myself instead of taking the preview C# SDK. The reason is upgrade timing: MCP moved fast through 2025 and 2026, and I did not want a preview dependency deciding when my production API changed shape. The implementation targets spec revision 2025-06-18 and covers `initialize`, `tools/list`, `tools/call`, `resources/list`, `resources/read`, `prompts/list`, `prompts/get` and `ping`, plus an SSE channel for server initiated notifications.',
            },
            {
                head: 'Sessions are optional on purpose',
                body: '`McpSessionManager` tracks Streamable HTTP sessions, each with a 256-bit random id, the authenticated user it belongs to, and a channel of outbound notification frames drained by a `GET /mcp` SSE reader. Clients that never send an `Mcp-Session-Id` simply never create a session and keep working. Session ownership is checked in the controller before the manager ever hands a session out, so one user MCP session cannot be addressed by another. It has its own test suites, `McpServerTests` and `McpSocialSurfaceTests`.',
            },
        ],
        figure: {
            alt: 'Cover card for the CRM Solid MCP package, reading: read your social DM inbox and schedule posts from Claude, Cursor or ChatGPT, 12 platforms, one typed toolset, npm @crmsolid/mcp-server, MIT, stdio and HTTP.',
            caption:
                'The published TypeScript MCP server, a separate MIT licensed package from the C# implementation described above. Both speak the same protocol against the same API, one over stdio for local clients and one over Streamable HTTP.',
        },
    },

    /* ---- 05 --------------------------------------------------------------- */
    tenancy: {
        paras: [
            'Workspaces let several people share one CRM. The model is a shared pool rather than a row level security policy or a database per tenant.',
            'Data ownership stays keyed by `UserId`, so inserts never changed. Reads, edits and deletes are scoped to the union of `UserId` values belonging to the members of the caller active workspace. Queries filter with `scopedIds.Contains(x.UserId)`.',
            'The active workspace arrives in an `X-Workspace-Id` request header, which means it is attacker controlled. `WorkspaceScope` always verifies it against actual membership, and an unknown or foreign id falls back silently to the caller personal scope. A forged header can therefore never widen access, only fail to widen it. That single rule is the security foundation of the feature, and it is written into the interface documentation so it does not get refactored away.',
            'Write access is a separate concern. `RequireWorkspaceWriteAttribute` is an action filter applied to mutation endpoints only. It returns 403 for the Viewer role. The comment on it says what matters: the backend is the authority, and the frontend role gating is UX.',
            'Member lists are cached for 45 seconds with explicit invalidation from `WorkspaceService`, and the resolved scope is memoised per request.',
        ],
    },

    /* ---- 06 --------------------------------------------------------------- */
    flood: {
        paras: [
            'Every MTProto call the system makes on a user account is spent from the same per account flood budget that the outgoing messages of that user need. This makes rate limiting a resource allocation problem, not a politeness feature.',
            '`RateLimiter` keeps per account counters in Redis behind a distributed lock with a 5 second timeout, and fails closed if it cannot take the lock. The defaults are deliberately conservative: 20 messages per hour, 10 seconds minimum between messages, a forced break after 10 consecutive sends, and a 2 hour penalty on `PEER_FLOOD` that escalates to 8 hours on repeats. Scrapers use exponential backoff on consecutive `FLOOD_WAIT` responses, reading the wait length out of the error itself.',
            'The public REST API has its own limiter, `PublicApiRequestLimiter`, on a per minute window keyed by API key id, with the per key limit carried in the JWT as a claim and a 60 rpm default if the claim is missing or unparseable.',
            'The failure that shaped all of this is in section 09.',
        ],
    },

    /* ---- 07 --------------------------------------------------------------- */
    realtime: {
        subs: [
            {
                head: 'The interceptor bug that hid the updates',
                paras: [
                    'Live updates go over SignalR. Rather than remembering to broadcast at every call site, broadcasting hangs off an EF Core `SaveChangesInterceptor`: anything that saves a message or a conversation publishes it, with no cooperation needed from the code doing the save.',
                    'Getting that right required a specific piece of EF Core knowledge. The interceptor is a singleton, so per save state has to be keyed by the `DbContext` instance, which it does with a `ConditionalWeakTable`. More importantly, entities are captured in `SavingChanges`, while their `EntityState` is still `Added` or `Modified`, and broadcast in `SavedChanges`. Reading `EntityState.Added` inside `SavedChanges` finds nothing, because EF Core has already called `AcceptAllChanges` and reset every entity to `Unchanged`.',
                    'That was a long standing bug: messages saved correctly, the UI just never heard about them, and nothing appeared in the logs because nothing had thrown.',
                ],
            },
            {
                head: 'Choosing a model per turn instead of per feature',
                paras: [
                    'The in app assistant sends work to Claude. Its traffic is bimodal: most turns are lookups such as “show unpaid invoices” or “who messaged me today”, which are one tool call and a sentence of narration. A minority are the turns the feature exists for, such as comparing two periods, planning a follow up sequence, or staging a write whose confirmation card the user is about to approve.',
                    '`AssistantModelRouter` routes on intent and picks the cheaper, faster model for lookups. Two details matter more than the routing itself. When the guess is wrong, it is wrong upward, and a write proposal always escalates, because the confirmation card is a promise about what will happen and the user approves it without re-deriving it. And the escalation markers are multilingual, because the panel ships Turkish, English and Russian, and an operator asking in Turkish should get the same model an English speaker gets for the same question.',
                    'Every routing decision is logged with its reason so the choices can be audited later.',
                ],
            },
        ],
        figure: {
            alt: 'The CRMSolid AI agents screen: counters for total agents, active agents and runs in the last 24 hours, above three agent cards named Inbound Sales Assistant, Support Triage Bot and Lead Qualifier, each showing its channels, its send mode and when it last ran.',
            caption:
                'Agents are configuration, not code. Each one names its channels and whether it sends on its own or only proposes. That mode is what decides which model the router is allowed to answer with.',
        },
    },

    /* ---- 08 --------------------------------------------------------------- */
    operations: {
        subs: [
            {
                head: 'Tests',
                body: '516 NUnit test methods across 34 files in the API suite, plus a separate suite for the .NET SDK. They cover the parts where being wrong is expensive: `RateLimiterTests`, `BusinessCatalogSyncTests` and `BusinessCatalogFullSyncTests`, `McpServerTests`, `PublicApiRequestLimiterTests`, `OutreachSafetyTests`, `OutreachRetryTests`, `JobFailureClassifierTests`, `WebhookSignatureTests`.',
            },
            {
                head: 'Deploys',
                body: 'GitHub Actions, triggered manually with a target selector, so I choose what ships. The test job runs first. Deployment authenticates to the server by SSH key from a repository secret, never a password.',
            },
            {
                head: 'Runtime',
                body: 'Docker Compose behind Traefik 3.1, with Let’s Encrypt certificates issued automatically and a permanent HTTP to HTTPS redirect per hostname. PostgreSQL 16 in its own container with a health check. A separate health monitor container probes the API from outside the API.',
            },
            {
                head: 'One build detail worth keeping',
                body: 'The API image is Debian, `aspnet:8.0-bookworm-slim`, not Alpine. The native `libduckdb.so` that DuckDB ships is built against glibc and will not load on musl: missing `libstdc++.so.6`, missing `libgcc_s.so.1`, unresolved `std::` symbols. The smaller base image was not an option once the catalogue existed, and the reason is written in the Dockerfile so nobody optimises it back.',
            },
        ],
    },

    /* ---- 09 --------------------------------------------------------------- */
    failures: {
        intro:
            'This is the honest section. Every item below is something I shipped or tried, watched fail in production or in a measured test, and replaced.',
        panelHead: 'Corrections, in the order they cost me time',
        items: [
            {
                lead: 'Reading remote parquet per search.',
                body: 'Pointing DuckDB at the Overture S3 bucket on every user search cost 277 seconds for a single province. Replaced with a full local sync.',
            },
            {
                lead: 'Streaming the spatial join against S3.',
                body: 'The natural next attempt was to keep the data remote and do the filtering in one query, joining `ST_Within` straight against the remote parquet. DuckDB materialises the entire join before it emits a row. It sat at 2.5 GB of RAM and produced zero rows after 15 minutes. Splitting it in two fixed it: download the country inside a bounding box first with no spatial work at all, then join province by province against local data. Each step is bounded and, just as importantly, observable. I could see progress.',
            },
            {
                lead: 'Trusting bounding boxes for province assignment.',
                body: 'Turkish province boxes overlap heavily. Choosing the smallest containing box put central İzmir in Manisa and central Antalya in Burdur. Real point in polygon against the Overture boundary geometry was the only thing that worked.',
            },
            {
                lead: 'Assuming 81 provinces.',
                body: 'Turkey has 81. Overture ships 109 province rows, because Adana, Antalya and Artvin each appear more than once. Without merging, stage two processes those provinces twice and double counts their companies. `ST_Union_Agg` merges geometries per name and the count comes back to 81.',
            },
            {
                lead: 'Assuming company names are valid UTF-8.',
                body: 'Real company names in the dataset carry lone surrogates, usually half an emoji pair left behind by a truncated source record. The Npgsql UTF-8 encoder throws on those and aborts the whole binary `COPY` batch. Truncating a string to a column width can split a valid pair and create the same problem, so sanitising has to run after truncation, not before. Null bytes are dropped outright because Postgres rejects them in text columns.',
            },
            {
                lead: 'Letting a cosmetic feature spend the flood budget.',
                body: 'This is the worst one. The first version of avatar syncing called `Contacts_GetContacts`, `Messages_GetDialogs` and `Contacts_ResolveUsername` once per contact. A 150 contact batch every 15 minutes came to roughly 2,500 `ResolveUsername` calls a day, on the same account the user messages go out through. The account sat permanently inside a flood window and ordinary chat messages started failing with `FLOOD_WAIT_300`. Profile pictures broke the product.',
            },
            {
                lead: 'Fixing that with a per cycle flag.',
                body: 'The first fix was not enough. A per cycle flag reset every fifteen minutes, so the next cycle started fresh, spent its calls, hit the same wall, and Telegram lengthened the penalty each time. Production went from `FLOOD_WAIT_15062`, about 4 hours, to `FLOOD_WAIT_80024`, about 22 hours, in one night. The fix that held was a per account “do not touch until” timestamp kept across cycles.',
            },
            {
                lead: 'Using ResolveUsername as a fallback at all.',
                body: 'Most contacts without avatars reach the CRM from other channels, so their stored username is a phone number, not a handle. Ten hours of production resolved exactly zero of them and earned the account a 22 hour penalty. Removed. Contacts we actually talk to arrive with an id and access hash from their first message, so their avatars still resolve from cache, and whatever gets resolved is written back so the send path never has to resolve it again.',
            },
            {
                lead: 'Reading EntityState.Added in SavedChanges.',
                body: 'Covered in section 07. EF Core has already called `AcceptAllChanges` by then, so the check silently matched nothing and real time message delivery quietly did not happen.',
            },
            {
                lead: 'Building a chat learning prompt in one shot.',
                body: 'The single prompt build silently dropped everything past roughly 28,000 characters. No error, just a model reasoning over a fraction of the input. Replaced with batched windows, newest conversations first, with the merged result and honest coverage statistics reporting which conversations actually made it in.',
            },
            {
                lead: 'Alpine as a base image.',
                body: 'Smaller, and completely incompatible with the glibc linked native library DuckDB ships.',
            },
        ],
        closing:
            'The theme across all of these: ==the failures that cost the most time were the silent ones==. Zero rows, a dropped prompt tail, an event that never fired. Several of the fixes above are really the same fix, which is making the failure visible.',
    },

    /* ---- 10 --------------------------------------------------------------- */
    stack: {
        intro: 'Grouped by what it actually does in this system, not by resume category.',
        rows: [
            ['BACKEND', 'C#, .NET 8 for the API, ASP.NET Core Web API, Entity Framework Core, LINQ, SignalR, Serilog.'],
            ['DATA', 'PostgreSQL 16 with Npgsql, including binary COPY for bulk load. DuckDB with the httpfs and spatial extensions for the Overture pipeline. Redis for rate limit counters and distributed locks. SQLite inside the desktop agent.'],
            ['FRONTEND', 'Next.js 15, React 19, TypeScript, Tailwind CSS, and an in house design system, Solid DS, of semantic tokens plus UI primitives. The landing site is React 18 on Vite, prerendered with Puppeteer. Internationalisation with next-intl.'],
            ['DESKTOP', '.NET 9, Photino.NET with Blazor, plus an Electron build. Windows and macOS releases are built by a matrix GitHub Actions workflow on tag push.'],
            ['AI', 'Anthropic API for the in app assistant, with per turn model routing. OpenAI API for message analysis and lead scoring. A hand written MCP server, JSON-RPC 2.0 over Streamable HTTP with SSE, exposing 62 tools, 21 resources and 15 prompts.'],
            ['INFRASTRUCTURE', 'Docker and Docker Compose, Traefik 3.1, Let’s Encrypt, GitHub Actions with key based SSH deploys, Hetzner Linux server administration, a separate health monitor service.'],
            ['AUTH AND SECURITY', 'JWT with BCrypt password hashing. Workspace scoping verified server side. HMAC signed webhooks. Encrypted API key storage. Security headers middleware. A demo mode that is read only at the middleware layer.'],
            ['TESTING', 'NUnit. 516 test methods in the API suite, plus a separate suite for the .NET SDK.'],
            ['INTEGRATIONS AND SDKS', 'Three SDKs, for .NET, Node and MCP, and four integrations: ikas, WordPress, Zapier and the MCP registry. LemonSqueezy and WeePay for billing, Resend for transactional email, WTelegramClient for MTProto.'],
        ] as [string, string][],
    },

    /* ---- 11 --------------------------------------------------------------- */
    numbers: {
        intro: 'All of it measured on the repository or read out of production logs.',
        rows: [
            ['Business records in the local catalogue', '1,790,000'],
            ['Catalogue lookup, before', '277 s'],
            ['Catalogue lookup, after', '15 ms'],
            ['Failed streaming attempt', '2.5 GB RAM, 0 rows in 15 min'],
            ['Overture province rows against actual provinces', '109 against 81'],
            ['Overture rows with a null region field', 'about 92%'],
            ['Bulk load batch size', '20,000 rows per COPY'],
            ['Hand written C#', '211,066 lines, 686 files'],
            ['TypeScript and React', '305,928 lines, 1,069 .tsx files'],
            ['Tracked files in the repository', '3,770'],
            ['DbSet properties on one DbContext', '168'],
            ['REST controllers', 'over 100'],
            ['Background workers', '17'],
            ['SignalR hubs', '3, 1,223 lines'],
            ['MCP tools, resources, prompts', '62 / 21 / 15'],
            ['MCP implementation size', 'about 8,400 lines'],
            ['NUnit test methods', '516 across 34 files'],
            ['Separately deployed services', '5'],
            ['Default send rate limit', '20 per hour, 10 s apart'],
            ['Worst flood penalty observed', 'FLOOD_WAIT_80024, about 22 h'],
        ] as [string, string][],
    },

    /* ---- 12 --------------------------------------------------------------- */
    links: {
        intro: 'The CRM itself is closed source. These pieces of it are public and MIT licensed.',
        notes: {
            dotnet: '.NET SDK for the CRMSolid API. Typed resources, HMAC and bearer credentials, a retrying rate limit handler, its own NUnit suite.',
            mcp: 'MCP server in TypeScript. It lets AI assistants use the CRM.',
            clipper: 'Chrome extension, published on the Chrome Web Store.',
            site: 'The product itself.',
        },
        disclaimer:
            'Nothing on this page contains a credential, a hostname beyond the public product domain, a customer name, or a private IP. If a number here cannot be checked, write to me and it comes off.',
        allProjects: 'ALL PROJECTS',
        visitSite: 'VISIT CRMSOLID.COM',
    },

    /* ---- the runtime diagram ---------------------------------------------- */
    diagram: {
        title: 'CRMSolid runtime architecture',
        desc:
            'Clients on the left: a browser running the Next.js panel, an AI assistant over MCP, ' +
            'an embedded chat widget, and a desktop agent running on the user machine. All of them ' +
            'reach Traefik, which terminates TLS and routes four hostnames to the landing site, the ' +
            'panel container, the health monitor and the TelegramSimple API. The API is one .NET 8 ' +
            'process holding the REST controllers, the MCP server, the SignalR hubs, seventeen ' +
            'background workers and the EF Core context, so the MCP server and the REST API read the ' +
            'same database. To its right sit Overture Maps parquet on S3, Redis and PostgreSQL 16. ' +
            'The health monitor probes the API from outside the container. The desktop agent talks to ' +
            'Telegram MTProto directly from the user machine, so that connection never leaves the server.',
        bandClients: 'CLIENTS',
        bandEdge: 'EDGE',
        bandServer: 'SERVER',
        browser: 'Browser',
        browserSub: 'Next.js 15 panel',
        assistant: 'AI assistant',
        assistantSub: 'Claude, any MCP client',
        widget: 'Chat widget',
        widgetSub: 'embedded on customer sites',
        desktop: 'Desktop agent',
        desktopSub: 'Photino + Blazor, user machine',
        userIp: 'user’s own IP',
        traefikTls: 'TLS via Let’s Encrypt',
        traefikRedirect: 'HTTP to HTTPS redirect',
        traefikTlsStacked: 'TLS via Let’s Encrypt, HTTP to HTTPS redirect',
        landing: 'Landing',
        landingSub: 'React 18 on Vite, prerendered',
        panel: 'Panel',
        panelSub: 'Next.js 15, its own container',
        health: 'Health monitor',
        healthSub: 'separate container',
        apiSub: '.NET 8, one process, one database',
        rest: 'REST controllers',
        restSub: 'over 100 under Controllers/Api',
        mcp: 'MCP server',
        mcpSub: 'JSON-RPC over Streamable HTTP',
        hubs: 'SignalR hubs',
        hubsSub: 'panel chat, widget, presence',
        workers: '17 background workers',
        workersSub: 'jobs, sequences, catalogue sync',
        context: 'EF Core AppDbContext',
        contextSub: '168 DbSets',
        probes: 'probes',
        overtureSub: 'parquet, pulled with DuckDB',
        redisSub: 'rate limit counters, locks',
        postgresSub: 'its own container',
        postgresSubStacked: 'EF Core with Npgsql binary COPY',
        liveUpdates: 'live updates over SignalR',
        liveUpdatesShort: 'live updates',
    },
};

export type CrmSolidContent = typeof crmsolidEn;
