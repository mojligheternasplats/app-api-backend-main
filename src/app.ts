import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

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
import authPasswordRoutes from "./routes/authPassword.routes";
import testimonialRoutes from "./routes/testimonial.routes";

dotenv.config();

const app: Application = express();
app.set("trust proxy", 1);

const PORT = process.env.PORT || 3000;

/* -----------------------------------
   CORS (Production Safe)
------------------------------------ */
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") ?? [];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

/* -----------------------------------
   Security
------------------------------------ */
app.use(helmet({ crossOriginResourcePolicy: false }));

/* -----------------------------------
   Body Parsers
------------------------------------ */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* -----------------------------------
   Health check
------------------------------------ */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

/* -----------------------------------
   Ignore favicon
------------------------------------ */
app.get("/favicon.ico", (req, res) => res.status(204).end());

/* -----------------------------------
   Base route
------------------------------------ */
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

/* -----------------------------------
   API Routes
------------------------------------ */
app.use("/api/auth", authRoutes);
app.use("/api/auth", authPasswordRoutes);
app.use("/api/users", userRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/media", mediaRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/heroSections", heroSectionRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/eventAttendance", eventRegistrationRoutes);

/* -----------------------------------
   Error Handlers
------------------------------------ */
app.use(notFound);
app.use(errorHandler);

export default app;
