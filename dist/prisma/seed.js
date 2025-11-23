"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("🌱 Seeding database...");
    // ---- User ----
    const passwordHash = await bcrypt_1.default.hash("password123", 10);
    const user = await prisma.user.create({
        data: {
            email: "admin@example.com",
            password: passwordHash,
            role: client_1.UserRole.ADMIN,
            firstName: "Admin",
            lastName: "User",
        },
    });
    console.log("✔ User created");
    // ---- Event ----
    const event = await prisma.event.create({
        data: {
            slug: "sample-event",
            title: "Sample Event",
            description: "This is a demo event.",
            content: "Event content here...",
            startDate: new Date(),
            location: "Stockholm",
            isPublished: true,
            language: "Swedish",
            createdById: user.id,
            openForRegistration: true,
        },
    });
    console.log("✔ Event created");
    // ---- News ----
    const news = await prisma.news.create({
        data: {
            slug: "sample-news",
            title: "Sample News",
            description: "Demo news description",
            content: "News content...",
            createdById: user.id,
            publishedDate: new Date(),
            isPublished: true,
            language: "Swedish",
        },
    });
    console.log("✔ News created");
    // ---- Project ----
    const project = await prisma.project.create({
        data: {
            slug: "sample-project",
            title: "Sample Project",
            description: "Demo project description",
            content: "Project details...",
            category: client_1.ProjectCategory.LOCAL,
            isPublished: true,
            createdById: user.id,
            language: "Swedish",
        },
    });
    console.log("✔ Project created");
    // ---- Partner ----
    const partner = await prisma.partner.create({
        data: {
            slug: "sample-partner",
            name: "Sample Partner Org",
            type: client_1.PartnerType.COLLABORATOR,
            isPublished: true,
            description: "This is a sample partner.",
            language: "Swedish",
        },
    });
    console.log("✔ Partner created");
    // ---- Hero Section ----
    await prisma.heroSection.create({
        data: {
            page: "home",
            title: "Welcome to Möjligheternas Plats",
            subtitle: "A place where youth grow and thrive.",
            buttonText: "Learn More",
            buttonLink: "/about",
            language: "Swedish",
            status: client_1.HeroStatus.PUBLISHED,
        },
    });
    console.log("✔ Hero Section created");
    // ---- Youth Testimonial ----
    await prisma.youthTestimonial.create({
        data: {
            name: "Ali",
            age: 16,
            message: "This program changed my life!",
            program: "Leadership Training",
            isPublished: true,
        },
    });
    console.log("✔ Youth Testimonial created");
    // ---- Contact Message ----
    await prisma.contactMessage.create({
        data: {
            name: "Test User",
            email: "test@example.com",
            message: "Hello, this is a test message.",
            subject: "Test subject",
        },
    });
    console.log("✔ Contact message created");
    console.log("🎉 Seeding complete!");
}
main()
    .catch((err) => {
    console.error(err);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
