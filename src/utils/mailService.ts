import nodemailer, { SentMessageInfo } from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: "send.one.com", // SMTP-server från One.com
  port: 465,            // SSL-port
  secure: true,         // true för SSL
  auth: {
    user: process.env.EMAIL_USER, // t.ex. info@mplats.se
    pass: process.env.EMAIL_PASS, // lösenordet från kontrollpanelen
  },
});

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<SentMessageInfo> {
  const mailOptions = {
    from: `"Mplats Test" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  };

  return transporter.sendMail(mailOptions);
}

export async function testMailConnection(): Promise<boolean> {
  try {
    await transporter.verify();
    console.log("✅ SMTP-anslutning OK!");
    return true;
  } catch (err) {
    console.error("❌ SMTP-anslutning misslyckades:", err);
    return false;
  }
}