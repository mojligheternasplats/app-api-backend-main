import { Request, Response } from "express";
import { z } from "zod";
import { HeroStatus } from "@prisma/client";
import { HeroSectionService } from "../services/heroSection.service";

// ---------- Zod Schemas ----------
const createHeroSchema = z.object({
  page: z.string().min(1, "page is required"),
  title: z.string().min(1, "title is required"),
  subtitle: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  language: z.string().optional(),
  status: z.nativeEnum(HeroStatus).optional(), // default handled in service (DRAFT)
});

const updateHeroSchema = z.object({
  page: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  buttonLink: z.string().optional().nullable(),
  language: z.string().optional(),
  status: z.nativeEnum(HeroStatus).optional(),
});

// Convert ZodError into [{ field, issue }]
function zodToDetails(err: z.ZodError) {
  return err.issues.map((i) => ({
    field: i.path.join(".") || "(root)",
    issue: i.message,
  }));
}

export class HeroSectionController {
  // GET /api/hero-sections?page=1&limit=10&search=home
  static async getAll(req: Request, res: Response) {
    try {
      const page = Math.max(parseInt(String(req.query.page ?? 1), 10) || 1, 1);
      const limit = Math.max(parseInt(String(req.query.limit ?? 10), 10) || 10, 1);
      const search = typeof req.query.search === "string" ? req.query.search : undefined;

      const result = await HeroSectionService.getAll(page, limit, search);
      return res.json({ success: true, data: result.data, meta: result.meta });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: { message: "Failed to fetch hero sections", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
      });
    }
  }

  // GET /api/hero-sections/:id
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const hero = await HeroSectionService.getById(id);
      if (!hero) {
        return res.status(404).json({
          success: false,
          error: { message: "Hero section not found", details: [{ field: "id", issue: "No record with this id" }] },
        });
      }
      return res.json({ success: true, data: hero });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: { message: "Failed to fetch hero section", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
      });
    }
  }

  // GET /api/hero-sections/page/:page  (Frontend: returns only PUBLISHED or null)
  static async getByPage(req: Request, res: Response) {
    try {
      const { page } = req.params;
      const hero = await HeroSectionService.getByPage(page);
      // Return 200 with data: null if none published (cleaner for frontend)
      return res.json({ success: true, data: hero });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: { message: "Failed to fetch hero section by page", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
      });
    }
  }

  // POST /api/hero-sections
  static async createHeroSection(req: Request, res: Response) {
    try {
      const parsed = createHeroSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: { message: "Validation failed", details: zodToDetails(parsed.error) },
        });
      }

      const created = await HeroSectionService.createHeroSection(parsed.data);
      return res.status(201).json({ success: true, data: created });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: { message: "Failed to create hero section", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
      });
    }
  }

  // PUT /api/hero-sections/:id
  static async updateHeroSection(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const parsed = updateHeroSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          success: false,
          error: { message: "Validation failed", details: zodToDetails(parsed.error) },
        });
      }

      const updated = await HeroSectionService.updateHeroSection(id, parsed.data);
      return res.json({ success: true, data: updated });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: { message: "Failed to update hero section", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
      });
    }
  }

  // DELETE /api/hero-sections/:id
  static async deleteHeroSection(req: Request, res: Response) {
    try {
      const { id } = req.params;
      // Clean up media associations handled inside service
      const deleted = await HeroSectionService.deleteHeroSection(id);
      return res.json({ success: true, data: deleted });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        error: { message: "Failed to delete hero section", details: [{ field: "(server)", issue: error?.message || "Unknown error" }] },
      });
    }
  }
}
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