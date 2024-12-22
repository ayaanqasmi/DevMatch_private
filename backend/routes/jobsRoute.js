import express from 'express';
import {
  createJobListing,
  getAllJobListings,
  deleteJobListing,
  getJobById
} from '../controllers/jobListingController.js'; // Adjust the path

const router = express.Router();

router.post('/jobs', createJobListing);

router.get('/jobs', getAllJobListings); 
router.get('/jobs/:id', getJobById);

router.delete('/jobs/:id', deleteJobListing);
export default router;