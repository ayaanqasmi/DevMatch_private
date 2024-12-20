import asyncHandler from "express-async-handler";
import resumeModel from "../models/resumeModel.js";
import similarityModel from "../models/similarityModel.js"; // Import similarity model
import jobListingModel from "../models/jobListingModel.js"; // Import job listing model
import extractTextFromPdf from "../utils/pdf-to-text.js";
import uploadPdfToCloud from "../utils/upload-pdf-to-cloud.js";
import cosineSimilarity from "../utils/cosine-similarity.js";

const createResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  try {
    // Upload the file to the cloud
    console.log(req.file);
    await uploadPdfToCloud(req.file.path, req.file.originalname);

    // Extract text from the uploaded PDF
    const text = await extractTextFromPdf(req.file.path);
    console.log(`Extracted text: ${text}`);

    // Get embedding for the extracted resume text
    const response = await fetch("http://localhost:5000/api/embedText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const resumeEmbedding = (await response.json()).embedding;

    // Fetch all job listings
    const jobListings = await jobListingModel.find();
    if (!jobListings.length) {
      return res.status(404).send("No job listings found.");
    }

    // Calculate similarity for each job listing
    for (const job of jobListings) {
      const similarityScore = cosineSimilarity(resumeEmbedding, job.embedded_description);

      // Save similarity result to the database
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // Set expiration to 30 days from now

      await similarityModel.create({
        joblisting: job._id,
        resume: req.file.originalname, // Store the file name as a reference
        similarity: similarityScore,
        expiresAt,
      });
    }

    res.status(200).json({ message: "Resume processed and similarities stored successfully." });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).send("Error processing resume.");
  }
});

export { createResume };
