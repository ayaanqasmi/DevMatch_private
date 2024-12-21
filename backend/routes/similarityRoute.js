import express from 'express';
import { getAllSimilarityEntries } from '../controllers/similarityController.js';

const router = express.Router();

router.get('/similarity', getAllSimilarityEntries);

export default router;