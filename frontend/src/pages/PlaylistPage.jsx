import React from "react";
import PlaylistList from "../components/PlaylistList";
import CreatePlaylist from "../components/CreatePlaylist";

const PlaylistPage = () => {
    const handlePlaylistCreated = () => console.log("Nuova playlist creata!!");

    return (
        <div className="container py-4">
            <h1 className="text-center mb-4">Gestione Playlist</h1>
            <div className="row">
                <div className="col-md-6">
                    <div className="card p-4 shadow-sm">
                        <CreatePlaylist userId={1} onPlaylistCreated={handlePlaylistCreated} />
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card p-4 shadow-sm">
                        <PlaylistList />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaylistPage;
