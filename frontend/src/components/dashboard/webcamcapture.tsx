import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

interface WebcamCaptureProps {
  onCapture: (file: File) => void; // Callback to handle the captured image
  onClose: () => void; // Callback to close the webcam
}

export function WebcamCapture({ onCapture, onClose }: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // Open the webcam
  useEffect(() => {
    if (isCameraOpen) {
      openWebcam();
    }
  }, [isCameraOpen]);

  const openWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  // Capture the image from the webcam
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Set canvas dimensions to match video stream
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw the current video frame onto the canvas
      context?.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert the canvas image to a Blob
      canvas.toBlob((blob) => {
        if (blob) {
          // Create a File object from the Blob
          const file = new File([blob], "webcam-capture.png", { type: "image/png" });
          onCapture(file); // Pass the captured image to the parent component
        }
      }, "image/png");
    }
  };

  // Close the webcam
  const closeWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
      videoRef.current.srcObject = null;
    }
    onClose(); // Notify the parent component to close the webcam
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isCameraOpen ? (
        <>
          <video ref={videoRef} autoPlay className="rounded-lg w-full max-w-md" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4">
            <Button onClick={captureImage}>Capture</Button>
            <Button variant="outline" onClick={closeWebcam}>
              Close
            </Button>
          </div>
        </>
      ) : (
        <Button onClick={() => setIsCameraOpen(true)}>Open Camera</Button>
      )}
    </div>
  );
}