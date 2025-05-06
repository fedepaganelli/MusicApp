import os

from flask import Flask, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_bcrypt import Bcrypt
from flask_migrate import Migrate
from datetime import timedelta
from dotenv import load_dotenv

db = SQLAlchemy()
cors = CORS()
jwt = JWTManager()
bcrypt = Bcrypt()
migrate = Migrate()
load_dotenv()


def create_app():
    app = Flask(__name__,
                static_folder=os.path.abspath(os.path.join(os.path.dirname(__file__), "../../frontend/build")),
                static_url_path="/")
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///../instance/database.db"
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
    app.config["CORS_HEADERS"] = "Content-Type"
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=24)

    db.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})
    jwt.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app, db)

    from .models.user import User
    from .models.playlist import Playlist
    from .models.song import Song

    with app.app_context():
        db.create_all()  # create the database tables if they don't exist

    from .routes.auth import auth_bp
    from .routes.songs import songs_bp
    from .routes.playlists import playlists_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(songs_bp)
    app.register_blueprint(playlists_bp)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve(path):
        print(f"Requested path: {path}")  # Aggiungi questa riga per il debug
        full_path = os.path.join(app.static_folder, path)
        print(f"Full file path: {full_path}")  # Verifica il percorso assoluto

        if path != "" and os.path.exists(full_path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, "index.html")

    return app
