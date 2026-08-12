import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  html?: string
) {
  try {
    const response = await resend.emails.send({
      from: "Mplats <noreply@mplats.se>",
      to: [to],
      subject,
      text,
      html: html || text,
    });

    // Resend SDK returns { data, error } instead of always throwing an exception
    if (response.error) {
      console.error("❌ Resend API Returned Error:", response.error);
      throw new Error(response.error.message);
    }

    console.log("✅ Email sent via Resend:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Resend error:", error);
    throw error;
  }
}