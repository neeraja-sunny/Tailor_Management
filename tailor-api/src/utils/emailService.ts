import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, text: string) => {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER!,
        pass: process.env.EMAIL_PASS!,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER!,
      to,
      subject,
      text,
    });

    console.log("Email sent:", info.response);
  } catch (err) {
    console.error("Email error:", err);
    throw err;
  }
};


// export const sendEmail = async (to: string, subject: string, text: string) => {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     port: 587,        // Use 587 for TLS, 465 for SSL
//     secure: false,
//     auth: {
//       user: process.env.EMAIL_USER!,
//       pass: process.env.EMAIL_PASS!,
//     },
//   });

//   await transporter.sendMail({
//     from: process.env.EMAIL_USER!,
//     to,
//     subject,
//     text,
//   });
// };
