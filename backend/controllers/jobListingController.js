import JobListing from "../models/jobListingModel.js";

const createJobListing = async (req, res) => {
  const { recruiter_id, title, company, description, expiresInDays } = req.body;

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
  
  export { createJobListing, getAllJobListings };