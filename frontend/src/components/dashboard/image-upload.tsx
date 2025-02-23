import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "@/store/store";
import { RootState } from "@reduxjs/toolkit/query";
import { deleteImage, fetchImages, uploadImage } from "@/store/imageSlice";

const ProductImageUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { images, loading, error } = useSelector((state: RootState) => state.images);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("File input changed");  // Check if the function is triggered
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Selected file:", file);  // Log selected file
      setSelectedFile(file);
    }
  };
  

  const handleUpload = async () => {
    if (!selectedFile) return;
  
    console.log("Selected file:", selectedFile);  // Log selected file before dispatching
  
    try {
      const response = await dispatch(uploadImage(selectedFile)).unwrap();
      console.log(response); // Log response from server
      dispatch(fetchImages()); // Refresh image list
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };
  

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteImage(id)).unwrap();
      dispatch(fetchImages()); // Refresh image list
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <div className="container">
      <h2>Upload Image</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={!selectedFile || loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {error && <p style={{ color: "red" }}>Error: {error.message || "An unknown error occurred."}</p>}

      <h2>Uploaded Images</h2>
      {loading && <p>Loading images...</p>}
      <div className="image-grid">
        {images.map((image) => (
          <div key={image._id} className="image-container">
            <img src={image.url} alt={image.filename} width="200" />
            <p>Emotion: {image.emotion || "Unknown"}</p>
            <button onClick={() => handleDelete(image._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageUpload;
