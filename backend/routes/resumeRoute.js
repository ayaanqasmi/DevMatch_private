import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import {
  createResume,
  getResumeById,
  getAllResumes,
  deleteResumeById,
  getResumesByUserId
} from "../controllers/resumeController.js";
import validateTokenHandler from "../middleware/validateTokenHandler.js";
const router = express.Router();

// Ensure the uploads directory exists
const uploadsDir = "../uploads/";
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    // Ensure the file has a unique name
    cb(null, `${Date.now()}${path.extname(file.originalname)}`); // Append original extension
  },
});

// Filter for PDF files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept PDF files
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", "file")); // Reject non-PDF files
  }
};

// Initialize Multer with storage and filter options
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Optional: Limit file size to 5MB
});

// Middleware for handling file upload errors
const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err) {
    return res
      .status(500)
      .json({ success: false, message: "File upload error" });
  }
  next();
};

// Define routes
router.post("/resume", upload.single("file"), uploadErrorHandler, validateTokenHandler,createResume);
router.get("/resume/:id", getResumeById);
router.get("/resume/user/:userId", getResumesByUserId);
router.get("/resume", getAllResumes);
router.delete("/resume/:id", validateTokenHandler,deleteResumeById);


export default router;
