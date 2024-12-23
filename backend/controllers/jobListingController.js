import JobListing from "../models/jobListingModel.js";
import resumeModel from "../models/resumeModel.js";
import similarityModel from "../models/similarityModel.js";
import cosineSimilarity from "../utils/cosine-similarity.js";

const createJobListing = async (req, res) => {
  const { title, company, description, expiresInDays } = req.body;
  const recruiter_id=req.user.id;
  if (!recruiter_id || !title || !company || !description) {
    return res
      .status(400)
      .json({ success: false, error: "Missing required fields." });
  }

  const response = await fetch("http://localhost:5000/api/embedText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ "text":description }),
  });
  
  let embedded_description = await response.json();
  embedded_description=embedded_description.embedding;
  console.log({ recruiter_id,
    title,
    company,
    description,
    embedded_description})
  
  
  try {
    const expiresAt = new Date(
      Date.now() + (expiresInDays || 7) * 24 * 60 * 60 * 1000
    ); // Default to 7 days
    const jobListing = new JobListing({
      recruiter_id,
      title,
      company,
      description,
      embedded_description,
      expiresAt,
    });
    console.log(JobListing);

    const savedJob = await jobListing.save();

    const resumeListings = await resumeModel.find();

    // Create similarities with the created job listing and all resume listings
    for (const resume of resumeListings) {
      const similarityScore = cosineSimilarity(embedded_description, resume.embedding);
      const expiresAt = new Date(jobListing.expiresAt);
      await similarityModel.create({
        joblisting: savedJob._id,
        resume: resume._id,
        similarity: similarityScore,
        expiresAt,
      });
    }

    res.status(201).json({ success: true, data: savedJob });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
const getAllJobListings= async (req, res) => {
    try {
      const jobListings = await JobListing.find();
      res.status(200).json({ success: true, data: jobListings });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  };
  const deleteJobListing = async (req, res) => {
    try {
      const jobListing = await JobListing.findByIdAndDelete(req.params.id);
      if (!jobListing) {
        return res.status(404).send("Job listing not found.");
      }
  
      // Delete all similarity entries associated with the job listing
      await similarityModel.deleteMany({ joblisting: jobListing._id });
  
      res.status(200).json({ success: true, message: "Job listing deleted successfully" });
    } catch (error) {
      console.error("Error deleting job listing:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  const getJobById = async (req, res) => {
    try {
      const jobListing = await JobListing.findById(req.params.id);
      if (!jobListing) {
        return res.status(404).json({ success: false, error: "Job listing not found" });
      }
      res.status(200).json({ success: true, data: jobListing });
    } catch (error) {
      console.error("Error fetching job listing:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  
  export { getJobById };

  export { createJobListing, getAllJobListings , deleteJobListing};