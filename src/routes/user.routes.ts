import { Router } from "express";
import { getProfile, getAllUsers ,updateUser, deleteUser } from "../controllers/user.controller";
import { authMiddleware  } from "../middlewares/auth.middleware";
import { register } from "../controllers/auth.controller";
import multer from "multer";
const upload = multer();
const router = Router();

router.get("/me", authMiddleware, getProfile);
router.put("/:id", authMiddleware, upload.none(), updateUser);
router.delete("/:id", authMiddleware, deleteUser);
router.get("/",  getAllUsers);
router.post("/",  upload.none(), register);

export default router;
