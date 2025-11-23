"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
//import morgan from "morgan";
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const error_middleware_1 = require("./middlewares/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const program_routes_1 = __importDefault(require("./routes/program.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const news_routes_1 = __importDefault(require("./routes/news.routes"));
const media_routes_1 = __importDefault(require("./routes/media.routes"));
const partner_routes_1 = __importDefault(require("./routes/partner.routes"));
const contact_routes_1 = __importDefault(require("./routes/contact.routes"));
const heroSection_routes_1 = __importDefault(require("./routes/heroSection.routes"));
const eventRegistration_routes_1 = __importDefault(require("./routes/eventRegistration.routes"));
// import { sendMail } from "./utils/mailService";
const authPassword_routes_1 = __importDefault(require("./routes/authPassword.routes"));
const testimonial_routes_1 = __importDefault(require("./routes/testimonial.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const allowedOrigins = ['http://localhost:5173', 'http://localhost:9002', 'http://localhost:9003'];
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
//app.use(morgan("combined"));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
// Ensure upload directories exist
const uploadsDir = path_1.default.join(__dirname, "../uploads");
const mediaDir = path_1.default.join(uploadsDir, "media");
const avatarsDir = path_1.default.join(uploadsDir, "avatars");
[uploadsDir, mediaDir, avatarsDir].forEach((dir) => {
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
});
// Serve uploads with correct headers
app.use("/uploads", express_1.default.static(uploadsDir, {
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
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/news", news_routes_1.default);
app.use("/api/media", media_routes_1.default);
app.use("/api/projects", program_routes_1.default);
app.use("/api/partners", partner_routes_1.default);
// ...Forgot Password and Reset Password
app.use("/api/auth", authPassword_routes_1.default);
// end
app.use("/api/events", event_routes_1.default);
app.use("/api/contact", contact_routes_1.default);
app.use("/api/heroSections", heroSection_routes_1.default);
app.use("/api/testimonials", testimonial_routes_1.default);
app.use("/api/eventAttendance", eventRegistration_routes_1.default);
// Error handling
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
exports.default = app;
