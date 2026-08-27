
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

router.post('/', async (req, res) => {
    const { name, email, message, token } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ error: 'Please fill in all fields' });
    }

    if (!token) {
        return res.status(400).json({ error: 'Turnstile token is missing' });
    }

    // Verify Turnstile Token
    try {
        const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                secret: process.env.CLOUDFLARE_SECRET_KEY,
                response: token,
            }),
        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.success) {
            return res.status(400).json({ error: 'Captcha verification failed' });
        }
    } catch (error) {
        console.error('Turnstile verification error:', error);
        return res.status(500).json({ error: 'Captcha verification error' });
    }

    const mailOptions = {
        from: `"${name}" <${process.env.SMTP_USER}>`,
        replyTo: email,
        to: process.env.EMAIL_TO,
        subject: `New Contact Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        html: `<p><strong>Name:</strong> ${name}</p>
           <p><strong>Email:</strong> ${email}</p>
           <p><strong>Message:</strong><br/>${message}</p>`,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: 'Failed to send email' });
    }
});

export default router;
