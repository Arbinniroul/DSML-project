import express, { Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import imageRoutes from "./routes/ImageRoute";
import authRoutes from "./routes/AuthRoutes";

import cors from "cors";
// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 8001;

app.use(cors());

// Middleware
app.use(express.json());

// Routes
app.use("/api", imageRoutes);
app.use("/api/auth", authRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Backend!");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection error:", error.message));

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
