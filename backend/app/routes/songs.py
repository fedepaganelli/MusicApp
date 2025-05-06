from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.song import Song
from .. import db
import requests

songs_bp = Blueprint("songs", __name__, url_prefix="/api/songs")


@songs_bp.route("/search", methods=["GET"])
@jwt_required()  # decorator to protect the route
def search_songs():
    try:
        current_user = get_jwt_identity()   # recover the identity of the current user
        print(f"Utente autenticato: {current_user}")
    except Exception as e:
        print(f"Errore durante la decodifica del token JWT: {str(e)}")
        return jsonify({"message": "Token non valido o assente"}), 401

    query = request.args.get("q")   # extract the query parameter from the request

    if not query:
        return jsonify({"message": "è richiesto il parametro 'song' "}), 400

    deezer_url = f"https://api.deezer.com/search?q={query}"
    response = requests.get(deezer_url) # GET request to Deezer API

    if response.status_code != 200:
        return jsonify({"message": "Errore nel recupero dei dati da Deezer.com"}), 500

    songs = []
    for track in response.json()["data"]:
        song = Song(
            title=track["title"],
            artist=track["artist"]["name"],
            duration=track["duration"],
            album_cover=track["album"]["cover_medium"],
            album_title=track["album"]["title"],
            preview_url=track["preview"]
        )
        db.session.add(song)
        db.session.commit()

        songs.append({  # adding the song to the dictionary
            "id": song.id,
            "title": song.title,
            "artist": song.artist,
            "duration": song.duration,
            "album_cover": song.album_cover,
            "album_title": song.album_title,
            "preview_url": song.preview_url
        })

    return jsonify(songs), 200
