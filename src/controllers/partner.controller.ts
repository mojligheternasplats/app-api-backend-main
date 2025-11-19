import { Request, Response } from "express";
import { PartnerService } from "../services/partner.service";

export const getAllPartners = async (req: Request, res: Response) => {
  try {
    const { page = "1", limit = "10", search } = req.query;

    const result = await PartnerService.getAll(
      Number(page),
      Number(limit),
      search as string
    );

    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPartnerById = async (req: Request, res: Response) => {
  try {
    const item = await PartnerService.getById(req.params.id);

    if (!item) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getPartnerBySlug = async (req: Request, res: Response) => {
  try {
    const item = await PartnerService.getBySlug(req.params.slug);

    if (!item) {
      return res.status(404).json({ error: "Partner not found" });
    }

    res.json(item);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const createPartner = async (req: Request, res: Response) => {
  try {
    // logoUrl + logoPublicId can be added by your upload middleware
    const created = await PartnerService.createPartner(req.body);

    res.status(201).json(created);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const updatePartner = async (req: Request, res: Response) => {
  try {
    const updated = await PartnerService.updatePartner(
      req.params.id,
      req.body // may include logoUrl or logoPublicId
    );

    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePartner = async (req: Request, res: Response) => {
  try {
    await PartnerService.deletePartner(req.params.id);

    res.json({ message: "Partner deleted" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};
