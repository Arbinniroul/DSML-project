from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from keras.models import model_from_json
from keras.preprocessing import image
import logging
import os
import h5py
from werkzeug.datastructures import FileStorage

# File paths
model_json_path = "emotiondetectorss.json"
model_weights_path = "facial_expressionss.h5"

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Validate model files
if not os.path.exists(model_json_path):
    logger.error(f"Error: {model_json_path} not found. Ensure it was saved correctly.")
    exit(1)

if not os.path.exists(model_weights_path):
    logger.error(f"Error: {model_weights_path} not found. Ensure it was saved correctly.")
    exit(1)

try:
    with h5py.File(model_weights_path, 'r') as f:
        logger.info("Model weights file is valid")
except Exception as e:
    logger.error(f"Corrupt model file: {str(e)}")
    exit(1)

# Load model once during app startup
def load_model():
    try:
        with open(model_json_path, "r") as json_file:
            model_json = json_file.read()
        model = model_from_json(model_json)
        model.load_weights(model_weights_path)
        logger.info("Model loaded successfully")
        return model
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        exit(1)

model = load_model()

# Load Haar cascade
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
if face_cascade.empty():
    logger.error("Failed to load Haar cascade classifier.")
    exit(1)

labels = {0: 'angry', 1: 'disgust', 2: 'fear', 3: 'happy', 4: 'neutral', 5: 'sad', 6: 'surprise'}

# Flask app setup
app = Flask(__name__)
CORS(app, origins="http://localhost:3000")  # Specify allowed origin for security

def validate_image(file: FileStorage):
    """
    Validate the uploaded image file.
    """
    if not file.content_type.startswith('image/'):
        return False, "Invalid file type. Only images are allowed."
    
    file.seek(0, 2)  # Move to the end of the file
    file_size = file.tell()  # Get file size
    file.seek(0)  # Reset file pointer to the beginning

    if file_size > 5 * 1024 * 1024:  # 5MB limit
        return False, "File too large (max 5MB)."
    
    return True, ""

def detect_emotion(img):
    """
    Detect emotions in the image using the loaded model.
    """
    try:
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(gray, 1.3, 5)
        results = []
        for (x, y, w, h) in faces:
            roi_gray = cv2.resize(gray[y:y+h, x:x+w], (48, 48))
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
    except Exception as e:
        logger.error(f"Detection error: {str(e)}")
        return []

@app.route('/detect', methods=['POST'])
def process_image():
    """
    Handle image upload and emotion detection.
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file: FileStorage = request.files['file']
        is_valid, message = validate_image(file)
        if not is_valid:
            return jsonify({'error': message}), 400
        
        # Read image file
        img_array = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
        if img is None:
            return jsonify({'error': 'Invalid image file'}), 400
        
        # Detect emotions
        results = detect_emotion(img)
        return jsonify({
            'success': True,
            'results': results,
            'image_size': {'width': img.shape[1], 'height': img.shape[0]}
        })
    except Exception as e:
        logger.error(f"API error: {str(e)}", exc_info=True)
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    from waitress import serve
    logger.info("Starting server on http://0.0.0.0:5001")
    serve(app, host="0.0.0.0", port=5001)
