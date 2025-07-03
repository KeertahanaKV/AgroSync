from flask import Blueprint, request, jsonify
import joblib
import pandas as pd

livestock_bp = Blueprint("livestock", __name__)

# Load the trained livestock disease model
model = joblib.load("app/models/livestock_disease_model.pkl")

@livestock_bp.route("/predict-disease", methods=["POST"])
def predict_disease():
    try:
        data = request.json

        # Expected JSON keys: Animal, Age, Temperature, Symptom 1, Symptom 2, Symptom 3
        input_df = pd.DataFrame([{
            "Animal": data["Animal"],
            "Age": data["Age"],
            "Temperature": data["Temperature"],
            "Symptom 1": data["Symptom 1"],
            "Symptom 2": data["Symptom 2"],
            "Symptom 3": data["Symptom 3"]
        }])

        # Predict disease
        prediction = model.predict(input_df)

        return jsonify({"predicted_disease": prediction[0]})

    except Exception as e:
        return jsonify({"error": str(e)}), 400
