import JobListing from "../models/jobListingModel.js";
import resumeModel from "../models/resumeModel.js";
import similarityModel from "../models/similarityModel.js";
import cosineSimilarity from "../utils/cosine-similarity.js";

// Create a new job listing
const createJobListing = async (req, res) => {
  const { title, company, description, expiresInDays } = req.body;
  const recruiter_id = req.user.id; // Get recruiter ID from the request user
  
  // Check if required fields are missing
  if (!recruiter_id || !title || !company || !description) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields." });
  }

  // Request embedding of job description
  const response = await fetch("http://localhost:5000/api/embedText", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ "text": description }),
  });
  
  let embedded_description = await response.json(); // Get embedded description
  embedded_description = embedded_description.embedding;

  // Log recruiter info for debugging
  console.log({ recruiter_id, title, company, description, embedded_description });

  try {
    // Calculate expiration date of the job listing
    const expiresAt = new Date(
      Date.now() + (expiresInDays || 7) * 24 * 60 * 60 * 1000 // Default to 7 days
    );

    // Create a new job listing with provided details
    const jobListing = new JobListing({
      recruiter_id,
      title,
      company,
      description,
      embedded_description,
      expiresAt,
    });

    // Log the job listing for debugging
    console.log(jobListing);

    // Save the job listing to the database
    const savedJob = await jobListing.save();

    // Fetch all resumes from the database
    const resumeListings = await resumeModel.find();

    // Create similarities between the job listing and all resumes
    for (const resume of resumeListings) {
      const similarityScore = cosineSimilarity(embedded_description, resume.embedding); // Calculate similarity score
      const expiresAt = new Date(jobListing.expiresAt); // Set expiration for the similarity record

      // Save the similarity record to the database
      await similarityModel.create({
        joblisting: savedJob._id,
        resume: resume._id,
        similarity: similarityScore,
        expiresAt,
      });
    }

    // Return success response with the saved job listing
    res.status(201).json({ success: true, data: savedJob });
  } catch (error) {
    // Return error response if something goes wrong
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get all job listings, excluding the embedded description
const getAllJobListings = async (req, res) => {
  try {
    const jobListings = await JobListing.find().select('-embedded_description'); // Exclude embedded_description field
    res.status(200).json({ success: true, data: jobListings });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a job listing by ID
const deleteJobListing = async (req, res) => {
  try {
    // Find and delete the job listing by ID
    const jobListing = await JobListing.findByIdAndDelete(req.params.id);
    if (!jobListing) {
      return res.status(404).send("Job listing not found.");
    }

    // Delete all similarity entries associated with the job listing
    await similarityModel.deleteMany({ joblisting: jobListing._id });

    res.status(200).json({ success: true, message: "Job listing deleted successfully" });
  } catch (error) {
    // Log and return error response if deletion fails
    console.error("Error deleting job listing:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get a job listing by ID
const getJobById = async (req, res) => {
  try {
    // Find the job listing by ID
    const jobListing = await JobListing.findById(req.params.id);
    if (!jobListing) {
      return res.status(404).json({ success: false, error: "Job listing not found" });
    }

    // Return the job listing data
    res.status(200).json({ success: true, data: jobListing });
  } catch (error) {
    // Log and return error response if fetching fails
    console.error("Error fetching job listing:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { createJobListing, getAllJobListings, deleteJobListing, getJobById };
