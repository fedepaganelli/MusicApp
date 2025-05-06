import React, {useEffect, useState, useCallback} from "react";
import {useNavigate} from "react-router-dom";
import {getPlaylists, deletePlaylist} from "../services/api";

const PlaylistList = () => {
    const [playlists, setPlaylists] = useState([]);
    const [expandedPlaylistId, setExpandedPlaylistId] = useState(null);
    const [songsMap, setSongsMap] = useState({});
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchPlaylists = useCallback(async () => {
        const data = await getPlaylists();
        const userPlaylists = data.filter(p => p.user_id === user.id);
        setPlaylists(userPlaylists);
    }, [user.id]);

    useEffect(() => {
        fetchPlaylists();
    }, [fetchPlaylists]);


    const handleDeletePlaylist = async (playlistId) => {
        await deletePlaylist(playlistId);
        fetchPlaylists();
    };

    // function to fetch/toggle songs for a playlist
    const toggleSongs = async (playlistId) => {
        if (expandedPlaylistId === playlistId) {
            setExpandedPlaylistId(null);
        } else {
            if (!songsMap[playlistId]) {
                const token = localStorage.getItem("token");


                const res = await fetch(`http://localhost:5000/api/playlists/${playlistId}/songs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await res.json();
                setSongsMap(prev => ({...prev, [playlistId]: data}))
            }
            setExpandedPlaylistId(playlistId);
        }
    };

    const removeSongFromPlaylist = async (playlistId, songId) => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:5000/api/playlists/${playlistId}/remove-song`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({song_id: songId}),
            });

            const result = await response.json();

            if (response.ok) {

                // remove the song from the songsMap state
                setSongsMap(prevState => {
                    const updatedSongs = prevState[playlistId].filter(song => song.id !== songId);
                    return {...prevState, [playlistId]: updatedSongs};
                });
            } else {
                console.error(result.message);
            }
        } catch (error) {
            console.error("Errore nella rimozione della canzone:", error);
        }
    };

    const handlePlaySong = (song) => {
        console.log("Riproducendo canzone:", song);

        localStorage.setItem("selectedSong", JSON.stringify(song));


        let recentSongs = JSON.parse(localStorage.getItem("recentSongs")) || [];
        if (!recentSongs.some(s => s.id === song.id)) {  // to check if the song is already in recent songs
            recentSongs.unshift(song);
            if (recentSongs.length > 5) {
                recentSongs.pop();
            }
            localStorage.setItem("recentSongs", JSON.stringify(recentSongs));
        }

        // navigate to the player page with the selected song
        navigate("/", {state: {song}});
    };

    return (
        <div>
            <h2>Le tue Playlist</h2>
            <ul className="list-group">
                {playlists.map((playlist) => (
                    <li key={playlist.id} className="list-group-item mb-3 border rounded">
                        <div className="d-flex justify-content-between align-items-center">
                            <strong>{playlist.name}</strong>
                            <div>
                                <button
                                    className="btn btn-sm btn-outline-secondary me-2"
                                    onClick={() => toggleSongs(playlist.id)}
                                >
                                    {expandedPlaylistId === playlist.id ? "Nascondi brani" : "Mostra brani"}
                                </button>
                                <button
                                    className="btn btn-sm btn-danger"
                                    onClick={() => handleDeletePlaylist(playlist.id)}
                                >
                                    Elimina Playlist
                                </button>
                            </div>
                        </div>

                        {expandedPlaylistId === playlist.id && songsMap[playlist.id] && (
                            <ul className="list-group mt-2 mb-2 border rounded p-1 bg-info bg-opacity-25 ">
                                {songsMap[playlist.id].map(song => (
                                    <li
                                        key={song.id}
                                        className="list-group-item d-flex justify-content-between align-items-center"
                                    >
                                        {song.title} - {song.artist}
                                        <div>
                                            <button
                                                className="btn btn-primary btn-sm me-2"
                                                onClick={() => handlePlaySong(song)}
                                            >
                                                Riproduci
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm ms-2"
                                                onClick={() => removeSongFromPlaylist(playlist.id, song.id)}
                                            >
                                                Rimuovi
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlaylistList;
