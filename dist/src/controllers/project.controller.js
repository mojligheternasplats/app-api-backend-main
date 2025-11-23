"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = void 0;
const project_service_1 = require("../services/project.service");
class ProjectController {
    async getAll(req, res) {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const search = req.query.search ? String(req.query.search) : undefined;
        const category = req.query.category
            ? String(req.query.category).toUpperCase()
            : undefined;
        try {
            const result = await project_service_1.ProjectService.getAll(page, limit, search, category);
            res.json(result);
        }
        catch (error) {
            console.error("❌ Error fetching projects:", error.message);
            res.status(500).json({ error: "Failed to fetch projects" });
        }
    }
    async getById(req, res) {
        const { id } = req.params;
        const project = await project_service_1.ProjectService.getById(id);
        if (!project)
            return res.status(404).json({ error: "Project not found" });
        res.json({ data: project });
    }
    async getBySlug(req, res) {
        const { slug } = req.params;
        const project = await project_service_1.ProjectService.getBySlug(slug);
        if (!project)
            return res.status(404).json({ error: "Project not found" });
        res.json({ data: project });
    }
    async create(req, res) {
        try {
            const project = await project_service_1.ProjectService.createProject(req.body);
            res.status(201).json({ data: project });
        }
        catch (error) {
            console.error("❌ Error creating project:", error.message);
            res.status(500).json({ error: "Failed to create project" });
        }
    }
    async update(req, res) {
        try {
            const { id } = req.params;
            const project = await project_service_1.ProjectService.updateProject(id, req.body);
            res.json({ data: project });
        }
        catch (error) {
            console.error("❌ Error updating project:", error.message);
            res.status(500).json({ error: "Failed to update project" });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            await project_service_1.ProjectService.deleteProject(id);
            res.status(204).send();
        }
        catch (error) {
            console.error("❌ Error deleting project:", error.message);
            res.status(500).json({ error: "Failed to delete project" });
        }
    }
}
exports.projectController = new ProjectController();
