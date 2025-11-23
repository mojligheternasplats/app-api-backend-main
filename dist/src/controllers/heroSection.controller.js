"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroSectionController = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const heroSection_service_1 = require("../services/heroSection.service");
// ---------- Zod Schemas ----------
const createHeroSchema = zod_1.z.object({
    page: zod_1.z.string().min(1, "page is required"),
    title: zod_1.z.string().min(1, "title is required"),
    subtitle: zod_1.z.string().optional().nullable(),
    buttonText: zod_1.z.string().optional().nullable(),
    buttonLink: zod_1.z.string().optional().nullable(),
    language: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(client_1.HeroStatus).optional(), // default handled in service (DRAFT)
});
const updateHeroSchema = zod_1.z.object({
    page: zod_1.z.string().optional(),
    title: zod_1.z.string().optional(),
    subtitle: zod_1.z.string().optional().nullable(),
    buttonText: zod_1.z.string().optional().nullable(),
    buttonLink: zod_1.z.string().optional().nullable(),
    language: zod_1.z.string().optional(),
    status: zod_1.z.nativeEnum(client_1.HeroStatus).optional(),
});
function normalizeHeroInput(data) {
    return {
        ...data,
        subtitle: data.subtitle ?? undefined,
        buttonText: data.buttonText ?? undefined,
        buttonLink: data.buttonLink ?? undefined,
    };
}
// Convert ZodError into [{ field, issue }]
function zodToDetails(err) {
    return err.issues.map((i) => ({
        field: i.path.join(".") || "(root)",
        issue: i.message,
    }));
}
class HeroSectionController {
    // GET /api/hero-sections?page=1&limit=10&search=home
    static async getAll(req, res) {
        try {
            const page = Math.max(parseInt(String(req.query.page ?? 1), 10) || 1, 1);
            const limit = Math.max(parseInt(String(req.query.limit ?? 10), 10) || 10, 1);
            const search = typeof req.query.search === "string" ? req.query.search : undefined;
            const result = await heroSection_service_1.HeroSectionService.getAll(page, limit, search);
            return res.json({ success: true, data: result.data, meta: result.meta });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch hero sections", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
            });
        }
    }
    // GET /api/hero-sections/:id
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const hero = await heroSection_service_1.HeroSectionService.getById(id);
            if (!hero) {
                return res.status(404).json({
                    success: false,
                    error: { message: "Hero section not found", details: [{ field: "id", issue: "No record with this id" }] },
                });
            }
            return res.json({ success: true, data: hero });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch hero section", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
            });
        }
    }
    // GET /api/hero-sections/page/:page  (Frontend: returns only PUBLISHED or null)
    static async getByPage(req, res) {
        try {
            const { page } = req.params;
            const hero = await heroSection_service_1.HeroSectionService.getByPage(page);
            // Return 200 with data: null if none published (cleaner for frontend)
            return res.json({ success: true, data: hero });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to fetch hero section by page", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
            });
        }
    }
    // POST /api/hero-sections
    static async createHeroSection(req, res) {
        try {
            const parsed = createHeroSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: { message: "Validation failed", details: zodToDetails(parsed.error) },
                });
            }
            const normalized = normalizeHeroInput(parsed.data);
            const created = await heroSection_service_1.HeroSectionService.createHeroSection(normalized);
            return res.status(201).json({ success: true, data: created });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to create hero section", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
            });
        }
    }
    // PUT /api/hero-sections/:id
    static async updateHeroSection(req, res) {
        try {
            const { id } = req.params;
            const parsed = updateHeroSchema.safeParse(req.body);
            if (!parsed.success) {
                return res.status(400).json({
                    success: false,
                    error: { message: "Validation failed", details: zodToDetails(parsed.error) },
                });
            }
            const normalized = normalizeHeroInput(parsed.data);
            const updated = await heroSection_service_1.HeroSectionService.updateHeroSection(id, normalized);
            return res.json({ success: true, data: updated });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to update hero section", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
            });
        }
    }
    // DELETE /api/hero-sections/:id
    static async deleteHeroSection(req, res) {
        try {
            const { id } = req.params;
            // Clean up media associations handled inside service
            const deleted = await heroSection_service_1.HeroSectionService.deleteHeroSection(id);
            return res.json({ success: true, data: deleted });
        }
        catch (error) {
            return res.status(500).json({
                success: false,
                error: { message: "Failed to delete hero section", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
            });
        }
    }
}
exports.HeroSectionController = HeroSectionController;
// At this point, the Hero Section feature is fully implemented:
// ✅ Prisma Model
// ✅ Repository
// ✅ Service
// ✅ Controller (with Zod + detailed errors)
// ✅ Routes
// Would you like the Admin Panel UI next?
// I can provide it for either:
// Option A — React-Admin Component
// (Integrates into your existing admin panel)
// Option B — Next.js Custom Admin Page
// (If you prefer a custom UI, not react-admin)
// Option C — Both
// Which one should I generate?
// Reply: A, B, or C
