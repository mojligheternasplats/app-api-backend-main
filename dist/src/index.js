"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        // Test DB connection
        await prisma.$connect();
        console.log("✅ Database connected successfully!");
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
            console.log(`🏥 Health check → /health`);
        });
    }
    catch (error) {
        console.error("❌ Failed to connect to the database:", error);
        process.exit(1); // Stop app if DB fails
    }
}
startServer();
