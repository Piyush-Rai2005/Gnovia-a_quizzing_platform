// utils/cloudinary.js
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
console.log("Cloudinary ENV Loaded:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  // api_secret intentionally not printed
});

/**
 * Uploads a local file to Cloudinary and deletes it locally.
 * @param {string} localFilePath - Local file path from multer (req.file.path)
 * @returns {string} - URL of the uploaded image from Cloudinary
 */
const uploadToCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) throw new Error("No file path provided");

    const result = await cloudinary.uploader.upload(localFilePath, {
      folder: "QuizAppImages", // Optional: store in a folder
      use_filename: true,
      unique_filename: false,
    });

    fs.unlinkSync(localFilePath); // delete file from local after upload

    return result.secure_url; // ✅ Return only the image URL
  } catch (error) {
    console.error("Cloudinary Upload Failed:", error);
    throw error;
  }
};

export { uploadToCloudinary };
export default cloudinary;
