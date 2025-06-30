from flask import Blueprint, request, jsonify
import joblib
import numpy as np

crop_bp = Blueprint("crop", __name__)

# Load the trained crop recommendation model
crop_model = joblib.load("app/models/crop_model.pkl")

@crop_bp.route("/recommend", methods=["POST"])
def recommend_crop():
    data = request.json
    try:
        input_data = np.array([[ 
            data["N"], data["P"], data["K"],
            data["temperature"], data["humidity"],
            data["ph"], data["rainfall"]
        ]])

        prediction = crop_model.predict(input_data)
        return jsonify({"recommended_crop": prediction[0]})
    except Exception as e:
        return jsonify({"error": str(e)}), 400
