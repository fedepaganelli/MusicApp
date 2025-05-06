from .. import db

class Playlist(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(120),nullable=False)
    user_id=db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    songs=db.relationship("Song",secondary="playlist_song", backref="playlists")

    def to_dict(self):

        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "songs": [song.to_dict() for song in self.songs]
        }


playlist_song=db.Table(
    "playlist_song",
    db.Column("playlist_id",db.Integer,db.ForeignKey("playlist.id"),primary_key=True),
    db.Column("song_id",db.String(50),db.ForeignKey("song.id"),primary_key=True),
)
