import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
console.log("🔵 Seed script started...");
dotenv.config();
const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // --- 1. Create Admin User ---
  const adminEmail = process.env.ADMIN_EMAIL || "admin@mplats.se";
  const adminPassword = process.env.ADMIN_PASSWORD || "password123";
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedAdminPassword,
      role: "ADMIN",
      firstName: "Admin",
      lastName: "User",
    },
  });

//   //{
//        "logoUrl": "https://res.cloudinary.com/diy1a9z0r/image/upload/v1762277854/ErasmusLogo_zdzpyo.svg"
http://localhost:3000/api/partners/cmhayog0y0008ub2g8x04gu8s
// }
  console.log(`✅ Admin user ready: ${admin.email}`);

  // --- 2. Create Author Users ---
  const evelyn = await prisma.user.upsert({
    where: { email: "evelyn.reed@example.com" },
    update: {},
    create: {
      email: "evelyn.reed@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "EDITOR",
      firstName: "Evelyn",
      lastName: "Reed",
      avatarUrl: "https://placehold.co/100x100?text=E.R",
    },
  });

  const mark = await prisma.user.upsert({
    where: { email: "mark.chen@example.com" },
    update: {},
    create: {
      email: "mark.chen@example.com",
      password: await bcrypt.hash("password123", 10),
      role: "EDITOR",
      firstName: "Mark",
      lastName: "Chen",
      avatarUrl: "https://placehold.co/100x100?text=M.C",
    },
  });

  console.log("✅ Author users created");

  // --- 3. Seed News ---
  const newsItems = await Promise.all([
    prisma.news.create({
      data: {
        slug: "breakthrough-scalable-data-architectures",
        title: "New Breakthrough in Scalable Data Architectures",
        description: "Our team has published a new paper on resilient and scalable data systems.",
        content:
          "<p>This new research introduces 'Project Hydra' — a self-adjusting data architecture for high resilience...</p>",
        language: "Swedish",
        isPublished: true,
        publishedDate: new Date("2024-07-15T10:00:00Z"),
        createdById: evelyn.id,
        media: {
          create: {
            url: "https://placehold.co/600x400?text=News+1",
            mediaType: "IMAGE",
            title: "Hydra System Diagram",
            altText: "Diagram showing adaptive data systems",
          },
        },
      },
    }),
    prisma.news.create({
      data: {
        slug: "code-for-tomorrow-hackathon-success",
        title: 'Our Annual "Code for Tomorrow" Hackathon Was a Success',
        description: "Over 200 developers joined a 48-hour hackathon for sustainability.",
        content:
          "<p>Developers and designers built impactful solutions at our latest event...</p>",
        language: "Swedish",
        isPublished: true,
        publishedDate: new Date("2024-06-28T14:30:00Z"),
        createdById: mark.id,
        media: {
          create: {
            url: "https://placehold.co/600x400?text=Hackathon",
            mediaType: "IMAGE",
            title: "Hackathon Event",
            altText: "Hackathon participants collaborating",
          },
        },
      },
    }),
  ]);

  console.log("✅ News seeded");

  // --- 4. Seed Events ---
  const events = await Promise.all([
    prisma.event.create({
      data: {
        slug: "summer-camp-ai-machine-learning",
        title: "Summer Camp: AI & Machine Learning",
        description: "An intensive summer camp for high school students.",
        content:
          "<p>Join us for a week of AI exploration with Python, TensorFlow, and more!</p>",
        location: "Main Campus & Online",
        startDate: new Date("2024-08-05T09:00:00Z"),
        endDate: new Date("2024-08-05T11:00:00Z"),
        isPublished: true,
        language: "Swedish",
        createdById: admin.id,
        media: {
          create: {
            url: "https://placehold.co/600x400?text=AI+Camp",
            mediaType: "IMAGE",
            title: "AI Camp Workshop",
            altText: "Students learning AI concepts",
          },
        },
      },
    }),
    prisma.event.create({
      data: {
        slug: "erasmus-info-session-opportunities-abroad",
        title: "Erasmus+ Info Session: Opportunities Abroad",
        description: "Learn about study and research opportunities abroad.",
        content:
          "<p>Attend our info session on Erasmus+ international programs...</p>",
        location: "Virtual Event",
        startDate: new Date("2024-09-12T15:00:00Z"),
        endDate: new Date("2024-09-12T17:00:00Z"),
        isPublished: true,
        language: "Swedish",
        createdById: admin.id,
        media: {
          create: {
            url: "https://placehold.co/600x400?text=Erasmus",
            mediaType: "IMAGE",
            title: "Erasmus Info Session",
            altText: "Students attending online info session",
          },
        },
      },
    }),
  ]);

  console.log("✅ Events seeded");

  // --- 5. Seed Projects ---
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        slug: "project-hydra-adaptive-systems",
        title: "Project Hydra: Adaptive Data Systems",
        description: "Research on building self-healing distributed systems.",
        content:
          "<p>Project Hydra is exploring machine learning to enhance data resilience...</p>",
        language: "Swedish",
        isPublished: true,
        createdById: evelyn.id,
        media: {
          create: {
            url: "https://placehold.co/600x400?text=Hydra+Project",
            mediaType: "IMAGE",
            title: "Hydra Research Visualization",
            altText: "Adaptive system visualization",
          },
        },
      },
    }),
    prisma.project.create({
      data: {
        slug: "future-narrative-data-storytelling",
        title: "Future Narrative: Data Storytelling Platform",
        description: "Open-source data storytelling tools for journalists.",
        content:
          "<p>Developing interactive tools to help communicate data insights effectively...</p>",
        language: "Swedish",
        isPublished: true,
        createdById: mark.id,
        media: {
          create: {
            url: "https://placehold.co/600x400?text=Data+Storytelling",
            mediaType: "IMAGE",
            title: "Data Storytelling Platform",
            altText: "Interactive data visualization",
          },
        },
      },
    }),
  ]);

  console.log("✅ Projects seeded");

  // --- 6. Seed Partners ---
  await prisma.partner.createMany({
    data: [
      {
        slug: "innovate-corp",
        name: "Innovate Corp",
        website: "https://innovate.example.com",
        description: "Collaborative partner in AI and innovation.",
        type: "COLLABORATOR",
        isPublished: true,
        language: "Swedish",
      },
      {
        slug: "quantumleap-inc",
        name: "QuantumLeap Inc.",
        website: "https://quantumleap.example.com",
        description: "Research partner for quantum computing initiatives.",
        type: "COLLABORATOR",
        isPublished: true,
        language: "Swedish",
      },
    ],
  });

  console.log("✅ Partners seeded");

  // --- 7. Additional Media ---
  await prisma.media.createMany({
    data: [
      {
        url: "https://placehold.co/600x400?text=Extra+Media+1",
        mediaType: "IMAGE",
        title: "Extra Placeholder",
        description: "Generic placeholder image for testing",
        altText: "Placeholder image",
      },
      {
        url: "https://placehold.co/600x400?text=Extra+Media+2",
        mediaType: "IMAGE",
        title: "Another Placeholder",
        description: "Another placeholder for API testing",
        altText: "Placeholder",
      },
    ],
  });

  console.log("✅ Media seeded");
  console.log("🎉 All data seeded successfully!");
}

// Run the seed
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seed failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
