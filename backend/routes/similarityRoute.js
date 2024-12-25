import express from 'express';
import {
  getAllSimilarityEntries, // Controller to fetch all similarity entries
  getJobListingsByResumeSimilarity, // Controller to get job listings similar to a specific resume
  getResumesByJobListingSimilarity, // Controller to get resumes similar to a specific job listing
} from '../controllers/similarityController.js'; // Adjust the path as needed

const router = express.Router();

// GET request to fetch all similarity entries
router.get('/similarity', getAllSimilarityEntries);

// GET request to fetch job listings similar to a specific resume by resumeId
router.get('/similarity/resume/:resumeId', getJobListingsByResumeSimilarity);

// GET request to fetch resumes similar to a specific job listing by jobListingId
router.get('/similarity/jobs/:jobListingId', getResumesByJobListingSimilarity);

export default router; // Export the router to be used in other parts of the application
