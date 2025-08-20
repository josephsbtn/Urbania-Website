from ultralytics import YOLO
import os

if __name__ == '__main__':
    # Definisikan direktori
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    DATA_DIR = os.path.join(os.path.dirname(BASE_DIR), 'data')

    # Tentukan jalur data
    DATASET_PATH = os.path.join(DATA_DIR, 'reports')

    # Nama kelas yang benar
    CLASSES = ['Damaged concrete structures', 'DamagedElectricalPoles', 'DamagedRoadSigns', 'DeadAnimalsPollution', 'FallenTrees', 'Garbage', 'Graffitti', 'IllegalParking', 'Potholes and RoadCracks']

    # Buat file YAML untuk konfigurasi data
    yaml_content = f"""
train: {os.path.join(DATASET_PATH, 'images')}
val: {os.path.join(DATASET_PATH, 'images')}

nc: {len(CLASSES)}
names: {CLASSES}
"""
    yaml_path = os.path.join(DATASET_PATH, 'data.yaml')

    with open(yaml_path, 'w') as f:
        f.write(yaml_content)
        print("File data.yaml berhasil dibuat dengan 9 kelas.")

    # Muat model YOLOv8n yang sudah terlatih sebelumnya
    model = YOLO('yolov8n.pt')

    # Latih model
    results = model.train(
        data=yaml_path,
        epochs=10,
        imgsz=640,
        name='urban_issues_detector'
    )

    print("Model YOLOv8 berhasil dilatih dan disimpan di runs/detect/urban_issues_detector/weights/best.pt")