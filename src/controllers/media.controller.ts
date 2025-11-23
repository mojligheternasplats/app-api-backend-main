import { NextFunction, Request, Response } from "express";
import { mediaService } from "../services/media.service";

// Helpers
function ok<T>(res: Response, data: T, status = 200) {
  return res.status(status).json(data);
}
function bad(res: Response, message = "Bad Request", code = 400) {
  return res.status(code).json({ message });
}

export const mediaController = {
  // GET /api/media/gallery
  async getGallery(req: Request, res: Response) {
    try {
      const items = await mediaService.getGallery();
      return ok(res, items);
    } catch (e: any) {
      return bad(res, e?.message || "Failed to fetch gallery");
    }
  },

  // GET /api/media?entityType=NEWS|EVENT|PROJECT|PARTNER|HERO_SECTION|GALLERY_COMPONENT
  async getMedia(req: Request, res: Response) {
    try {
      const entityType = (req.query.entityType as string) || "GALLERY_COMPONENT";
      const items = await mediaService.getByEntityType(entityType);
      return ok(res, items);
    } catch (e: any) {
      return bad(res, e?.message || "Failed to fetch media");
    }
  },

  // GET /api/media/all  (optional convenience for admin list without filters)
  async getAll(req: Request, res: Response) {
    try {
      const items = await mediaService.getAll();
      return ok(res, items);
    } catch (e: any) {
      return bad(res, e?.message || "Failed to fetch all media");
    }
  },

  // POST /api/media/attach
  // body: { mediaId, entityType, entityId, order? }
  async attachMedia(req: Request, res: Response) {
    try {
      const { mediaId, entityType, entityId, order } = req.body || {};
      if (!mediaId || !entityType || !entityId) {
        return bad(res, "mediaId, entityType and entityId are required");
      }

      // Single-attach per entity type happens inside service
      const assoc = await mediaService.attach(mediaId, entityType, entityId, order);
      return ok(res, assoc, 201);
    } catch (e: any) {
      return bad(res, e?.message || "Failed to attach media");
    }
  },

  // POST /api/media/detach
  // body: { mediaId, entityType, entityId? } — if entityId omitted, detaches any association for that type
  async detachMedia(req: Request, res: Response) {
    try {
      const { mediaId, entityType, entityId } = req.body || {};
      if (!mediaId || !entityType) {
        return bad(res, "mediaId and entityType are required");
      }
      const resp = await mediaService.detach(mediaId, entityType, entityId);
      return ok(res, { success: true, removed: "count" in resp ? resp.count : 1 });
    } catch (e: any) {
      return bad(res, e?.message || "Failed to detach media");
    }
  },

  // POST /api/media/file  (multer single('file') runs before; req.file.path is temp)
  async uploadFile(req: Request, res: Response) {
    try {
      if (!req.file?.path) return bad(res, "No file uploaded");
      const {altText, entityType, mediaType } = req.body || {};
      const created = await mediaService.uploadFileAndCreateRecord({
        localFilePath: req.file.path,
        altText,
        entityType,
        mediaType,
      });
      return ok(res, created, 201);
    } catch (e: any) {
      return bad(res, e?.message || "File upload failed");
    }
  },

  // POST /api/media/url  (upload by remote URL)
  async uploadUrl(req: Request, res: Response) {
    try {
      const { url, altText,  entityType, mediaType } = req.body || {};
      if (!url) return bad(res, "url is required");
  const created = await mediaService.uploadUrlAndCreateRecord({
  url,
  altText,
  entityType,
  mediaType,
});

      return ok(res, created, 201);
    } catch (e: any) {
      return bad(res, e?.message || "URL upload failed");
    }
  },

  // DELETE /api/media/:id
  async remove(req: Request, res: Response) {
    try {
      const { id } = req.params;
      if (!id) return bad(res, "id is required");
      await mediaService.remove(id);
      return res.status(204).send();
    } catch (e: any) {
      return bad(res, e?.message || "Failed to delete media");
    }
  },
async getOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const media = await mediaService.getOne(id);
      res.json(media);
    } catch (error) {
      next(error);
    }
  }
}