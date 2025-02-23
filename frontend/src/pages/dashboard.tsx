import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Camera, Upload, History, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

import axios from "axios";
import ProductImageUpload from "@/components/admin/imageUpload";
import { WebcamCapture } from "@/components/dashboard/webcamcapture";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { deleteImage, fetchImages } from "@/store/imageSlice";

interface AnalysisResult {
  emotion: string;
  confidence: number;
  bounding_box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { images } = useSelector((state: RootState) => state.images);

  const [activeTab, setActiveTab] = useState<"upload" | "camera" | "history">("upload");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);

  useEffect(() => {
    dispatch(fetchImages()); // Fetch images on component mount
  }, [dispatch]);

  const handleSignOut = () => {
    sessionStorage.removeItem('token'); // Remove token from sessionStorage
    navigate("/auth/login"); // Navigate to the login page
  };

  const handleDelete = async (id: string) => {
    try {
      await dispatch(deleteImage(id)).unwrap();
      dispatch(fetchImages()); // Refresh image list
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setImgFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:5000/detect", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        setAnalysisResults(response.data.results);
        dispatch(fetchImages()); // Refresh images after upload
      } else {
        throw new Error("Analysis failed. Please try again.");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Error processing image");
      setImagePreview(null);
      setImgFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="border-b border-gray-700 bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">EmotiSense AI</h1>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" /> Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-6">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-4 mb-6">
          {["upload", "camera", "history"].map((tab) => (
            <Button
              key={tab}
              variant={activeTab === tab ? "default" : "outline"}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-blue-600 hover:bg-blue-700 text-black"
                  : "border-gray-600 hover:bg-gray-700 text-black"
              }`}
              onClick={() => setActiveTab(tab as "upload" | "camera" | "history")}
            >
              {tab === "upload" && <Upload className="h-5 w-5 mr-2" />}
              {tab === "camera" && <Camera className="h-5 w-5 mr-2" />}
              {tab === "history" && <History className="h-5 w-5 mr-2" />}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-600 text-white rounded-lg mb-6 flex items-center">
            <XCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side: Upload/Capture */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">
              {activeTab === "upload" ? "Upload Image" : "Capture Image"}
            </h2>
            {activeTab === "upload" ? (
              <ProductImageUpload
                imgFile={imgFile}
                setImgFile={setImgFile}
                setImageLoadingState={setLoading}
                imageLoadingState={loading}
                isEditMode={false}
              />
            ) : (
              <WebcamCapture onCapture={handleImageUpload} />
            )}
            {imagePreview && (
              <div className="mt-4 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="rounded-lg max-w-full h-auto shadow-md"
                />
              </div>
            )}
          </div>

          {/* Right Side: Emotion Analysis */}
          <div className="bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Emotion Analysis</h2>
            {images && Array.isArray(images) && images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image) => (
                  <div
                    key={image._id}
                    className="p-4 bg-gray-700 rounded-lg shadow hover:bg-gray-600 transition-colors"
                  >
                   <img
                    src={image.url}
                    alt={image.filename}
                    className="rounded-lg w-full h-48 object-cover"
                   />
                    <p className="mt-2">
                      <strong>Filename:</strong> {image.filename}
                    </p>
                    <p>
                      <strong>Emotion:</strong> {image.emotion || "Unknown"}
                    </p>
                    <p>
                      <strong>Confidence:</strong>{" "}
                      {image.confidence ? `${(image.confidence * 100).toFixed(2)}%` : "N/A"}
                    </p>
                    <Button
                      variant="destructive"
                      className="mt-3 w-full hover:bg-red-700 transition-colors"
                      onClick={() => handleDelete(image._id)}
                    >
                      Delete
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400">Upload an image to see analysis results</div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
