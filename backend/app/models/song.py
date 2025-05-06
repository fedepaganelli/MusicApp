from .. import db

class Song(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    title=db.Column(db.String(120),nullable=False)
    artist=db.Column(db.String(120),nullable=False)
    duration=db.Column(db.Integer,nullable=False)
    album_cover=db.Column(db.String(255),nullable=False)
    album_title=db.Column(db.String(255),nullable=False)
    preview_url=db.Column(db.String(255),nullable=False)


    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "artist": self.artist,
            "album_title": self.album_title,
            "album_cover": self.album_cover,
            "duration": self.duration,
            "preview_url": self.preview_url,
        }

    def __repr__(self):
        return f"<Song {self.title} by {self.artist}>"