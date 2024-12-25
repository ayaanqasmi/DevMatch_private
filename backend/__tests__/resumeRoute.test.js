import request from 'supertest';
import express from 'express';
import resumeRouter from '../routes/resumeRoute.js';
import mongoose from 'mongoose';

const app = express();
app.use(express.json());
app.use('/api', resumeRouter);

// Mocking the database functions
jest.mock('../controllers/resumeController.js', () => ({
  createResume: jest.fn(),
  getResumeById: jest.fn(),
  getAllResumes: jest.fn(),
  deleteResumeById: jest.fn(),
}));

import {
  createResume,
  getResumeById,
  getAllResumes,
  deleteResumeById,
} from '../controllers/resumeController.js';

describe('Resume Routes', () => {
  const resumeId = '60d21b4667d0d8992e610c85'; // Example resume ID
  const userId = '60d21b4667d0d8992e610c84'; // Example user ID

  it('should create a resume', async () => {
    createResume.mockImplementation((req, res) => {
      res.status(201).json({ success: true, resume: { id: resumeId, user_id: userId } });
    });

    const response = await request(app)
      .post('/api/resume')
      .send({ user_id: userId, name: 'Test Resume' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.resume).toHaveProperty('id', resumeId);
  });

  it('should get a resume by ID', async () => {
    getResumeById.mockImplementation((req, res) => {
      res.status(200).json({ success: true, resume: { id: resumeId, user_id: userId } });
    });

    const response = await request(app).get(`/api/resume/${resumeId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body.resume).toHaveProperty('id', resumeId);
  });

  it('should get all resumes', async () => {
    getAllResumes.mockImplementation((req, res) => {
      res.status(200).json({ success: true, data: [{ id: resumeId, user_id: userId }] });
    });

    const response = await request(app).get('/api/resume');

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('should delete a resume by ID', async () => {
    deleteResumeById.mockImplementation((req, res) => {
      res.status(204).send();
    });

    const response = await request(app).delete(`/api/resume/${resumeId}`);

    expect(response.status).toBe(204);
  });
}); 