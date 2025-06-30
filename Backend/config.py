import os

DB_NAME = 'agrosync'
DB_USER = 'keerthana'
DB_HOST = 'localhost'
DB_PASSWORD = 'agrosync2025'

SQLALCHEMY_DATABASE_URI = f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = 'your_secret_key_here'
