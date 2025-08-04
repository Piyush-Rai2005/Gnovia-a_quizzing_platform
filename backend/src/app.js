// db/app.js
import express from "express";
const app = express();

app.use(express.json()); // Middleware setup here if needed

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("API is running...");
});
export { app };
