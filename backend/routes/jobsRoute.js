import express from 'express';
import {
  createJobListing,
  getAllJobListings,
  deleteJobListing,
  getJobById
} from '../controllers/jobListingController.js'; // Adjust the path

import validateTokenHandler from "../middleware/validateTokenHandler.js";

const router = express.Router();

router.post('/jobs', validateTokenHandler,createJobListing);

router.get('/jobs', getAllJobListings); 
router.get('/jobs/:id', getJobById);

router.delete('/jobs/:id', validateTokenHandler,deleteJobListing);
export default router;