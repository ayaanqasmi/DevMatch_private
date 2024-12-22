import similarityModel from "../models/similarityModel.js";

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
    const limit = req.query.limit || 10; // Default limit to 10
    const page = req.query.page || 1; // Default page to 1
  
    try {
      const similarities = await similarityModel.find({ resume: resumeId })
        .sort({ similarity: -1 }) // Sort by similarity in descending order
        .skip((page - 1) * limit) // Skip documents for pagination
        .limit(limit) // Limit documents for pagination
        .populate({
            path:"joblisting",
            select: "title company description"
        }); // Populate job listing documents
  
      res.status(200).json({ success: true, data: similarities });
    } catch (error) {
      console.error("Error fetching job listings:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  const getResumesByJobListingSimilarity = async (req, res) => {
    const jobListingId = req.params.jobListingId;
    const limit = req.query.limit || 10; // Default limit to 10
    const page = req.query.page || 1; // Default page to 1
  
    try {
      const similarities = await similarityModel.find({ joblisting: jobListingId })
        .sort({ similarity: -1 }) // Sort by similarity in descending order
        .skip((page - 1) * limit) // Skip documents for pagination
        .limit(limit) // Limit documents for pagination
        .populate("resume"); // Populate resume documents
  
      res.status(200).json({ success: true, data: similarities });
    } catch (error) {
      console.error("Error fetching resumes:", error);
      res.status(500).json({ success: false, error: error.message });
    }
  };
  
  export { getResumesByJobListingSimilarity };
  
  export { getJobListingsByResumeSimilarity };

export { getAllSimilarityEntries };