import express from 'express';
import {
  createJobListing, // Controller function to create a new job listing
  getAllJobListings, // Controller function to get all job listings
  deleteJobListing, // Controller function to delete a job listing by ID
  getJobById, // Controller function to get a job listing by ID
  getJobListingByUserID
} from '../controllers/jobListingController.js'; // Adjust the path as needed

import validateTokenHandler from "../middleware/validateTokenHandler.js"; // Middleware to validate the token

const router = express.Router();

// POST request to create a new job listing, with token validation
router.post('/jobs', validateTokenHandler, createJobListing);

// GET request to fetch all job listings
router.get('/jobs', getAllJobListings);

// GET request to fetch a job listing by its ID
router.get('/jobs/:id', getJobById);
router.get('/jobs/user/:userId', getJobListingByUserID);

// DELETE request to delete a job listing by its ID, with token validation
router.delete('/jobs/:id', validateTokenHandler, deleteJobListing);

export default router; // Export the router to be used in other parts of the application
