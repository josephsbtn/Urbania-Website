from ultralytics import YOLO
import os
import shutil

# Muat model YOLOv8 yang sudah dilatih
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

def classify_report(file, description):
    # Simpan file sementara
    temp_dir = "temp_images"
    os.makedirs(temp_dir, exist_ok=True)
    temp_file_path = os.path.join(temp_dir, file.filename)
    file.save(temp_file_path)

    # Jalankan prediksi dengan YOLO
    results = yolo_model.predict(temp_file_path)
    
    # Hapus file sementara
    shutil.rmtree(temp_dir)

    # Proses hasil
    detections = []
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