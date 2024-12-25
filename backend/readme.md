# API Endpoints

## Job Listing Endpoints
- **POST** `/jobs` - Create a new job listing (requires token validation)
- **GET** `/jobs` - Fetch all job listings
- **GET** `/jobs/:id` - Fetch a job listing by ID
- **DELETE** `/jobs/:id` - Delete a job listing by ID (requires token validation)

---

## Resume Endpoints
- **POST** `/resume` - Upload and create a resume (requires token validation)
- **GET** `/resume/:id` - Fetch a resume by ID
- **GET** `/resume/user/:userId` - Fetch resumes by user ID
- **GET** `/resume` - Fetch all resumes
- **DELETE** `/resume/:id` - Delete a resume by ID (requires token validation)

---

## Similarity Endpoints
- **GET** `/similarity` - Fetch all similarity entries
- **GET** `/similarity/resume/:resumeId` - Fetch job listings similar to a specific resume
- **GET** `/similarity/jobs/:jobListingId` - Fetch resumes similar to a specific job listing

---

## User Endpoints
- **POST** `/user/register` - Register a new user
- **POST** `/user/login` - Log in an existing user
- **GET** `/user/current` - Fetch the current authenticated user's data (requires token validation)
- **GET** `/user` - Fetch all users (no token validation required)
