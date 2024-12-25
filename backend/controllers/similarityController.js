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
  const limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10
  const page = parseInt(req.query.page, 10) || 1; // Default page to 1

  try {
    // Step 1: Get resume IDs and similarity scores for the given job listing
    const similarities = await similarityModel.find({ joblisting: jobListingId })
      .sort({ similarity: -1 }) // Sort by similarity in descending order
      .skip((page - 1) * limit) // Skip based on page number for pagination
      .limit(limit) // Limit results based on the specified page size
      .select('resume'); // Only include the resume field

    const resumeIds = similarities.map((similarity) => similarity.resume);

    // Step 2: Fetch full resume documents excluding their embedding field
    const resumes = await Resume.find({ _id: { $in: resumeIds } }).select('-embedding');

    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

export { getResumesByJobListingSimilarity, getJobListingsByResumeSimilarity, getAllSimilarityEntries };
