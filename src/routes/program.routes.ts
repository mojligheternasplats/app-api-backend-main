import { Router } from "express";
import { projectController } from "../controllers/project.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

import { ProjectService } from "../services/project.service";

const router = Router();

/**
 * PUBLIC ROUTES
 */

// Get all projects (with ?page, ?limit, ?search, ?category)
router.get("/", (req, res) => projectController.getAll(req, res));

// Get project by slug
router.get("/slug/:slug", (req, res) => projectController.getBySlug(req, res));

// Get project by ID (optional - if needed by frontend)
router.get("/:id", (req, res) => projectController.getById(req, res));

/**
 * PROTECTED ROUTES (Admin only)
 */

// Create
router.post("/", authMiddleware, (req, res) => projectController.create(req, res));

// Update
router.put("/:id", authMiddleware, (req, res) => projectController.update(req, res));

// Delete
router.delete("/:id", authMiddleware, (req, res) => projectController.delete(req, res));
router.get("/eu/latest", async (req, res) => {
  try {
    const projects = await ProjectService.getLatestEUProjects(4);
    res.json({ data: projects });
  } catch (error) {
    res.status(500).json({ error: "Failed to load EU projects" });
  }
});

export default router;

// /api/projects	all projects
// /api/projects?page=2&limit=5	paginate
// /api/projects?search=data	search projects
// /api/projects?category=EU	filter category
// /api/projects/slug/erasmus	get by slug
// /api/projects/cmhj49pje000hub0s1lc809e2	get by ID