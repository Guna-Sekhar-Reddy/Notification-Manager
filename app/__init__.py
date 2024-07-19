from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from firebase_admin import credentials, initialize_app
import os
import configparser
from flask_login import LoginManager
 
# Load configuration
config = configparser.ConfigParser()
config.read("notifier.cfg")
db_host = config["DATABASE"]["host"]
db_port = config["DATABASE"]["port"]
db_user = config["DATABASE"]["user"]
db_pass = config["DATABASE"]["password"]
db_name = config["DATABASE"]["database"]
secret_key=config["DEFAULT"]["secret_key"]
path_to_firebase_sdk=config["DEFAULT"]["path_to_firebase_sdk"]
path_to_firebase_app_sdk=config["DEFAULT"]["path_to_firebase_app_sdk"]
 
app = Flask(__name__)
connectStr = f"mysql+pymysql://{db_user}:{db_pass}@{db_host}/{db_name}"
app.config["SQLALCHEMY_DATABASE_URI"] = connectStr
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

app.secret_key = secret_key

db = SQLAlchemy(app)
migrate = Migrate(app, db)
 
cred = credentials.Certificate(f"{path_to_firebase_sdk}")
initialize_app(cred)
 
# Initialize Flask-Login
login_manager = LoginManager()
login_manager.init_app(app)

login_manager.login_view = 'login'
 
# Define the function to load a user
from .models import LoginUser  # Importing here to avoid circular import
@login_manager.user_loader
def load_user(user_id):
    return LoginUser.query.get(int(user_id))
 
from app import routes  # Import routes after app initialization
