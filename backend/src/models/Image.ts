// src/models/Image.ts
import { Schema, model } from "mongoose";

interface IImage {
  filename: string;
  url: string; // Cloudinary URL
  public_id: string; // Cloudinary public ID
  mimetype: string;
  size: number;
  emotion: string;
  confidence: number;
}

const imageSchema = new Schema<IImage>({
  filename: { type: String, required: true },
  url: { type: String, required: true },
  public_id: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
  emotion: { type: String},
  confidence: { type: Number}
});

export const Image = model<IImage>("Image", imageSchema);