from flask import Blueprint, request, jsonify

login_bp = Blueprint("login", __name__)  # ✅ This must exist!

# Dummy login route
@login_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if email == "user@agrosync.com" and password == "test123":
        return jsonify({"message": "Login successful", "status": "success"})
    else:
        return jsonify({"message": "Invalid credentials", "status": "fail"})
