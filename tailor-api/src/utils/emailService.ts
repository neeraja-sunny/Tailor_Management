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
    console.log("========== EMAIL DEBUG ==========");
    console.log({
      EMAIL_USER: process.env.EMAIL_USER,
      EMAIL_PASS_EXISTS: !!process.env.EMAIL_PASS,
      EMAIL_PASS_LENGTH: process.env.EMAIL_PASS?.length,
      NODE_ENV: process.env.NODE_ENV,
    });
    console.log("===============================");

    transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  family: 4,
  logger: true,
  debug: true,
  connectionTimeout: 30000,
  greetingTimeout: 30000,
  socketTimeout: 30000,
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
    console.log("\n========== SEND EMAIL ==========");
    console.log({
      to,
      subject,
      time: new Date().toISOString(),
    });

    const message = typeof content === "string" ? { text: content } : content;

    const transporter = getTransporter();

    console.log("Verifying SMTP connection...");

    await transporter.verify();

    console.log("✅ SMTP verification successful");

    console.log("Sending email...");

    const smtp = getTransporter();

console.log("Verifying SMTP...");
await smtp.verify();
console.log("SMTP verified.");

const info = await smtp.sendMail({
  from: `TailorPro <${process.env.EMAIL_USER}>`,
  to,
  subject,
  ...message,
});

    console.log("✅ Email sent successfully");
    console.log(info);

    return info;
  } catch (err) {
    console.error("❌ EMAIL ERROR");
    console.error(err);

    if (err instanceof Error) {
      console.error("Message:", err.message);
      console.error("Stack:", err.stack);
    }

    console.error("Full error object:");
    console.dir(err, { depth: null });

    throw err;
  }
};