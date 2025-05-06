from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token  # JWT
from ..models.user import User
from .. import db, bcrypt  # hasing password
from datetime import timedelta

auth_bp = Blueprint("auth", __name__, url_prefix="/api")  #


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data received"}), 400
    username = data.get("username")
    email = data.get("email")
    password = bcrypt.generate_password_hash(data.get("password")).decode("utf-8")  # password hashing

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email già registrata"}), 400

    new_user = User(username=username, email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered with success!!"}), 201


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    user = User.query.filter_by(email=data.get("email")).first()  # search for user by email

    if user:
        print(f"Utente trovato: {user.username}")
        if bcrypt.check_password_hash(user.password, data.get("password")):

            expires = timedelta(hours=24)
            access_token = create_access_token(identity=str(user.id), expires_delta=expires)
            print("Access token creato:", access_token)
            return jsonify({
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "email": user.email
                }
            }), 200


        else:
            print("Password errata.")
    else:
        print("Utente non trovato.")

    return jsonify({"message": "Invalid credentials"}), 401
