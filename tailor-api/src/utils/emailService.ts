export type EmailContent = {
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
};

export const sendEmail = async (
  to: string,
  subject: string,
  content: string | EmailContent
) => {
  const message =
    typeof content === "string"
      ? { text: content }
      : content;

  const brevoApiKey = process.env.BREVO_API_KEY?.trim();
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.replace(/\s/g, "");
  const emailFrom = process.env.EMAIL_FROM?.trim() || emailUser;

  if (!emailFrom) {
    throw new Error("EMAIL_FROM or EMAIL_USER must be configured");
  }

  if (!brevoApiKey) {
    if (!emailUser || !emailPass) {
      throw new Error("Configure BREVO_API_KEY or EMAIL_USER and EMAIL_PASS");
    }

    // Nodemailer does not currently ship TypeScript declarations.
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const nodemailer: any = require("nodemailer");
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });

    await transporter.sendMail({
      from: `"TailorPro" <${emailFrom}>`,
      to,
      subject,
      text: message.text,
      html: message.html,
      attachments: message.attachments?.map((attachment) => ({
        filename: attachment.filename,
        content: attachment.content,
        contentType: attachment.contentType,
      })),
    });

    console.log("Email sent successfully with Gmail SMTP");
    return;
  }

  const body: any = {
    sender: {
      name: "TailorPro",
      email: emailFrom,
    },
    to: [
      {
        email: to,
      },
    ],
    subject,
  };

  if (message.text) {
    body.textContent = message.text;
  }

  if (message.html) {
    body.htmlContent = message.html;
  }

  if (message.attachments?.length) {
    body.attachment = message.attachments.map((a) => ({
      name: a.filename,
      content: a.content.toString("base64"),
    }));
  }

  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": brevoApiKey,
      },
      body: JSON.stringify(body),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    console.error("Brevo Error:", error);
    throw new Error(error);
  }

  console.log("Email sent successfully");
}
