
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import contactRoutes from './routes/contact.js';
import blogRoutes from './routes/blog.js';

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

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
