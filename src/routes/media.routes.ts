import { Router } from "express";
import { mediaController } from "../controllers/media.controller";
import { upload } from "../config/multer";
import { uploadMedia } from "../config/uploadMedia"; // ✅ new middleware

const router = Router();

/*===========================
     PUBLIC MEDIA ROUTES
===========================*/
router.get("/gallery", mediaController.getGallery);
router.get("/all", mediaController.getAll);
router.get("/", mediaController.getMedia);       // ?entityType=NEWS
router.get("/:id", mediaController.getOne);      // GET ONE MEDIA

/*===========================
      UPLOAD ROUTES
===========================*/
// Multer parses the file, uploadMedia streams to Cloudinary, controller persists record
router.post(
  "/file",
  upload.single("file"),
  uploadMedia,
  mediaController.uploadFile
);

router.post("/url", mediaController.uploadUrl);

/*===========================
     ASSOCIATION ROUTES
===========================*/
router.post("/attach", mediaController.attachMedia);
router.post("/detach", mediaController.detachMedia);

/*===========================
      DELETE MEDIA
===========================*/
router.delete("/:id", mediaController.remove);

export default router;
