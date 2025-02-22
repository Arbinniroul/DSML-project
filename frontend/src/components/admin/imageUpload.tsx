import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Cloud, FileCheck2, XCircle } from "lucide-react";
import React, { useRef, useState } from "react";
import axios from "axios";
import { Skeleton } from "../ui/skeleton";


interface ProductImageUploadProps {
  imgFile: File | null;
  setImgFile: (file: File | null) => void;
  setUploadedImageUrl: (url: string) => void;
  setImageLoadingState: (loading: boolean) => void;
  imageLoadingState: boolean;
  isEditMode: boolean;
}

function ProductImageUpload({
  imgFile,
  setImgFile,
  setUploadedImageUrl,
  setImageLoadingState,
  imageLoadingState,
  isEditMode,
}: ProductImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Handle file input change (selecting file)
  function handleImageFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setImgFile(selectedFile);
      setUploadError(null); // Clear previous errors
      uploadImageToCloudinary(selectedFile);
    }
  }

  // Remove the uploaded image
  function removeImage() {
    setImgFile(null);
    setUploadedImageUrl("");
    setUploadError(null);
  }

  // Handle drag-over event
  function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  // Handle drop event (drag-and-drop files)
  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      handleImageFileChange({ target: { files: [droppedFile] } } as React.ChangeEvent<HTMLInputElement>);
    }
  }

  // Upload the image to Cloudinary
  async function uploadImageToCloudinary(file: File) {
    setImageLoadingState(true);
    if (!file) return;

    const data = new FormData();
    data.append("my_file", file);

    try {
      const response = await axios.post<{ result: { url: string } }>(
        `${import.meta.env.VITE_API_URL}/api/admin/products/upload-img`,
        data
      );
      if (response.data?.result?.url) {
        setUploadedImageUrl(response.data.result.url);
        setImageLoadingState(false);
      } else {
        throw new Error("No URL in response");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError("Failed to upload image. Please try again.");
      setImageLoadingState(false);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <Label className="text-lg font-semibold mb-2 block mt-4">Upload Image</Label>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`${isEditMode ? "opacity-60 " : ""}border-2 border-dashed rounded-lg p-4`}
      >
        <Input
          id="ImageUpload"
          type="file"
          ref={inputRef}
          onChange={handleImageFileChange}
          className="hidden"
          disabled={isEditMode}
          accept="image/*" // Accept only images
        />
        {!imgFile ? (
          <Label
            htmlFor="ImageUpload"
            className={`${isEditMode ? "cursor-not-allowed" : ""} flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <Cloud className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag and Drop or click to upload image</span>
          </Label>
        ) : imageLoadingState ? (
          <Skeleton className="h-10 bg-gray-100" />
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center truncate">
              <FileCheck2 className="w-8 text-primary mr-2 h-8" />
              <p className="text-sm text-medium truncate max-w-xs">{imgFile.name}</p>
            </div>
            <Button
              variant="ghost"
              onClick={removeImage}
              className="ml-4 p-1 text-red-500 hover:text-red-700"
              aria-label="Remove image"
            >
              <XCircle className="w-6 h-6" />
            </Button>
          </div>
        )}
      </div>

      {uploadError && <p className="text-red-600 mt-2">{uploadError}</p>}
    </div>
  );
}

export default ProductImageUpload;