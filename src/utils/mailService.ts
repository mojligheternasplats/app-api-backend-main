import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize Resend with your API key from Railway / .env
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  try {
    // 💡 While testing on the free Resend tier, use "onboarding@resend.dev"
    // (Note: On the free tier without a custom domain verified in Resend, 
    // you can only send emails to the email address you registered your Resend account with)
    const data = await resend.emails.send({
      from: "Mplats <onboarding@resend.dev>",
      to: [to],
      subject,
      text,
      html: html || text,
    });

    console.log("✅ Email sent via Resend:", data);
    return data;
  } catch (error) {
    console.error("❌ Resend error:", error);
    throw error;
  }
}