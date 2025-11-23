import app from './app';
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const port = process.env.PORT || 8080;

async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");

    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
      console.log(`🏥 Health check → http://localhost:${port}/health`);
    });

  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    process.exit(1); // Stop app if DB fails
  }
}

startServer();
