import similarityModel from "../models/similarityModel.js";
import JobListing from "../models/jobListingModel.js";
import Resume from "../models/resumeModel.js";
const getAllSimilarityEntries = async (req, res) => {
  try {
    const similarityEntries = await similarityModel.find();
    res.status(200).json({ success: true, data: similarityEntries });
  } catch (error) {
    console.error("Error fetching similarity entries:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
const getJobListingsByResumeSimilarity = async (req, res) => {
  const resumeId = req.params.resumeId;

  try {
    // Step 1: Get jobListing IDs and similarities from the similarity model
    const similarities = await similarityModel.find({ resume: resumeId })
      .sort({ similarity: -1 }) // Sort by similarity in descending order
      .select(['joblisting', 'similarity']); // Include jobListing and similarity fields

    // Step 2: Map jobListing IDs
    const jobListingIds = similarities.map((similarity) => similarity.joblisting);

    // Step 3: Fetch the full jobListing objects (excluding the embedded_description field)
    const jobListings = await JobListing.find({ _id: { $in: jobListingIds } })
      .select('-embedded_description');

    // Step 4: Create a map for quick lookup of jobListing objects
    const jobListingMap = new Map(
      jobListings.map((job) => [job._id.toString(), job.toObject()])
    );

    // Step 5: Create the response array preserving similarity order
    const jobListingsWithSimilarity = similarities.map((similarity) => {
      const job = jobListingMap.get(similarity.joblisting.toString());
      return job
        ? { ...job, similarity: similarity.similarity }
        : null; // Handle case if a jobListing is not found
    }).filter(Boolean); // Remove any null values

    res.status(200).json({ success: true, data: jobListingsWithSimilarity });
  } catch (error) {
    console.error("Error fetching job listings:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};


const getResumesByJobListingSimilarity = async (req, res) => {
  const jobListingId = req.params.jobListingId;
  const limit = parseInt(req.query.limit, 10) || 10; // Default limit to 10
  const page = parseInt(req.query.page, 10) || 1; // Default page to 1

  try {
    // Step 1: Get resume IDs from the similarity model
    const similarities = await similarityModel.find({ jobListing: jobListingId })
      .sort({ similarity: -1 }) // Sort by similarity in descending order
      .skip((page - 1) * limit) // Skip documents for pagination
      .limit(limit) // Limit documents for pagination
      .select('resume'); // Only include the resume field

    const resumeIds = similarities.map((similarity) => similarity.resume);

    // Step 2: Fetch the full resume objects (excluding the embedding field)
    const resumes = await Resume.find({ _id: { $in: resumeIds } }).select('-embedding');

    res.status(200).json({ success: true, data: resumes });
  } catch (error) {
    console.error("Error fetching resumes:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

  export { getResumesByJobListingSimilarity };
  
  export { getJobListingsByResumeSimilarity };

export { getAllSimilarityEntries };