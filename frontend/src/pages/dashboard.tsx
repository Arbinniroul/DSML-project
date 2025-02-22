import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Camera, Upload, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmotionChart } from "@/components/dashboard/emotion-chart";
import axios from "axios";
import ProductImageUpload from "@/components/admin/imageUpload";
import { WebcamCapture } from "@/components/dashboard/webcamcapture";


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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"upload" | "camera" | "history">("upload");
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult[] | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string>("");

  const handleSignOut = async () => {
    navigate("/");
  };

  const handleImageUpload = async (file: File) => {
    setLoading(true);
    setError(null);
    setImgFile(file); // Set the image file
    const previewUrl = URL.createObjectURL(file); // Create a preview URL
    setImagePreview(previewUrl); // Set the image preview

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Call Flask API
      const response = await axios.post("http://localhost:5000/detect", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        setAnalysisResults(response.data.results);
      } else {
        throw new Error("Analysis failed. Please try again.");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.response?.data?.error || "Error processing image");

      // Clear the image preview and file if processing fails
      setImagePreview(null);
      setImgFile(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">EmotiSense AI</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Button
            variant={activeTab === "upload" ? "default" : "outline"}
            onClick={() => setActiveTab("upload")}
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button
            variant={activeTab === "camera" ? "default" : "outline"}
            onClick={() => setActiveTab("camera")}
          >
            <Camera className="h-4 w-4 mr-2" />
            Camera
          </Button>
          <Button
            variant={activeTab === "history" ? "default" : "outline"}
            onClick={() => setActiveTab("history")}
          >
            <History className="h-4 w-4 mr-2" />
            History
          </Button>
        </div>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">
                {activeTab === "upload" ? "Upload Image" : "Capture Image"}
              </h2>
              {activeTab === "upload" ? (
                <ProductImageUpload
                  imgFile={imgFile}
                  setImgFile={setImgFile}
                  setUploadedImageUrl={setUploadedImageUrl}
                  setImageLoadingState={setLoading}
                  imageLoadingState={loading}
                  isEditMode={false}
                />
              ) : (
                <WebcamCapture
                  onCapture={(file) => handleImageUpload(file)} // Handle captured image
                  onClose={() => setActiveTab("upload")} // Switch back to upload tab
                />
              )}
              {imagePreview && (
                <div className="mt-4 relative">
                  <img src={imagePreview} alt="Preview" className="rounded-lg max-w-full h-auto" />
                  {analysisResults?.map((result, index) => (
                    <div
                      key={index}
                      className="absolute border-2 border-red-500"
                      style={{
                        left: `${result.bounding_box.x}px`,
                        top: `${result.bounding_box.y}px`,
                        width: `${result.bounding_box.width}px`,
                        height: `${result.bounding_box.height}px`,
                      }}
                    >
                      <div className="bg-red-500 text-white px-2 py-1 text-sm">
                        {result.emotion} ({Math.round(result.confidence * 100)}%)
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Emotion Analysis</h2>
              {analysisResults ? (
                <EmotionChart
                  data={analysisResults.map((result) => ({
                    emotion: result.emotion,
                    value: result.confidence,
                  }))}
                />
              ) : (
                <div className="text-muted-foreground">Upload an image to see analysis results</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}