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

  const body: any = {
    sender: {
      name: "TailorPro",
      email: process.env.EMAIL_FROM!,
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
        "api-key": process.env.BREVO_API_KEY!,
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