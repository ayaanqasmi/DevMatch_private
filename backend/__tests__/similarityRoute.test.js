import request from 'supertest';
import express from 'express';
import similarityRouter from '../routes/similarityRoute.js';
import connectDb from '../config/connectDb.js'; // Ensure to connect to the database
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv()
const app = express();
app.use(express.json());
app.use('/api', similarityRouter);

beforeAll(async () => {
  await connectDb(); // Connect to the database before running tests
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the database connection after tests
});

describe('Similarity Routes', () => {
  const resumeId = '676b046a0daa9a1a38a5f945'; // Example resume ID
  const jobListingId = '67682e5b1aed0b0124a6f881'; // Example job listing ID

  it('should get all similarity entries', async () => {
    const response = await request(app).get('/api/similarity');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get job listings by resume similarity', async () => {
    const response = await request(app).get(`/api/similarity/resume/${resumeId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should get resumes by job listing similarity', async () => {
    const response = await request(app).get(`/api/similarity/jobs/${jobListingId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
}); 