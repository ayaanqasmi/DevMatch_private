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

export { getAllSimilarityEntries };