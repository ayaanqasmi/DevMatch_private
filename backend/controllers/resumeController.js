
import resumeModel from "../models/resumeModel.js";
import similarityModel from "../models/similarityModel.js"; // Import similarity model
import jobListingModel from "../models/jobListingModel.js"; // Import job listing model
import extractTextFromPdf from "../utils/pdf-to-text.js";
import {uploadPdfToCloud,deleteFile} from "../utils/upload-pdf-to-cloud.js";
import cosineSimilarity from "../utils/cosine-similarity.js";
import { ObjectId } from "mongodb";
import mongoose from "mongoose"

const createResume = (async (req, res) => {
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  const newId = new ObjectId(); //resume id
  const user_id=req.user.id;

  try {
    // Upload the file to the cloud
    console.log(`Uploading file: ${req.file.path}`);
    await uploadPdfToCloud(req.file.path, newId);

    // Extract text from the uploaded PDF
    const text = await extractTextFromPdf(req.file.path);
    if (!text) {
      return res.status(400).json({ success: false, message: "Failed to extract text from the PDF." });
    }
    // adds resume to vector database
    const addDocument = await fetch("http://localhost:5000/api/add_document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document:text,document_id:newId }),
    });
    // Get embedding for the extracted resume text
    const embedResponse = await fetch("http://localhost:5000/api/embedText", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!embedResponse.ok) {
      const errorMessage = await embedResponse.text();
      throw new Error(`Embedding API error: ${errorMessage}`);
    }

    const { embedding: resumeEmbedding } = await embedResponse.json();

    if (!resumeEmbedding) {
      throw new Error("Failed to generate embedding for the resume.");
    }

    // Create a new resume document
    const newResume = await resumeModel.create({
      _id: newId,
      user_id,
      name: req.file.originalname,
      embedding: resumeEmbedding,
    });

    // Fetch all job listings
    const jobListings = await jobListingModel.find();

    if (!jobListings.length) {
      console.log("No job listings found.");
      return res.status(404).json({ success: false, message: "No job listings found." });
    }

    // Calculate similarity for each job listing
    const similarityPromises = jobListings.map(async (job) => {
      const similarityScore = cosineSimilarity(resumeEmbedding, job.embedded_description);
      const expiresAt = new Date(job.expiresAt);

      await similarityModel.create({
        joblisting: job._id,
        resume: newResume._id,
        similarity: similarityScore,
        expiresAt,
      });
    });

    await Promise.all(similarityPromises);

    res.status(201).json({ success: true, data: newResume });
  } catch (error) {
    console.error("Error processing resume:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


const getResumeById = (async (req, res) => {
  try {
    const resume = await resumeModel.findById(req.params.id);
    if (!resume) {
      return res.status(404).send("Resume not found.");
    }
    res.status(200).json({ success: true, data: resume });
  } catch (error) {
    console.error("Error fetching resume:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const getAllResumes = (async (req, res) => {
  try {
    const resumes = await resumeModel.find().select('-embedding');
    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const deleteResumeById = (async (req, res) => {
  try {
    const idToDelete=req.params.id
    const resume = await resumeModel.findByIdAndDelete(idToDelete);
    await deleteFile(idToDelete);
    await similarityModel.deleteMany({ resume: idToDelete });
    await fetch("http://localhost:5000/api/remove_document", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ document_id:idToDelete }),
    });
    if (!resume) {
      return res.status(404).send("Resume not found.");
    }
    res.status(200).json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    console.error("Error deleting resume:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



const getResumesByUserId = async (req, res) => {
  const userId = req.params.userId; // Assuming the user ID is passed as a route parameter

  // Validate the userId is provided and is a valid ObjectId
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required.' });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: 'Invalid User ID format.' });
  }

  try {
    // Fetch resumes associated with the provided user ID, excluding the embedding field
    const resumes = await resumeModel.find({ user_id: userId }).select('-embedding');

    if (!resumes || resumes.length === 0) {
      return res.status(404).json({ success: false, message: 'No resumes found for the specified user.' });
    }

    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export { createResume, getResumeById, getAllResumes, deleteResumeById ,getResumesByUserId};