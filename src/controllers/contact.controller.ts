import { Request, Response } from "express";
import { ContactService } from "../services/contact.service";

export const getAllMessages = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", status } = req.query;

    const result = await ContactService.getAll(
      Number(page),
      Number(limit),
      status as any
    );

    return res.json(result); // ✅ Already structured as { data, total, page, limit }
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const getMessageById = async (req: Request, res: Response) => {
  try {
    const msg = await ContactService.getById(req.params.id);
    if (!msg) return res.status(404).json({ error: "Message not found" });

    return res.json(msg);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export const createMessage = async (req: Request, res: Response) => {
  try {
    const message = await ContactService.createMessage(req.body);
    return res.status(201).json(message);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const updateMessage = async (req: Request, res: Response) => {
  try {
    const updated = await ContactService.updateMessage(req.params.id, req.body);
    return res.json(updated);
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};

export const deleteMessage = async (req: Request, res: Response) => {
  try {
    await ContactService.deleteMessage(req.params.id);
    return res.json({ message: "Message deleted" });
  } catch (error: any) {
    return res.status(400).json({ error: error.message });
  }
};
