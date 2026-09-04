
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.js';
import blogRoutes from './routes/blog.js';
import legalRoutes from './routes/legal.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

/* One hop, and it is Traefik on the same host. Without this every request
   reads as coming from the proxy, which would put the whole internet in one
   rate limit bucket and hand Turnstile the wrong address to score. */
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json({ limit: '64kb' }));

/* Public front-end configuration.
   The Turnstile site key is not a secret, it ships in the page either way.
   Serving it from here rather than baking it into the bundle means rotating
   the key is an env change and a restart, not a rebuild and a redeploy. */
app.get('/api/config', (req, res) => {
    res.set('Cache-Control', 'no-store');
    res.json({ turnstileSiteKey: process.env.CLOUDFLARE_SITE_KEY || '' });
});

app.use('/api/contact', contactRoutes);
app.use('/api/posts', blogRoutes);

/* Mobil uygulamaların yasal belgeleri. SPA kabuğundan ÖNCE bağlanır: aşağıdaki
   `/*splat` her adresi React'e yollar ve buradaki tam HTML hiç çalışmazdı.
   Bu sayfalar JavaScript'siz okunabilir olmak zorunda, çünkü mağazaların
   gizlilik politikası denetimi ve bağlantı sağlık kontrolleri de tıpkı sosyal
   kart crawler'ları gibi JS çalıştırmıyor. */
app.use(legalRoutes);

/* Serve the built assets, but never index.html: with the default `index`
   behaviour a request for / is answered here, straight off disk, and never
   reaches the handler below that writes the social card tags. The front page
   is the most shared address on the site, so it is the one that must not slip
   past. Every path now ends at the same place. */
app.use(express.static(path.join(__dirname, '../dist'), { index: false }));

/* ---------------------------------------------------------------------------
 *  SOCIAL CARDS
 *
 *  A crawler from LinkedIn, Slack or X reads the HTML it is given and stops.
 *  It runs no JavaScript, so a single page app that writes its own meta tags
 *  in React has, as far as every one of them is concerned, no meta tags at
 *  all: the link renders as a bare URL. The head has to be right in the
 *  response, which means here.
 *
 *  Titles and descriptions are in English on purpose. This is the shared
 *  document that a link preview is built from, and the site's default
 *  edition is English; the reader's own language is applied by React a
 *  moment later, in the page they actually see.
 * ------------------------------------------------------------------------- */

const SITE = 'https://eguven.dev';
const OG_IMAGE = `${SITE}/og-default.png`;

const CARDS = {
    '/': {
        title: 'Emirhan Güven, full stack developer',
        description:
            'Systems I designed, wrote and still run. A live SaaS CRM on .NET and PostgreSQL, a multi-tenant hosting platform, and a 1.79 million row business catalogue that answers in 15 milliseconds.',
    },
    '/projects/crmsolid': {
        title: 'CRMSolid, a case study',
        description:
            'A multi-tenant SaaS CRM written and run by one person. Five separately deployed services, a modular monolith rather than microservices, 516 NUnit tests, and a catalogue query taken from 277 seconds to 15 milliseconds.',
    },
    '/projects/playersells': {
        title: 'PlayerSells, a case study',
        description:
            'Percentile ranks across five networks, 25 free tools behind one gate, and an insight engine. The ranking query takes 12 to 44 seconds and the timeout is 15, so the page never runs it.',
    },
    '/articles': {
        title: 'The Log, notes from production',
        description:
            'Notes from building and running production software on .NET and React. Query tuning, deployment, and the parts that broke before they worked.',
    },
    '/contact': {
        title: 'Contact, Emirhan Güven',
        description:
            'Full stack developer in Istanbul. Open to full time roles, on site, hybrid or remote, and to project work.',
    },
    '/ai': {
        title: 'The Machine Edition',
        description:
            'The same information as the rest of this site, set for whatever is reading it on your behalf. Structured, dense and checkable.',
    },
};

const escapeAttr = (value) =>
    String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

const cardFor = (pathname) => CARDS[pathname.replace(/\/+$/, '') || '/'] || CARDS['/'];

/* Read once. The file only changes on deploy, and a deploy restarts this. */
const shell = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf8');

const sendShell = (req, res) => {
    const card = cardFor(req.path);
    const url = SITE + (req.path === '/' ? '/' : req.path.replace(/\/+$/, ''));
    const tags = [
        `<meta property="og:type" content="website" />`,
        `<meta property="og:site_name" content="eguven.dev" />`,
        `<meta property="og:url" content="${escapeAttr(url)}" />`,
        `<meta property="og:title" content="${escapeAttr(card.title)}" />`,
        `<meta property="og:description" content="${escapeAttr(card.description)}" />`,
        `<meta property="og:image" content="${OG_IMAGE}" />`,
        `<meta property="og:image:width" content="1200" />`,
        `<meta property="og:image:height" content="630" />`,
        `<meta property="og:image:alt" content="Emirhan Güven, full stack developer, .NET and React" />`,
        `<meta name="twitter:card" content="summary_large_image" />`,
        `<meta name="twitter:creator" content="@e_guvenn" />`,
        `<meta name="twitter:title" content="${escapeAttr(card.title)}" />`,
        `<meta name="twitter:description" content="${escapeAttr(card.description)}" />`,
        `<meta name="twitter:image" content="${OG_IMAGE}" />`,
        `<link rel="canonical" href="${escapeAttr(url)}" />`,
    ].join('\n  ');

    res.type('html').send(shell.replace('</head>', `  ${tags}\n</head>`));
};

/* Both, deliberately. In Express 5 `/*splat` requires at least one segment,
   so it does not match the bare root; with express.static no longer serving
   index.html, registering only the wildcard leaves the front page answering
   404. The two routes together cover every address. */
app.get('/', sendShell);
app.get('/*splat', sendShell);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
