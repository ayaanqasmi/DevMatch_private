import express from 'express';
import {
  createJobListing,
  getAllJobListings
} from '../controllers/jobListingController.js'; // Adjust the path

const router = express.Router();

router.post('/jobs', createJobListing);

router.get('/jobs', getAllJobListings); 

export default router;