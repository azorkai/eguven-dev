import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

/* ---------------------------------------------------------------------------
 *  THE CONTACT FORM
 *
 *  Two things went wrong here before and both were silent, which is the worst
 *  way for a contact form to fail: the visitor is told the message was sent,
 *  and nobody ever reads it.
 *
 *  1. The secrets file on the server was the example file, copied verbatim.
 *     SMTP_USER was literally "your-email@gmail.com". Every submission failed
 *     at the transport and the only trace was a line in the container log.
 *  2. Both Turnstile keys were Cloudflare's TEST pair, which always returns
 *     success. The captcha was drawn, solved, verified, and protected nothing.
 *
 *  So this file now refuses to start quietly on placeholder configuration. It
 *  says so at boot, and it says so again in the reply when a submission cannot
 *  be delivered.
 * ------------------------------------------------------------------------- */

/* Cloudflare publishes these for local development. They always pass, so
   finding one in production means the form is unprotected.
   https://developers.cloudflare.com/turnstile/troubleshooting/testing/ */
const TURNSTILE_TEST_KEYS = new Set([
    '1x0000000000000000000000000000000AA',
    '2x0000000000000000000000000000000AA',
    '3x0000000000000000000000000000000AA',
    '1x00000000000000000000AA',
    '2x00000000000000000000AB',
    '3x00000000000000000000FF',
]);

const looksLikePlaceholder = (value) =>
    !value || /your-|example\.com|changeme|placeholder/i.test(value);

/* Shout once, at boot, where it can still be fixed before anyone writes in. */
const bootWarnings = [];
if (looksLikePlaceholder(process.env.SMTP_USER) || looksLikePlaceholder(process.env.SMTP_PASS)) {
    bootWarnings.push('SMTP credentials look like the example file. Mail will not be delivered.');
}
if (looksLikePlaceholder(process.env.EMAIL_TO)) {
    bootWarnings.push('EMAIL_TO is unset or still a placeholder. There is nowhere to deliver to.');
}
if (TURNSTILE_TEST_KEYS.has((process.env.CLOUDFLARE_SECRET_KEY || '').trim())) {
    bootWarnings.push('Turnstile is running on Cloudflare TEST keys. The captcha verifies nothing.');
}
if (bootWarnings.length) {
    console.warn('[contact] ' + bootWarnings.join(' | '));
}

const configured = bootWarnings.length === 0;

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

/* ---- rate limit ----------------------------------------------------------
   A portfolio contact form gets a handful of messages a month, so a Map is
   the right size of tool. Five an hour per address, and the window is a plain
   sliding count rather than anything clever. Cleared opportunistically so the
   Map cannot grow without bound on a long running container. */

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

const rateLimited = (key) => {
    const now = Date.now();
    if (hits.size > 500) {
        for (const [k, stamps] of hits) {
            const live = stamps.filter((t) => now - t < WINDOW_MS);
            if (live.length) hits.set(k, live);
            else hits.delete(k);
        }
    }
    const recent = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
    if (recent.length >= MAX_PER_WINDOW) return true;
    recent.push(now);
    hits.set(key, recent);
    return false;
};

router.post('/', async (req, res) => {
    const { name, email, message, token } = req.body || {};

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }
    if (String(message).length > 5000 || String(name).length > 200) {
        return res.status(400).json({ error: 'That message is longer than this form accepts' });
    }
    if (!token) {
        return res.status(400).json({ error: 'Please complete the captcha' });
    }

    if (rateLimited(req.ip || 'unknown')) {
        return res
            .status(429)
            .json({ error: 'That is a few messages in a short time. Try again in an hour.' });
    }

    /* ---- captcha ---- */
    try {
        const verifyResponse = await fetch(
            'https://challenges.cloudflare.com/turnstile/v0/siteverify',
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    secret: process.env.CLOUDFLARE_SECRET_KEY,
                    response: token,
                    /* Cloudflare scores the challenge against the address that
                       solved it; without this the signal is much weaker. */
                    remoteip: req.ip,
                }),
            }
        );
        const verifyData = await verifyResponse.json();
        if (!verifyData.success) {
            console.warn('[contact] turnstile rejected:', verifyData['error-codes']);
            return res.status(400).json({ error: 'Captcha verification failed. Please try again.' });
        }
    } catch (error) {
        console.error('[contact] turnstile unreachable:', error);
        return res.status(502).json({ error: 'Could not reach the captcha service' });
    }

    /* ---- delivery ----
       Never claim a message was sent when the transport is not configured.
       The visitor gets the email address instead, which is the honest fallback
       and still gets the message through. */
    if (!configured) {
        console.error('[contact] refused to send: ' + bootWarnings.join(' | '));
        return res.status(503).json({
            error: 'The form is not able to send mail right now. Please email contact@eguven.dev directly.',
        });
    }

    /* The envelope is the sending domain; the visitor's address goes in
       Reply-To so hitting reply in the inbox answers them, not the relay. */
    const from = process.env.MAIL_FROM || process.env.SMTP_USER;

    try {
        await transporter.sendMail({
            from: `"${String(name).slice(0, 100)} via eguven.dev" <${from}>`,
            replyTo: email,
            to: process.env.EMAIL_TO,
            subject: `eguven.dev, message from ${name}`,
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
            html:
                `<p><strong>Name:</strong> ${escapeHtml(name)}</p>` +
                `<p><strong>Email:</strong> ${escapeHtml(email)}</p>` +
                `<p><strong>Message:</strong><br/>${escapeHtml(message).replace(/\n/g, '<br/>')}</p>`,
        });
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('[contact] send failed:', error);
        res.status(500).json({
            error: 'The message could not be sent. Please email contact@eguven.dev directly.',
        });
    }
});

/* The visitor's own words go into an HTML mail, so they are escaped rather
   than trusted. Plain text part carries the original untouched. */
function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export default router;
