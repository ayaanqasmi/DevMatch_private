import express from "express";
import connectDb from "./config/connectDb.js";
import { configDotenv } from "dotenv";
const app = express();
const PORT = 4000;
configDotenv();
connectDb();




import jobsRoute from "./routes/jobsRoute.js";
app.use(express.json());
app.use("/api", jobsRoute);

import resumeRoute from "./routes/resumeRoute.js";
app.use("/api", resumeRoute);

import similarityRoute from "./routes/similarityRoute.js";
app.use("/api", similarityRoute);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

