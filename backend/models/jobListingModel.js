import mongoose from 'mongoose';

const JobListingSchema = new mongoose.Schema({
  recruiter_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recruiter',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  embedded_description: {
    type: [Number], // Array of numbers representing the vector embedding of the description
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

export default mongoose.model("JobListing",JobListingSchema);