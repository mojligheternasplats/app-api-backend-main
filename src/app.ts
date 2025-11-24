import express, { Application, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
//import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { errorHandler, notFound } from "./middlewares/error.middleware";

import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/program.routes";
import userRoutes from "./routes/user.routes";
import eventRoutes from "./routes/event.routes";
import newsRoutes from "./routes/news.routes";
import mediaRoutes from "./routes/media.routes";
import partnerRoutes from "./routes/partner.routes";
import contactRoutes from "./routes/contact.routes";
import heroSectionRoutes from "./routes/heroSection.routes";
import eventRegistrationRoutes from "./routes/eventRegistration.routes";
// import { sendMail } from "./utils/mailService";
import authPasswordRoutes from "./routes/authPassword.routes";
import testimonialRoutes from "./routes/testimonial.routes";


dotenv.config();

const app: Application = express();



const allowedOrigins = [
  // Local development
  "http://localhost:5173",
  "http://localhost:9002",
  "http://localhost:9003",

  // Public website
  "https://mplats.se",
  "https://www.mplats.se",

  // Admin Panel
  "https://admin.mplats.se",

  // API domain (🚨 REQUIRED)
  "https://api.mplats.se",

  // Railway domains
  "https://app-api-backend-main-production.up.railway.app",
  "https://app-admin-panel-main-production.up.railway.app",
  "https://app-public-main-production.up.railway.app",
];


app.use(
  cors({
    origin: function (origin, cb) {
      if (!origin || allowedOrigins.includes(origin)) {
        return cb(null, true);
      }
      return cb(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
  })
);

// Handles preflight requests
app.options("*", cors());



//app.use(morgan("combined"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, "../uploads");
const mediaDir = path.join(uploadsDir, "media");
const avatarsDir = path.join(uploadsDir, "avatars");

[uploadsDir, mediaDir, avatarsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Serve uploads with correct headers
app.use("/uploads", express.static(uploadsDir, {
  setHeaders: (res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  },
}));

// mail service


// async function testMail() {
//   try {
//     const info = await sendMail(
//       "elmsgele@gmail.com",
//       "Test från backend",
//       "Hej! Det här är ett testmejl."
//     );
//     console.log("✅ Mail skickat:", info.messageId);
//   } catch (err) {
//     console.error("❌ Mail error:", err);
//   }
// }

// testMail();
// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
// Ignore favicon requests so they don’t hit the error middleware
app.get('/favicon.ico', (req, res) => res.status(204).end());
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// API routes

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/authPassword", authPasswordRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/partners", partnerRoutes);
// ...Forgot Password and Reset Password

// end
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);

app.use("/api/heroSections", heroSectionRoutes);
app.use("/api/testimonials", testimonialRoutes);

app.use("/api/eventAttendance", eventRegistrationRoutes);
// Error handling
app.use(notFound);
app.use(errorHandler);

export default app;

