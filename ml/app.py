from flask import Flask, request, jsonify
from models.image_classifier import classify_report
from models.forecast import forecast_electricity, forecast_water
from models.solar import estimate_solar

app = Flask(__name__)

@app.route("/classify", methods=["POST"])
def classify():
    description = request.form.get("description")
    file = request.files.get("image")
    
    if not file:
        return jsonify({"error": "No image uploaded"}), 400

    result = classify_report(file, description)
    return jsonify(result)

@app.route("/forecast/electricity", methods=["GET"])
def forecast_elec():
    result = forecast_electricity()
    return jsonify(result)

@app.route("/forecast/water", methods=["GET"])
def forecast_wat():
    result = forecast_water()
    return jsonify(result)

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
