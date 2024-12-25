import { Storage } from "@google-cloud/storage";
import path from "path";

// Instantiate a storage client with the service account key
const storage = new Storage({
  keyFilename: path.join('utils/devmatch-445212-2b9e3f65c01d.json'),
});
const bucketName = "devmatch-resumes";

// Function to upload a PDF file to Google Cloud Storage
async function uploadPdfToCloud(localFilePath, fileName) {
  const destinationBlobName = String(fileName) + ".pdf"; // Destination file name in the cloud

  try {
    await storage.bucket(bucketName).upload(localFilePath, {
      destination: destinationBlobName, // Specify destination in the bucket
    });
    console.log(`${localFilePath} uploaded to ${bucketName} as ${destinationBlobName}`);
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}

// Function to delete a file from Google Cloud Storage
async function deleteFile(fileName) {
  const destinationBlobName = String(fileName) + ".pdf"; // File name to delete
  try {
    await storage.bucket(bucketName).file(destinationBlobName).delete();
    console.log(`File ${destinationBlobName} deleted from bucket ${bucketName}.`);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

export { uploadPdfToCloud, deleteFile }; // Export the functions for use elsewhere
