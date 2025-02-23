import { Request, Response } from "express";
import { Image } from "../models/Image";
import multer from "multer";
import cloudinary from "../helpers/cloudinary";
import axios from "axios";
import FormData from "form-data";
import { Readable } from "stream";

// Multer storage configuration
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// Upload image to Cloudinary and process emotion detection
export const uploadImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Convert Buffer to Readable Stream
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null); // End the stream

    // Upload image to Cloudinary using stream
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "uploads" },
        async (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            return resolve(res.status(500).json({ message: "Error uploading to Cloudinary", error }));
          }

          if (!result) {
            return resolve(res.status(500).json({ message: "Cloudinary upload failed" }));
          }

          try {
            // Save image to MongoDB
            const image = new Image({
              filename: req.file!.originalname,
              url: result.secure_url,
              public_id: result.public_id,
              mimetype: req.file!.mimetype,
              size: req.file!.size,
            });
            await image.save();

            // Prepare form data for Flask API
            const form = new FormData();
            const imageBuffer = Buffer.from(req.file!.buffer); // Get image buffer
            form.append("file", imageBuffer, req.file!.originalname);

            // Send image to Flask API for emotion detection
            const flaskResponse = await axios.post("http://0.0.0.0:5001/detect", form, {
              headers: {
                ...form.getHeaders(),
              },
            });
            console.log("Flask API response:", flaskResponse.data);


            // Return the image and detected emotion from Flask API response
            return resolve(res.status(201).json({
              message: "Image uploaded successfully",
              image,
              emotion: flaskResponse.data.results[0]?.emotion || "Unknown",
              emotionConfidence: flaskResponse.data.results[0]?.confidence || "Unknown",
            }));
          } catch (error) {
            console.error("Error processing image:", error);
            return resolve(res.status(500).json({ message: "Error processing image", error }));
          }
        }
      );

      // Pipe the buffer stream to Cloudinary upload stream
      bufferStream.pipe(uploadStream);
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({ message: "Error uploading image", error });
  }
};

// Get all uploaded images
export const getImages = async (req: Request, res: Response): Promise<Response> => {
  try {
    const images = await Image.find();
    return res.status(200).json(images);
  } catch (error) {
    console.error("Error fetching images:", error);
    return res.status(500).json({ message: "Error fetching images", error });
  }
};

// Delete image from Cloudinary and MongoDB
export const deleteImage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ message: "Image not found" });
    }

    await cloudinary.uploader.destroy(image.public_id);
    await Image.findByIdAndDelete(id);

    return res.status(200).json({ message: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image:", error);
    return res.status(500).json({ message: "Error deleting image", error });
  }
};