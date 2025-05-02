import mongoose from "mongoose";

export default async function connect(){
    await mongoose.connect(process.env.ATLAS_URL)
    console.log("Database connected")
}