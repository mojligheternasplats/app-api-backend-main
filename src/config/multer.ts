import multer from "multer";

// Store uploaded files in memory instead of saving to disk
const storage = multer.memoryStorage();

export const upload = multer({ storage });
