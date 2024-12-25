import request from 'supertest';
import express from 'express';
import userRoute from '../routes/userRoute.js';
import connectDb from '../config/connectDb.js'; // Ensure to connect to the database
import mongoose from 'mongoose';
import { configDotenv } from 'dotenv';
configDotenv()
const app = express();
app.use(express.json());
app.use('/api', userRoute);

beforeAll(async () => {
  await connectDb(); // Connect to the database before running tests
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the database connection after tests
});

describe('User Routes', () => {
  let token;

  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/user/register')
      .send({
        username: 'testuser',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should log in an existing user', async () => {
    const response = await request(app)
      .post('/api/user/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token; // Store the token for later use
  });

  it('should fetch the current user data', async () => {
    const response = await request(app)
      .get('/api/user/current')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('username', 'testuser');
    expect(response.body).toHaveProperty('email', 'testuser@example.com');
  });

  it('should get all users', async () => {
    const response = await request(app)
      .get('/api/user')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});