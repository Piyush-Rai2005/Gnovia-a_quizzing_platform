// db/index.js
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js"; // rename this appropriately if needed
import { app } from "./app.js"; // importing the express app

dotenv.config({
  path: "./.env"
});

const PORT = process.env.PORT || 8080;

// Start DB connection and server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to connect to database:", err);
  });
