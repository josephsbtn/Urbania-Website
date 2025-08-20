from flask import Flask, request, jsonify
from models.image_classifier import classify_report
from models.forecast import forecast_electricity, forecast_water
from models.solar import estimate_solar

app = Flask(__name__)

# 1️⃣ Endpoint klasifikasi laporan (image + description)
@app.route("/classify", methods=["POST"])
def classify():
    description = request.form.get("description") or (request.json.get("description") if request.json else None)
    
    file = request.files.get("image")
    image_base64 = request.json.get("image_base64") if request.json else None

    if file:
        result = classify_report(file, description)
    elif image_base64:
        result = classify_report(image_base64, description, is_base64=True)
    else:
        return jsonify({"error": "No image or Base64 data uploaded"}), 400

    return jsonify(result)

# 2️⃣ Endpoint forecasting listrik
@app.route("/forecast/electricity", methods=["GET"])
def forecast_elec():
    result = forecast_electricity()
    return jsonify(result)

# 3️⃣ Endpoint forecasting air
@app.route("/forecast/water", methods=["GET"])
def forecast_wat():
    result = forecast_water()
    return jsonify(result)

# 4️⃣ Endpoint solar rooftop estimation
@app.route("/solar", methods=["POST"])
def solar():
    data = request.get_json()
    lat = data.get("lat")
    lon = data.get("lon")

    if not lat or not lon:
        return jsonify({"error": "lat/lon required"}), 400

    result = estimate_solar(lat, lon)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)