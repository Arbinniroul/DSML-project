import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store/store";
import { RootState } from "@/store/store"; // Adjust the path if needed
import { deleteImage, fetchImages, uploadImage } from "@/store/imageSlice";
import { UploadCloud, Loader2, CheckCircle, XCircle } from "lucide-react"; // Icons for visual feedback

const ProductImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { images, loading, error } = useSelector((state: RootState) => state.images);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setUploadError(null); // Reset error on new file selection
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      const response = await dispatch(uploadImage(selectedFile)).unwrap();
      console.log(response); // Log response from server
      setUploadSuccess(true);
      dispatch(fetchImages()); // Refresh image list
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(error.message || "An unknown error occurred.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Upload Image</h2>

      {/* File Input */}
      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors">
        <UploadCloud className="w-8 h-8 text-gray-400 mb-2" />
        <span className="text-gray-600">
          {selectedFile ? selectedFile.name : "Choose an image"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        {isUploading ? (
          <Loader2 className="w-5 h-5 animate-spin mx-auto" />
        ) : (
          "Upload"
        )}
      </button>

      {/* Feedback Messages */}
      {uploadSuccess && (
        <div className="mt-4 flex items-center text-green-600">
          <CheckCircle className="w-5 h-5 mr-2" />
          <span>Upload successful!</span>
        </div>
      )}
      {uploadError && (
        <div className="mt-4 flex items-center text-red-600">
          <XCircle className="w-5 h-5 mr-2" />
          <span>{uploadError}</span>
        </div>
      )}

      {/* Image Preview */}
      {selectedFile && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Preview</h3>
          <img
            src={URL.createObjectURL(selectedFile)}
            alt="Preview"
            className="rounded-lg shadow-md w-full h-auto"
          />
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;