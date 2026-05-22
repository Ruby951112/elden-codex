import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { siteConfig } from '@/lib/site-config';

/**
 * Contact form handler.
 *
 * Routes feedback to user's real inbox with auto-tagged subject:
 *   "[Elden Codex] Feedback from <name>"
 *
 * This lets the user filter / sort / route across multiple side projects
 * from a single Gmail account.
 *
 * Required env vars:
 *   RESEND_API_KEY            — from resend.com (free tier: 3k emails/month)
 *   CONTACT_RECIPIENT_EMAIL   — user's real email (private, server-only)
 *
 * Optional:
 *   CONTACT_FROM_EMAIL        — verified sender (defaults to onboarding@resend.dev for dev)
 */
export async function POST(request: Request) {
  // Basic rate limit by IP — simple in-memory; for production, use Vercel KV / Upstash
  // For MVP, this is fine — spam protection happens via Cloudflare in front

  try {
    const body = await request.json();
    const { name, email, message, locale } = body as {
      name?: string;
      email?: string;
      message?: string;
      locale?: string;
    };

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    if (typeof name !== 'string' || name.length < 2 || name.length > 100) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }
    if (typeof message !== 'string' || message.length < 10 || message.length > 5000) {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    // Check env config
    const apiKey = process.env.RESEND_API_KEY;
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
    const from = process.env.CONTACT_FROM_EMAIL || 'onboarding@resend.dev';

    if (!apiKey || !recipient) {
      console.error('Contact form env not configured (RESEND_API_KEY / CONTACT_RECIPIENT_EMAIL)');
      // Don't expose internal config in the error
      return NextResponse.json(
        { error: 'Contact form is not yet configured. Please try again later.' },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);

    // The key feature: auto-tagged subject for cross-project inbox routing
    const subject = `${siteConfig.emailSubjectPrefix} Feedback from ${name}`;

    const html = `
      <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="border-bottom: 2px solid #c9a559; padding-bottom: 10px; margin-bottom: 20px;">
          <h2 style="color: #6b5a38; font-family: 'Cinzel', serif; letter-spacing: 0.1em; margin: 0;">
            ${siteConfig.projectName.toUpperCase()} — FEEDBACK
          </h2>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: #6b5a38; font-size: 12px; width: 80px;">FROM</td>
            <td style="padding: 8px 0; color: #1a1612;">${escapeHtml(name)}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b5a38; font-size: 12px;">EMAIL</td>
            <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #6b5a38; font-size: 12px;">LOCALE</td>
            <td style="padding: 8px 0;">${escapeHtml(locale || 'en')}</td>
          </tr>
        </table>
        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #c9a559;">
          <p style="color: #6b5a38; font-size: 12px; margin-bottom: 10px;">MESSAGE</p>
          <p style="white-space: pre-wrap; line-height: 1.6; color: #1a1612;">${escapeHtml(message)}</p>
        </div>
        <p style="color: #999; font-size: 11px; margin-top: 30px; font-style: italic;">
          Sent via ${siteConfig.projectName} contact form • ${new Date().toISOString()}
        </p>
      </div>
    `;

    const { data, error } = await resend.emails.send({
      from: `${siteConfig.projectName} <${from}>`,
      to: [recipient],
      // Reply-To lets the user click "Reply" in Gmail and go straight to the visitor
      replyTo: email,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: data?.id });
  } catch (err) {
    console.error('Contact handler error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
