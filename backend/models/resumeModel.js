import mongoose from "mongoose";

const ResumeSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name:{
    type: String,
    required: true,
  },
  pdf: {
    type: String,
    required: true, // URL or path to the PDF
  },
  embedding: {
    type: [Number], // Array of numbers representing the embedding
   
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export default mongoose.model("Resume",ResumeSchema);