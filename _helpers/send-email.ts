const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const devEmailRedirect = process.env.DEV_EMAIL_REDIRECT || '';

export default async function sendEmail({ to, subject, html, from = emailFrom }: any) {
    const actualTo = devEmailRedirect || to;
    const actualSubject = devEmailRedirect ? `[To: ${to}] ${subject}` : subject;

    const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: from,
            to: actualTo,
            subject: actualSubject,
            html: html
        })
    });

    if (!response.ok) {
        const error = await response.text();
        console.log('Resend API error:', error);
        throw new Error(`Email send failed: ${error}`);
    }
}