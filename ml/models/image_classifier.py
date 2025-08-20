from ultralytics import YOLO
import os
import shutil
import base64
from PIL import Image
import io

MODEL_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'runs', 'detect', 'urban_issues_detector', 'weights', 'best.pt')
yolo_model = YOLO(MODEL_PATH)

CLASSES = {
    0: 'Damaged concrete structures',
    1: 'DamagedElectricalPoles',
    2: 'DamagedRoadSigns',
    3: 'DeadAnimalsPollution',
    4: 'FallenTrees',
    5: 'Garbage',
    6: 'Graffitti',
    7: 'IllegalParking',
    8: 'Potholes and RoadCracks'
}

def classify_report(image_data, description, is_base64=False):
    if is_base64:
        # Mendekode string Base64
        image_bytes = base64.b64decode(image_data)
        img = Image.open(io.BytesIO(image_bytes))
    else:
        # Membaca file gambar
        img = Image.open(image_data.stream)

    # Jalankan prediksi dengan YOLO
    results = yolo_model.predict(img)
    
    if results and results[0].boxes:
        top_detection = results[0].boxes[0]
        class_id = int(top_detection.cls[0])
        confidence = float(top_detection.conf[0])
        
        return {
            "description": description,
            "predicted_class": CLASSES.get(class_id, "unknown"),
            "confidence": round(confidence, 3)
        }
    
    return {
        "description": description,
        "predicted_class": "No objects detected",
        "confidence": 0.0
    }