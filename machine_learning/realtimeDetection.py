import cv2
import numpy as np
from keras.models import model_from_json
from keras.preprocessing import image
import h5py
import os

# File paths
model_json_path = "emotiondetectorss.json"
model_weights_path = "facial_expressionss.h5"

# Load model
def load_model():
    try:
        with open(model_json_path, "r") as json_file:
            model_json = json_file.read()
        model = model_from_json(model_json)
        model.load_weights(model_weights_path)
        print("Model loaded successfully")
        return model
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        exit(1)

model = load_model()

# Load Haar cascade for face detection
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Emotion labels
labels = {0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}

# Function to detect emotion
def detect_emotion(img):
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.3, 5)
    results = []
    for (x, y, w, h) in faces:
        roi_gray = cv2.resize(gray[y:y + h, x:x + w], (48, 48))
        img_array = image.img_to_array(roi_gray)
        img_array = np.expand_dims(img_array, axis=0) / 255.0  # Normalize
        predictions = model.predict(img_array)
        emotion_label = labels[np.argmax(predictions)]
        results.append({
            'emotion': emotion_label,
            'confidence': float(np.max(predictions)),
            'bounding_box': {'x': int(x), 'y': int(y), 'width': int(w), 'height': int(h)}
        })
    return results

# Start webcam video capture
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to capture frame")
        break

    # Detect emotions
    results = detect_emotion(frame)

    # Draw bounding boxes and labels on the frame
    for result in results:
        box = result['bounding_box']
        cv2.rectangle(frame, (box['x'], box['y']), (box['x'] + box['width'], box['y'] + box['height']), (255, 0, 0), 2)
        cv2.putText(frame, f"{result['emotion']} ({result['confidence']:.2f})", 
                    (box['x'], box['y'] - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 0, 0), 2)

    # Display the resulting frame
    cv2.imshow('Emotion Detection', frame)

    # Break the loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release the capture and close windows
cap.release()
cv2.destroyAllWindows()
