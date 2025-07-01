# models.py

from app import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    inventories = db.relationship('Inventory', backref='owner', lazy=True)  # ✅ Link
    
class Inventory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    quantity = db.Column(db.Integer, nullable=True)
    remaining = db.Column(db.Integer, nullable=True)
    date_bought = db.Column(db.Date, nullable=True)
    expiration_date = db.Column(db.Date, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # ✅ New line