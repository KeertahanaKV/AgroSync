from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from app import db
from app.models import User
import jwt, datetime
from functools import wraps

user_bp = Blueprint("user", __name__)

# ✅ Token Auth Decorator
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("x-access-token")
        if not token:
            return jsonify({"message": "Token missing!"}), 401
        try:
            data = jwt.decode(token, current_app.config["SECRET_KEY"], algorithms=["HS256"])
            current_user = User.query.filter_by(email=data["email"]).first()
        except:
            return jsonify({"message": "Token invalid or expired!"}), 401
        return f(current_user, *args, **kwargs)
    return decorated

# ✅ SIGNUP
@user_bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    name = data["name"]
    email = data["email"]
    password = generate_password_hash(data["password"])
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already registered"}), 400
    new_user = User(name=name, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "Registered successfully!"}), 201

# ✅ LOGIN
@user_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password, password):
        return jsonify({"message": "Invalid credentials"}), 401
    token = jwt.encode({
        "email": user.email,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    }, current_app.config["SECRET_KEY"], algorithm="HS256")
    return jsonify({"token": token}), 200

# ✅ DASHBOARD (Protected)
@user_bp.route("/dashboard", methods=["GET"])
@token_required
def dashboard(current_user):
    inventory = [{
        "id": item.id,
        "name": item.name,
        "price": item.price,
        "quantity": item.quantity,
        "category": item.category,
        "expirationDate": item.expiration_date.strftime("%Y-%m-%d") if item.expiration_date else ""
    } for item in current_user.inventories]
    
    return jsonify({
        "message": f"Welcome {current_user.name}",
        "email": current_user.email,
        "inventory": inventory
    })
