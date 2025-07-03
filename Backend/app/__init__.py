# __init__.py
from flask_migrate import Migrate
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(config)

    db.init_app(app)

    migrate = Migrate(app, db)
    
    CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)


    # Register user routes
    from .user_routes import user_bp
    app.register_blueprint(user_bp, url_prefix='/user')

    #  Register crop recommendation route
    from .crop_routes import crop_bp
    app.register_blueprint(crop_bp, url_prefix='/crop')
    
    from .livestock_routes import livestock_bp
    app.register_blueprint(livestock_bp,url_prefix='/disease')

    from .inventory_routes import inventory_bp
    app.register_blueprint(inventory_bp, url_prefix="/inventory")

    return app
