import { Request, Response } from "express";
import { EventService } from "../services/event.service";

export const getAllEvents = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", search } = req.query;
    const result = await EventService.getAll(Number(page), Number(limit), search as string);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventById = async (req: Request, res: Response) => {
  try {
    const event = await EventService.getById(req.params.id);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEventBySlug = async (req: Request, res: Response) => {
  try {
    const event = await EventService.getBySlug(req.params.slug);
    if (!event) return res.status(404).json({ error: "Event not found" });
    res.json(event);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createEvent = async (req: Request, res: Response) => {
  try {
    const event = await EventService.createEvent(req.body);
    res.status(201).json(event);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const updated = await EventService.updateEvent(req.params.id, req.body);
    res.json(updated);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    await EventService.deleteEvent(req.params.id);
    res.json({ message: "Event deleted" });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
