# eguven.dev

Personal site and portfolio. Single-container app: an Express server serves the
Vite-built React SPA **and** the API from the same port, so the frontend talks to
`/api` same-origin — no CORS layer, no second service.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, TypeScript, Vite 7, Tailwind CSS 4, framer-motion |
| Routing | react-router-dom 7 (SPA, server-side fallback to `index.html`) |
| Backend | Express 5, NeDB (blog posts), Nodemailer (contact form) |
| Anti-spam | Cloudflare Turnstile |
| Deploy | Docker multi-stage, Traefik v3.1, Let's Encrypt |

## Routes

- `/` — projects
- `/articles` — writing
- `/contact` — contact form (Turnstile-gated, delivered over SMTP)

`GET /api/posts`, `POST /api/contact`.

## Local development

```bash
npm install
cp server/.env.example server/.env    # fill in SMTP + Turnstile
npm run dev                           # Vite on :5173, API on :5000
```

Vite proxies `/api` to the Express server in dev. In production the same Express
process serves both.

## Production build

```bash
npm run build      # tsc -b && vite build  ->  dist/
npm start          # node server/index.js  ->  serves dist/ + /api
```

## Docker

```bash
docker build -t eguven/site .
docker run -p 8080:8080 --env-file ./secrets.env eguven/site
```

Deployment (DNS, Traefik wiring, rollback) is documented in [DEPLOY.md](./DEPLOY.md).

## Notes

- `server/.env` and `server/data/` are gitignored — secrets live on the server,
  blog data lives in a Docker volume.
- The runtime image installs production dependencies only; every module the
  server imports (`express`, `cors`, `dotenv`, `nedb-promises`, `nodemailer`)
  is a production dependency.
