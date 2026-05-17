import nodemailer from 'nodemailer';

const emailFrom = process.env.EMAIL_FROM || 'onboarding@resend.dev';
const devEmailRedirect = process.env.DEV_EMAIL_REDIRECT || '';

const smtpOptions = {
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
        user: 'resend',
        pass: process.env.RESEND_API_KEY || ''
    },
    tls: {
        rejectUnauthorized: false
    }
};

export default async function sendEmail({ to, subject, html, from = emailFrom }: any) {
    const actualTo = devEmailRedirect || to;
    const actualSubject = devEmailRedirect ? `[To: ${to}] ${subject}` : subject;
    const transporter = nodemailer.createTransport(smtpOptions as any);
    await transporter.sendMail({ from, to: actualTo, subject: actualSubject, html });
}