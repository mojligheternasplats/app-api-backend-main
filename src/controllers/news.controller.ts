import { Request, Response } from "express";
import { NewsService } from "../services/news.service";

export const getAllNews = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", search } = req.query;
    const result = await NewsService.getAll(Number(page), Number(limit), search as string);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getNewsById = async (req: Request, res: Response) => {
  try {
    const item = await NewsService.getById(req.params.id);
    if (!item) return res.status(404).json({ error: "News not found" });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getNewsBySlug = async (req: Request, res: Response) => {
  try {
    const item = await NewsService.getBySlug(req.params.slug);
    if (!item) return res.status(404).json({ error: "News not found" });
    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createNews = async (req: Request, res: Response) => {
  try {
    const created = await NewsService.createNews(req.body);
    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updateNews = async (req: Request, res: Response) => {
  try {
    const updated = await NewsService.updateNews(req.params.id, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteNews = async (req: Request, res: Response) => {
  try {
    await NewsService.deleteNews(req.params.id);
    res.json({ message: "News deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
