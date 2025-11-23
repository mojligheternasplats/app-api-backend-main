"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const news_routes_1 = __importDefault(require("./news.routes"));
const media_routes_1 = __importDefault(require("./media.routes"));
const router = (0, express_1.Router)();
router.use('/news', news_routes_1.default);
router.use('/media', media_routes_1.default);
exports.default = router;
