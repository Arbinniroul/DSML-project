import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Define the initial state
interface ImageState {
  images: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ImageState = {
  images: [],
  loading: false,
  error: null,
};

// Async Thunk for uploading an image
export const uploadImage = createAsyncThunk(
  "images/uploadImage",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", file); // Ensure it matches backend field name

      const response = await axios.post("http://localhost:8001/api/images", formData, {
       
      });

      return response.data; // { image, emotion, emotionConfidence }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error uploading image");
    }
  }
);

// Async Thunk for fetching all images
export const fetchImages = createAsyncThunk(
  "images/fetchImages",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:8001/api/images");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error fetching images");
    }
  }
);

// Async Thunk for deleting an image
export const deleteImage = createAsyncThunk(
  "images/deleteImage",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8001/api/images/${id}`);
      return id; // Return the ID of the deleted image
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Error deleting image");
    }
  }
);

// Create the slice
const imageSlice = createSlice({
  name: "images",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Upload Image
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images.push({
          ...action.payload.image, // Add the new image
          emotion: action.payload.emotion,
          emotionConfidence: action.payload.emotionConfidence,
        });
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Images
      .addCase(fetchImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        state.loading = false;
        state.images = action.payload; // Set the fetched images
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Image
      .addCase(deleteImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.loading = false;
        state.images = state.images.filter((image) => image._id !== action.payload); // Remove the deleted image
      })
      .addCase(deleteImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default imageSlice.reducer;
