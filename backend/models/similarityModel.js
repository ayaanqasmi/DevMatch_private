import mongoose from 'mongoose';

const similaritySchema = new mongoose.Schema({
  joblisting: {
    type: String,
    required: true,
  },
  resume: {
    type: String,
    required: true,
  },
  similarity: {
    type: Number,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // TTL index
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the model
export default mongoose.model("Similarity", similaritySchema);
