"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = sendMail;
exports.testMailConnection = testMailConnection;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const transporter = nodemailer_1.default.createTransport({
    host: "send.one.com", // SMTP-server från One.com
    port: 465, // SSL-port
    secure: true, // true för SSL
    auth: {
        user: process.env.EMAIL_USER, // t.ex. info@mplats.se
        pass: process.env.EMAIL_PASS, // lösenordet från kontrollpanelen
    },
});
async function sendMail(to, subject, text, html) {
    const mailOptions = {
        from: `"Mplats Test" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        text,
        html,
    };
    return transporter.sendMail(mailOptions);
}
async function testMailConnection() {
    try {
        await transporter.verify();
        console.log("✅ SMTP-anslutning OK!");
        return true;
    }
    catch (err) {
        console.error("❌ SMTP-anslutning misslyckades:", err);
        return false;
    }
}
