import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";


interface WebcamCaptureProps {
  onClose: () => void; // Callback to close the webcam
}

export function WebcamCapture({ onClose }: WebcamCaptureProps) {
  const dispatch = useDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [emotion, setEmotion] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Open the webcam
  useEffect(() => {
    if (isCameraOpen) {
      openWebcam();
    } else {
      stopWebcam();
    }
  }, [isCameraOpen]);

  const openWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        startEmotionDetection();
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  // Start real-time emotion detection
  const startEmotionDetection = () => {
    const detectFrame = async () => {
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
        canvas.toBlob(async (blob) => {
          if (blob) {
            // Create a File object from the Blob
            const file = new File([blob], "webcam-frame.png", { type: "image/png" });

            // Send the frame to the Flask API for emotion detection
            try {
              const formData = new FormData();
              formData.append("file", file);

              const response = await fetch("http://0.0.0.0:5001/detect", {
                method: "POST",
                body: formData,
              });

              if (response.ok) {
                const data = await response.json();
                if (data.results.length > 0) {
                  setEmotion(data.results[0].emotion);
                  setConfidence(data.results[0].confidence);
                } else {
                  setEmotion(null);
                  setConfidence(null);
                }
              }
            } catch (error) {
              console.error("Error detecting emotion:", error);
            }
          }
        }, "image/png");
      }

      // Request the next frame
      animationFrameRef.current = requestAnimationFrame(detectFrame);
    };

    // Start the detection loop
    animationFrameRef.current = requestAnimationFrame(detectFrame);
  };

  // Stop the webcam and emotion detection
  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop()); // Stop all tracks
      videoRef.current.srcObject = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current); // Stop the detection loop
    }
  };

  // Close the webcam
  const closeWebcam = () => {
    stopWebcam();
    setIsCameraOpen(false); // Close the camera UI
    onClose(); // Notify the parent component to close the webcam
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {isCameraOpen ? (
        <>
          <video ref={videoRef} autoPlay className="rounded-lg w-full max-w-md" />
          <canvas ref={canvasRef} className="hidden" />
          <div className="flex gap-4">
            <Button variant="outline" onClick={closeWebcam}>
              Close
            </Button>
          </div>
          {emotion && (
            <div className="mt-4">
              <p>Emotion: {emotion}</p>
              <p>Confidence: {confidence?.toFixed(2)}</p>
            </div>
          )}
        </>
      ) : (
        <Button onClick={() => setIsCameraOpen(true)}>Open Camera</Button>
      )}
    </div>
  );
}