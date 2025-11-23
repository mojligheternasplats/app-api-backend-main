"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const auth_controller_1 = require("../controllers/auth.controller");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
router.put("/:id", auth_middleware_1.authMiddleware, upload.none(), user_controller_1.updateUser);
router.delete("/:id", auth_middleware_1.authMiddleware, user_controller_1.deleteUser);
router.get("/", user_controller_1.getAllUsers);
router.post("/", upload.none(), auth_controller_1.register);
exports.default = router;
