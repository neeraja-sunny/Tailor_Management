import type { EmailContent } from "./emailService";

const escapeHtml = (value: string) =>
  value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character] || character);

const emailLayout = (title: string, body: string) => `
<!doctype html>
<html lang="en">
  <body style="margin:0;background:#f4f7f5;font-family:Arial,sans-serif;color:#1f2937">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="padding:32px 16px;background:#f4f7f5">
      <tr><td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:600px;background:#ffffff;border:1px solid #dfe7e2">
          <tr><td style="padding:22px 32px;background:#047857;color:#ffffff;font-size:22px;font-weight:700">TailorPro</td></tr>
          <tr><td style="padding:32px">
            <h1 style="margin:0 0 18px;font-size:24px;line-height:1.3;color:#111827">${title}</h1>
            ${body}
          </td></tr>
          <tr><td style="padding:20px 32px;border-top:1px solid #e5e7eb;color:#6b7280;font-size:12px;line-height:1.6">
            This is an automated email from TailorPro. If you did not expect this message, you can safely ignore it.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

const purposeCopy = {
  login: { title: "Your sign-in code", action: "sign in to your TailorPro account" },
  signup: { title: "Verify your email address", action: "finish creating your TailorPro account" },
  "password-reset": { title: "Reset your password", action: "reset your TailorPro password" },
};

export const buildOtpEmail = (
  otp: string,
  purpose: "login" | "signup" | "password-reset",
): EmailContent => {
  const copy = purposeCopy[purpose];
  return {
    text: `${copy.title}\n\nUse ${otp} to ${copy.action}. This code expires in 5 minutes.\n\nIf you did not request this code, you can safely ignore this email. Never share this code with anyone.`,
    html: emailLayout(copy.title, `
      <p style="margin:0 0 20px;line-height:1.7">Use the verification code below to ${copy.action}.</p>
      <div style="margin:24px 0;padding:18px;text-align:center;background:#ecfdf5;border:1px solid #a7f3d0;color:#065f46;font-size:32px;font-weight:700;letter-spacing:8px">${otp}</div>
      <p style="margin:0 0 12px;line-height:1.7"><strong>This code expires in 5 minutes.</strong></p>
      <p style="margin:0;color:#6b7280;line-height:1.7">If you did not request this code, you can safely ignore this email.</p>
    `),
  };
};

export const buildWelcomeEmail = (firstName: string, businessName: string): EmailContent => {
  const safeName = escapeHtml(firstName);
  const safeBusinessName = escapeHtml(businessName);
  return {
    text: `Welcome to TailorPro, ${firstName}!\n\nThank you for creating an account for ${businessName}. Your email is verified and your workspace is ready.\n\nYou can now add customers, create orders, record measurements and payments, and track trial and delivery dates.\n\nWe are glad to have you with us.`,
    html: emailLayout(`Welcome to TailorPro, ${safeName}!`, `
      <p style="margin:0 0 16px;line-height:1.7">Thank you for creating an account for <strong>${safeBusinessName}</strong>. Your email is verified and your workspace is ready.</p>
      <p style="margin:0 0 12px;line-height:1.7">You can now:</p>
      <ul style="margin:0 0 20px;padding-left:20px;line-height:1.9">
        <li>Add and manage customers</li>
        <li>Create orders and record measurements</li>
        <li>Track payments and outstanding balances</li>
        <li>Keep up with trial and delivery dates</li>
      </ul>
      <p style="margin:0;line-height:1.7">We are glad to have you with us.<br><strong>The TailorPro team</strong></p>
    `),
  };
};
