import express, { Request, Response } from "express";
import multer from "multer";
import { deleteImage, getImages, uploadImage } from "../controllers/ImageController";

// Multer storage configuration
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Initialize router
const router = express.Router();

// Route to upload an image
router.post("/images", upload.single("image"), (req: Request, res: Response, next) => {
  uploadImage(req, res).catch(next); // Use catch to forward errors to Express error handler
});

// Route to get all images
router.get("/images", (req: Request, res: Response, next) => {
  getImages(req, res).catch(next); // Wrap getImages in try-catch to forward errors
});

// Delete an image
router.delete("/images/:id", (req: Request, res: Response, next) => {
  deleteImage(req, res).catch(next); // Wrap deleteImage in try-catch to forward errors
});

export default router;