# CRMSolid, image inventory

> **Superseded, 2026-08-28.** The four images described below were removed from
> `public/projects/crmsolid/`. A cleaner marketing set, shot against demo data, was
> found at `C:\xampp\htdocs\funnel_media\marketing\`, and the page now ships:
>
> | File in `public/projects/crmsolid/` | Source | Placed in |
> |---|---|---|
> | `panel-inbox.png` | `marketing/screenshots/light/02-inbox.png` | 01, The problem |
> | `panel-pipeline.png` | `marketing/screenshots/light/03-pipelines.png` | 02, Architecture |
> | `mcp-package.png` | `marketing/github/crmsolid-mcp.png` | 04, The MCP server |
> | `panel-ai-agents.png` | `marketing/screenshots/light/04-ai-agents.png` | 07, Live updates |
>
> All four were opened and checked: demo workspace ("Alex Morgan"), invented
> contacts, no real customer data, no phone numbers, no secrets. Each was
> flattened to RGB, resized to at most 1600px wide and reduced to a 256 colour
> palette. Alt text and captions are written inline in `src/pages/CrmSolid.tsx`.
> The security note at the bottom of this file still stands.


Source folder reviewed: `C:\Users\eguve\Desktop\CRMSolid` (root, `inappimages/`, `debug/`).
Every candidate was opened and looked at. Files that show third party contact data, phone
numbers, or account secrets were **not** copied.

Shipped files live in `public/projects/crmsolid/` and are referenced from the page as
`/projects/crmsolid/<file>`.

---

## Selected

### `panel-social-scheduler.png`

- **Source:** `CRMSolid/crm_p.png`
- **Processing:** flattened to RGB, resized 1912 to 1600 wide, 256 colour palette. 180 KB to 69 KB.
- **Shows:** The real product panel, Social Scheduler view. Full navigation sidebar (Accounts,
  Scrapers, Templates, Integrations, Contacts, Broadcasting, Social Scheduler, Sequences, Jobs,
  Live Chat, AI Bots, Analytics, Changelog, Billing, API Docs, Settings), four stat cards, an
  accounts-by-platform breakdown and a queue of upcoming posts.
- **Privacy:** Clean. The only personal name is the owner's own. The queued posts are the owner's
  own Turkish aphorisms, no third party content.
- **alt:** "CRMSolid admin panel showing the social scheduler dashboard with connected account
  counts, published and failed post totals, and a list of queued posts."
- **caption:** "The panel. Sixteen product areas in one Next.js app, all of it on a shared design
  system of semantic tokens and UI primitives."
- **Placement:** Section 3, Architecture. This is the best single "the product is real and it is
  large" image in the set.

### `landing-hero.png`

- **Source:** `CRMSolid/inappimages/website_ main.png`
- **Processing:** flattened to RGB, cropped to the browser window (the grainy decorative gradient
  border was most of the file weight), true colour PNG. 918 KB to 191 KB. Quantization was tried
  and rejected: it shifted the macOS traffic light dots and the pipeline progress bars off-hue.
- **Shows:** The live marketing site in a browser frame.
- **Privacy:** Clean. No data of any kind on screen.
- **alt:** "The CRMSolid marketing site in a browser window, showing the product headline and
  navigation."
- **caption:** "crmsolid.com. React 18 on Vite, prerendered with Puppeteer, served by Traefik with
  an automatically issued Let's Encrypt certificate."
- **Placement:** Section 1 hero, or section 8 next to the links.
- **Note:** The copy in this image ("The Future of Telegram CRM") is marketing voice and does not
  match the page's engineering voice. It is fine as a small framed thumbnail. Do not make it the
  full-width hero.

### `sequence-canvas.png`

- **Source:** `CRMSolid/m3.png`
- **Processing:** flattened to RGB, true colour PNG optimize (has purple gradients that band under
  quantization). 206 KB to 159 KB. Already under 1600 wide, not resized.
- **Shows:** A product illustration of the outreach sequence builder: a running sequence with an
  introduction step, a two day wait, and a value-add step, feeding into the CRM pipeline.
- **Privacy:** Clean. The one name shown ("Mike VC") is fictional marketing copy.
- **alt:** "Illustration of an outreach sequence: an introduction message, a two day wait, then a
  follow up, all feeding into the CRM pipeline."
- **caption:** "Sequences run on a background worker that polls every few seconds. Every send is
  checked against the account's remaining flood budget before it goes out."
- **Placement:** Section 4.4, next to the rate limiting deep dive. Use it as a diagram, not as a
  hero. It is a marketing render, so keep it small and let the caption do the technical work.

### `brand-mark.png`

- **Source:** `CRMSolid/1.png`
- **Processing:** flattened to RGB, 256 colour palette. 13 KB to 6 KB. Not resized (617x359).
- **Shows:** Logo and brand colour swatches.
- **Privacy:** Clean.
- **alt:** "CRMSolid logo with its brand colour palette."
- **caption:** "Brand mark."
- **Placement:** Optional. A small logo in the page header or in the links block. Lowest priority
  of the four.

---

## Rejected, and why

### Contains third party personal data (do not publish without masking)

| File | Problem |
|---|---|
| `crm.png` | Pipeline board with 13 contact cards. Real-looking personal names and Telegram handles across several columns. This is otherwise the single best screenshot in the whole set, a full seven stage pipeline with real content in it. **Needs masking, or better, a re-shoot against demo data.** |
| `crm_c.png` | Pipeline board, much cleaner (most cards are anonymous "Visitor" records). One card carries a real personal name and handle. **One card needs masking.** Second best candidate after a re-shoot. |
| `inappimages/pipeline.png` | Pipeline board with three real Telegram handles and partial names. |
| `inappimages/Mockup 01.png` | Same pipeline board as above, inside a browser mockup. Same handles. |
| `inappimages/Mockup 01 (1).png` | Dashboard in a browser mockup. A full phone number appears repeatedly in the Recent Activity feed. |
| `inappimages/screencapture-app-crmsolid-2025-09-30-14_50_11.png` | Full dashboard. A phone number repeated eight times, plus a list of third party target usernames and message excerpts. |
| `accounts.png` | Connected accounts page. Shows a full phone number and a social handle. |
| `scrapers.png` | Shows a full phone number and a third party Telegram group. Also framed as "automate member extraction from Telegram groups", which is the exact positioning to keep off a page aimed at employers. |

### Contains a live secret, delete this file

| File | Problem |
|---|---|
| `Screenshot_1.png` | **Two factor authentication backup codes for a billing provider account, in plain text, fully legible.** Not usable in any form. See the note at the bottom of this file. |

### Rejected on content grounds, not privacy

| File | Reason |
|---|---|
| `m1.png` (2.5 MB) | Marketing hero. Has "99.9% Uptime" and "The #1 AI-Powered Telegram CRM" baked into the image. The career audit specifically calls the uptime claim unverifiable and recommends removing it from the CV and the site. Putting it back as a picture undoes that. |
| `m2.png` | Marketing hero. "THE #1 TELEGRAM CRM AUTOMATION" and the tagline "Scrape, Outreach, and Sell locally". Both the superlative and the word "scrape" are risky on a page whose audience is hiring managers. |
| `inappimages/mainwebsitefull.png` (1920x8797) | Full page capture. Genuinely useful as a "look at the scope of what shipped" artifact: features, pricing tiers, FAQ, contact, changelog and roadmap. But the middle band is fabricated social proof, three invented testimonials with photos plus "4.9/5 rating", "500+ reviews", "Trusted by 5,000+ users". Publishing invented testimonials on a portfolio is a bigger risk than the image is worth. **Usable if cropped above the testimonial band.** I did not crop it, since that is a content decision. |
| `debug/*.png` | Debugging screenshots as expected. Not presentable. Two are named in Turkish after things going wrong. |

---

## Recommendation: re-shoot the product screenshots

The strongest images in the folder are all pipeline and dashboard views, and all of them are blocked
by the same thing, which is real contact data. This is a solved problem in the codebase already.

`TelegramSimple/Services/` contains a 16 file `DemoDataSeeder` (`.Crm`, `.Sales`, `.Outreach`,
`.Finance`, `.Email`, `.LiveChat`, `.Scrapers`, `.SocialScheduler`, `.Visitors`, `.AiAgents` and more)
that populates the whole product with realistic fictional data, and a `DemoReadOnlyMiddleware` that
runs the app in demo mode. Seed a demo workspace, take four screenshots, and the page gets a clean,
fuller and more attractive image set than anything in the folder, with no masking needed.

Shots worth taking, in priority order:

1. The pipeline board, full seven stages with deals in several of them. This is the shot the page
   most wants and currently cannot have.
2. The dashboard with populated activity and charts.
3. The MCP tools list or the API docs page. Nothing in the folder shows the MCP server, which is the
   most distinctive thing in the project.
4. A business catalogue search returning results, which is the visual proof of section 4.1. Also
   completely missing from the folder.

---

## Security note, act on this first

`C:\Users\eguve\Desktop\CRMSolid\Screenshot_1.png` shows plaintext two factor backup codes for a
billing provider account. Regenerate those codes and delete the file.

Separately, and outside this folder: the private repository still carries a plaintext server password
in `README.md` and `Scripts/HIZLI-DEPLOY.md`, which the career audit already flagged as the highest
risk open item. There is also a real phone number sitting in a source code comment in
`TelegramSimple/Services/AvatarSyncService.cs`.
