import similarityModel from "../models/similarityModel.js";
import JobListing from "../models/jobListingModel.js";
import Resume from "../models/resumeModel.js";

// Get all similarity entries from the similarity model
const getAllSimilarityEntries = async (req, res) => {
  try {
    // Fetch all similarity entries
    const similarityEntries = await similarityModel.find();
    res.status(200).json({ success: true, data: similarityEntries });
  } catch (error) {
    console.error("Error fetching similarity entries:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get job listings by their similarity to a specific resume
const getJobListingsByResumeSimilarity = async (req, res) => {
  const resumeId = req.params.resumeId;

  try {
    // Step 1: Get job listing IDs and their similarity scores
    const similarities = await similarityModel.find({ resume: resumeId })
      .sort({ similarity: -1 }) // Sort by similarity in descending order
      .select(['joblisting', 'similarity']); // Include joblisting and similarity fields

    // Step 2: Extract the jobListing IDs
    const jobListingIds = similarities.map((similarity) => similarity.joblisting);

    // Step 3: Fetch the full job listings excluding the embedded description field
    const jobListings = await JobListing.find({ _id: { $in: jobListingIds } })
      .select('-embedded_description');

    // Step 4: Create a map for fast lookup of job listings by ID
    const jobListingMap = new Map(
      jobListings.map((job) => [job._id.toString(), job.toObject()])
    );

    // Step 5: Map job listings with their similarity scores, preserving the order
    const jobListingsWithSimilarity = similarities.map((similarity) => {
      const job = jobListingMap.get(similarity.joblisting.toString());
      return job ? { ...job, similarity: similarity.similarity } : null; // Handle missing job listings
    }).filter(Boolean); // Remove null values

    res.status(200).json({ success: true, data: jobListingsWithSimilarity });
  } catch (error) {
    console.error("Error fetching job listings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get resumes by their similarity to a specific job listing
const getResumesByJobListingSimilarity = async (req, res) => {
  const jobListingId = req.params.jobListingId;

  try {
    // Step 1: Get resume IDs and similarity scores for the given job listing
    const similarities = await similarityModel.find({ joblisting: jobListingId })
      .sort({ similarity: -1 }) // Sort by similarity in descending order
      .select(['resume', 'similarity']); // Include resume and similarity fields

    // Step 2: Extract the resume IDs
    const resumeIds = similarities.map((similarity) => similarity.resume);

    // Step 3: Fetch full resume documents excluding their embedding field
    const resumes = await Resume.find({ _id: { $in: resumeIds } })
      .select('-embedding');

    // Step 4: Create a map for fast lookup of resumes by ID
    const resumeMap = new Map(
      resumes.map((resume) => [resume._id.toString(), resume.toObject()])
    );

    // Step 5: Map resumes with their similarity scores, preserving the order
    const resumesWithSimilarity = similarities.map((similarity) => {
      const resume = resumeMap.get(similarity.resume.toString());
      return resume ? { ...resume, similarity: similarity.similarity } : null; // Handle missing resumes
    }).filter(Boolean); // Remove null values

    res.status(200).json({ success: true, data: resumesWithSimilarity });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


export { getResumesByJobListingSimilarity, getJobListingsByResumeSimilarity, getAllSimilarityEntries };
