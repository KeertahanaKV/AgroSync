# __init__.py

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)
    CORS(app)

    # Register user routes
    from .user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix='/user')

    # ✅ Register crop recommendation route
    from .crop_routes import crop_bp
    app.register_blueprint(crop_bp, url_prefix='/crop')


    return app
