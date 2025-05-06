from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models.playlist import Playlist
from .. import db
from ..models.song import Song

playlists_bp = Blueprint("playlists", __name__, url_prefix="/api/playlists")


@playlists_bp.route("/", methods=["GET"])
@jwt_required()
def get_playlists():
    user_id = get_jwt_identity()
    playlists = Playlist.query.filter_by(user_id=user_id).all()
    return jsonify([playlist.to_dict() for playlist in
                    playlists]), 200  # return a list of playlists in JSON format


@playlists_bp.route("/", methods=["POST"])
@jwt_required()
def create_playlist():
    data = request.get_json()
    user_id = get_jwt_identity()

    if not data.get("name"):
        return jsonify({"message": "Il nome della playlist è obbligatorio"}), 400

    try:
        new_playlist = Playlist(name=data["name"], user_id=user_id)
        db.session.add(new_playlist)
        db.session.commit()
        print(f"Playlist creata: {new_playlist.name} per l'utente ID {user_id}")
        return jsonify({"message": "Playlist creata con successo!", "playlist_id": new_playlist.id}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Errore durante la creazione della playlist: {str(e)}")
        return jsonify({"message": f"Errore durante la creazione della playlist: {str(e)}"}), 500


@playlists_bp.route("/<int:playlist_id>/add-song", methods=["POST"])
@jwt_required()
def add_song_to_playlist(playlist_id):
    user_id = get_jwt_identity()
    playlist = Playlist.query.get_or_404(playlist_id)

    print(f"User ID loggato: {user_id}")
    print(
        f"Playlist ID: {playlist_id}, Playlist User ID: {playlist.user_id}")


    if playlist.user_id != int(user_id):
        print("Accesso negato: la playlist non ti appartiene")
        return jsonify({"message": "Accesso negato: questa playlist non ti appartiene"}), 403

    data = request.get_json()
    song_id = data.get("song_id")
    song = Song.query.get_or_404(song_id)  # get the song by ID from the database

    print(f"Song ID ricevuto: {song_id}, Song: {song.title}")


    if song not in playlist.songs:
        playlist.songs.append(song)
        db.session.commit()  # save changes to the database
        print("Canzone aggiunta con successo!")

        return jsonify({"message": "Canzone aggiunta alla playlist con successo"}), 200
    else:
        print("La canzone è già presente nella playlist")

        return jsonify({"message": "La canzone è già presente nella playlist"}), 400


@playlists_bp.route("/<int:playlist_id>", methods=["DELETE"])
@jwt_required()
def delete_playlist(playlist_id):
    user_id = int(get_jwt_identity())

    playlist = Playlist.query.get_or_404(playlist_id)

    if playlist.user_id != user_id:
        return jsonify({"message": "Accesso negato: non puoi eliminare playlist di altri utenti"}), 403

    # remove all the association between the playlist and the songs
    playlist.songs.clear()
    db.session.delete(playlist)
    db.session.commit()

    return jsonify({"message": "Playlist eliminata con successo"}), 200


@playlists_bp.route("/<int:playlist_id>/songs", methods=["GET"])
@jwt_required()
def get_songs_for_playlist(playlist_id):
    user_id = int(get_jwt_identity())
    playlist = Playlist.query.get_or_404(playlist_id)

    # verify if the playlist belongs to the user
    if playlist.user_id != user_id:
        return jsonify(
            {"message": "Accesso negato: non puoi vedere le canzoni di una playlist di un altro utente"}), 403

    songs = playlist.songs  # recover the songs associated with the playlist
    return jsonify([song.to_dict() for song in songs]), 200


@playlists_bp.route("/<int:playlist_id>/remove-song", methods=["POST"])
@jwt_required()
def remove_song_from_playlist(playlist_id):
    user_id = int(get_jwt_identity())
    playlist = Playlist.query.get_or_404(playlist_id)

    if playlist.user_id != user_id:
        return jsonify({"message": "Accesso negato: questa playlist non ti appartiene"}), 403

    data = request.get_json()
    song_id = data.get("song_id")
    song = Song.query.get_or_404(song_id)

    if song in playlist.songs:
        playlist.songs.remove(song)
        db.session.commit()
        return jsonify({"message": "Canzone rimossa dalla playlist con successo"}), 200
    else:
        return jsonify({"message": "La canzone non è presente nella playlist"}), 400
