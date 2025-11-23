import app from './app';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🏥 Health check → /health`);
    });

  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); // Stop app if DB fails
  }
}

startServer();
