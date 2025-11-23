"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNews = exports.updateNews = exports.createNews = exports.getNewsBySlug = exports.getNewsById = exports.getAllNews = void 0;
const news_service_1 = require("../services/news.service");
const getAllNews = async (req, res) => {
    try {
        const { page = "1", limit = "10", search } = req.query;
        const result = await news_service_1.NewsService.getAll(Number(page), Number(limit), search);
        res.json(result);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getAllNews = getAllNews;
const getNewsById = async (req, res) => {
    try {
        const item = await news_service_1.NewsService.getById(req.params.id);
        if (!item)
            return res.status(404).json({ error: "News not found" });
        res.json(item);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getNewsById = getNewsById;
const getNewsBySlug = async (req, res) => {
    try {
        const item = await news_service_1.NewsService.getBySlug(req.params.slug);
        if (!item)
            return res.status(404).json({ error: "News not found" });
        res.json(item);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getNewsBySlug = getNewsBySlug;
const createNews = async (req, res) => {
    try {
        const created = await news_service_1.NewsService.createNews(req.body);
        res.status(201).json(created);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.createNews = createNews;
const updateNews = async (req, res) => {
    try {
        const updated = await news_service_1.NewsService.updateNews(req.params.id, req.body);
        res.json(updated);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.updateNews = updateNews;
const deleteNews = async (req, res) => {
    try {
        await news_service_1.NewsService.deleteNews(req.params.id);
        res.json({ message: "News deleted" });
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
};
exports.deleteNews = deleteNews;
