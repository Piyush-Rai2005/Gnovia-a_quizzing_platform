import mongoose from "mongoose";

export default async function connect() {
  const url = process.env.ATLAS_URL;
  console.log("🧪 MongoDB URL:", url ? "Loaded ✅" : "Missing ❌");

  try {
    await mongoose.connect(url);
    console.log("✅ Database connected");
  } catch (error) {
    console.error("❌ Mongoose connection error:", error.message);
    throw error; // Let server.js catch and show 'Invalid database connection'
  }
}
