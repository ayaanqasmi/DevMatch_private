import express from 'express';
import { getAllSimilarityEntries,getJobListingsByResumeSimilarity,getResumesByJobListingSimilarity } from '../controllers/similarityController.js';

const router = express.Router();

router.get('/similarity', getAllSimilarityEntries);
router.get('/similarity/resume/:resumeId', getJobListingsByResumeSimilarity);
router.get('/similarity/jobs/:jobListingId', getResumesByJobListingSimilarity);

export default router;