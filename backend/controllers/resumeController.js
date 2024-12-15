import asyncHandler from "express-async-handler";
import resumeModel from "../models/resumeModel.js";
import jwt from "jsonwebtoken";

const createResume = asyncHandler(async (req, res) => {
    try {
        const { user_id, pdf } = req.body;
        
        const resume = await resumeModel.create({ user_id, pdf, embedding });
        res.status(201).json(resume);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});