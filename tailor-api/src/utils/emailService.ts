import nodemailer from "nodemailer";

export type EmailContent = {
  text: string;
  html?: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
};

let transporter: ReturnType<typeof nodemailer.createTransport> | undefined;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });
  }

  return transporter;
};

export const sendEmail = async (
  to: string,
  subject: string,
  content: string | EmailContent,
) => {
  try {
    const message = typeof content === "string" ? { text: content } : content;

    const info = await getTransporter().sendMail({
      from: `TailorPro <${process.env.EMAIL_USER!}>`,
      to,
      subject,
      ...message,
    });

    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};
