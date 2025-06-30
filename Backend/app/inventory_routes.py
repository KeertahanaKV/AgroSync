from flask import Blueprint, request, jsonify
from flask_cors import cross_origin
from app import db
from app.models import Inventory
from datetime import datetime

inventory_bp = Blueprint("inventory_bp", __name__)

# 📦 Get all inventory items
@inventory_bp.route("/all", methods=["GET"])
@cross_origin()
def get_inventory():
    try:
        items = Inventory.query.all()
        data = []
        for item in items:
            data.append({
                "id": item.id,
                "name": item.name,
                "price": item.price,
                "quantity": item.quantity,
                "remaining": item.remaining,
                "dateBought": item.date_bought.strftime("%Y-%m-%d") if item.date_bought else "",
                "expirationDate": item.expiration_date.strftime("%Y-%m-%d") if item.expiration_date else "",
                "category": item.category
            })
        return jsonify(data), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# 🚀 Add inventory item (handles Tools and other categories)
@inventory_bp.route("/add", methods=["POST"])
@cross_origin()
def add_inventory_item():
    data = request.form
    try:
        # Get values
        name = data.get("name")
        price_raw = data.get("price")
        category = data.get("category")

        # 🛑 Validation
        if not name or not price_raw or not category:
            return jsonify({"error": "Missing required fields"}), 400
        
        try:
            price = float(price_raw)
        except ValueError:
            return jsonify({"error": "Invalid price format"}), 400

        # Optional values
        date_bought_str = data.get("dateBought")
        date_bought = datetime.strptime(date_bought_str, "%Y-%m-%d") if date_bought_str else None

        expiration = data.get("expirationDate")
        expiration_date = datetime.strptime(expiration, "%Y-%m-%d") if expiration else None

        quantity = int(data.get("quantity")) if data.get("quantity") else None
        remaining = int(data.get("remaining")) if data.get("remaining") else None

        # Save to DB
        item = Inventory(
            name=name,
            price=price,
            quantity=quantity,
            remaining=remaining,
            date_bought=date_bought,
            expiration_date=expiration_date,
            category=category,
        )
        db.session.add(item)
        db.session.commit()
        return jsonify({"message": "Item added successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500




# ❌ Delete an inventory item
@inventory_bp.route("/delete/<int:item_id>", methods=["DELETE", "OPTIONS"])
@cross_origin()
def delete_inventory_item(item_id):
    try:
        item = Inventory.query.get(item_id)
        if not item:
            return jsonify({"message": "Item not found"}), 404

        db.session.delete(item)
        db.session.commit()
        return jsonify({"message": "Item deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# ✏️ Update inventory item (price & quantity only)
@inventory_bp.route("/update/<int:item_id>", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_inventory_item(item_id):
    try:
        data = request.get_json()
        item = Inventory.query.get(item_id)
        if not item:
            return jsonify({"message": "Item not found"}), 404

        if "price" in data:
            item.price = float(data["price"])
        if "quantity" in data:
            item.quantity = int(data["quantity"])

        db.session.commit()
        return jsonify({"message": "Item updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
