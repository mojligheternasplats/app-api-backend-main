"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadPartnerLogo = void 0;
const cloudinary_1 = require("./cloudinary");
const uploadPartnerLogo = (req, res, next) => {
    if (!req.file)
        return next(); // no logo uploaded
    const file = req.file;
    const uploadStream = cloudinary_1.cloudinary.uploader.upload_stream({
        folder: "partners/logos", // folder is optional but recommended
    }, (error, result) => {
        if (error)
            return next(error);
        if (result) {
            req.body.logoUrl = result.secure_url;
            req.body.logoPublicId = result.public_id;
        }
        next();
    });
    uploadStream.end(file.buffer);
};
exports.uploadPartnerLogo = uploadPartnerLogo;
