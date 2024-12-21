function cosineSimilarity(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    throw new Error("Arrays must be of the same length");
  }

  // Compute dot product
  const dotProduct = arr1.reduce((sum, val, i) => sum + val * arr2[i], 0);

  // Compute magnitude of each array
  const magnitude1 = Math.sqrt(arr1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(arr2.reduce((sum, val) => sum + val * val, 0));

  // Prevent division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0; // Cosine similarity is undefined if one vector has zero magnitude
  }

  // Compute cosine similarity
  return dotProduct / (magnitude1 * magnitude2);
}


export default cosineSimilarity