import express from "express";
import {
  registerUser, // Controller to handle user registration
  loginUser, // Controller to handle user login
  currentUser, // Controller to fetch current user data
  getAllUsers, // Controller to get all users
} from "../controllers/userController.js"; // Adjust the path as needed

import validateTokenHandler from "../middleware/validateTokenHandler.js"; // Middleware to validate the token

const router = express.Router();

// POST request to register a new user
router.post("/user/register", registerUser);

// POST request to log in an existing user
router.post("/user/login", loginUser);

// GET request to fetch the current authenticated user's data, with token validation
router.get("/user/current", validateTokenHandler, currentUser);

// GET request to fetch all users, requires no token validation
router.get("/user", getAllUsers);

export default router; // Export the router to be used in other parts of the application
