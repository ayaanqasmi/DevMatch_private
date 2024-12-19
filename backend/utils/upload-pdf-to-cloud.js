import { Storage } from "@google-cloud/storage";
import path from "path";

// Instantiate a storage client
const storage = new Storage();
const bucketName = "devmatch-resumes";
async function uploadPdfToCloud(localFilePath, fileName) {
 

  const destinationBlobName =  String(fileName) + ".pdf"; // Replace with your desired bucket path

  try {
    await storage.bucket(bucketName).upload(localFilePath, {
      destination: destinationBlobName, // The destination path in the bucket
    });
    console.log(
      `${localFilePath} uploaded to ${bucketName} as ${destinationBlobName}`
    );
  } catch (error) {
    console.error("Error uploading file:", error);
  }
}


async function deleteFile(fileName) {
  try {
    await storage.bucket(bucketName).file(fileName).delete();
    console.log(`File ${fileName} deleted from bucket ${bucketName}.`);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}
export default {uploadPdfToCloud,deleteFile};