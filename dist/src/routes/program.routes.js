"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const project_service_1 = require("../services/project.service");
const router = (0, express_1.Router)();
/**
 * PUBLIC ROUTES
 */
// Get all projects (with ?page, ?limit, ?search, ?category)
router.get("/", (req, res) => project_controller_1.projectController.getAll(req, res));
// Get project by slug
router.get("/slug/:slug", (req, res) => project_controller_1.projectController.getBySlug(req, res));
// Get project by ID (optional - if needed by frontend)
router.get("/:id", (req, res) => project_controller_1.projectController.getById(req, res));
/**
 * PROTECTED ROUTES (Admin only)
 */
// Create
router.post("/", auth_middleware_1.authMiddleware, (req, res) => project_controller_1.projectController.create(req, res));
// Update
router.put("/:id", auth_middleware_1.authMiddleware, (req, res) => project_controller_1.projectController.update(req, res));
// Delete
router.delete("/:id", auth_middleware_1.authMiddleware, (req, res) => project_controller_1.projectController.delete(req, res));
router.get("/eu/latest", async (req, res) => {
    try {
        const projects = await project_service_1.ProjectService.getLatestEUProjects(4);
        res.json({ data: projects });
    }
    catch (error) {
        res.status(500).json({ error: "Failed to load EU projects" });
    }
});
exports.default = router;
// /api/projects	all projects
// /api/projects?page=2&limit=5	paginate
// /api/projects?search=data	search projects
// /api/projects?category=EU	filter category
// /api/projects/slug/erasmus	get by slug
// /api/projects/cmhj49pje000hub0s1lc809e2	get by ID
