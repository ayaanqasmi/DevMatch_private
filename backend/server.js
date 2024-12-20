import express from "express";
import multer from "multer";
import path from "path";
import extractTextFromPdf from "./utils/pdf-to-text.js";
import uploadPdfToCloud from "./utils/upload-pdf-to-cloud.js";
import fs from "fs";
import connectDb from "./config/connectDb.js";
import { configDotenv } from "dotenv";
const app = express();
const PORT = 4000;
configDotenv();
connectDb();

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Specify the upload directory
  },
  filename: (req, file, cb) => {
    // Ensure the file has a unique name
    cb(null, Date.now() + path.extname(file.originalname)); // Append original extension
  },
});

// Filter for PDF files only
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true); // Accept PDF files
  } else {
    cb(new Error("Not a PDF file!"), false); // Reject non-PDF files
  }
};

// Initialize Multer with storage and filter options
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// Route to handle single PDF upload
app.post("/upload-pdf", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  console.log(req.file); // Log the uploaded file information
  uploadPdfToCloud(req.file.path, req.file.originalname);
  try {
    const text = await extractTextFromPdf(req.file.path);
    console.log(`Extracted text: ${text}`);
   
      

    // const embedding = await fetch("http://localhost:5000/api/embedText", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ text }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   });
    //   console.log(embedding);
      res.status(200).send(embedding); // Send the extracted text as a response
      
  } catch (error) {
    console.error("Error extracting text:", error);
    res.status(500).send("Error extracting text from PDF.");
  }
});

import jobsRoute from "./routes/jobsRoute.js";
app.use(express.json());
app.use("/jobs", jobsRoute);



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

