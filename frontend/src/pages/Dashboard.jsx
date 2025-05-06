import React, {useEffect, useState} from "react";
import {getPlaylists} from "../services/api";

const Dashboard = () => {
    const [username, setUsername] = useState("");
    const [playlistCount, setPlaylistCount] = useState(0);
    const [songCount, setSongCount] = useState(0);
    const [recentSongs, setRecentSongs] = useState([]);

    useEffect(() => {

        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData) {
            setUsername(userData.username);
        }


        const recent = JSON.parse(localStorage.getItem("recentSongs")) || [];
        setRecentSongs(recent);


        fetchUserStats(userData?.id);
    }, []);

    const fetchUserStats = async (userId) => {
        try {
            const playlists = await getPlaylists();
            const userPlaylists = playlists.filter(p => p.user_id === userId);
            setPlaylistCount(userPlaylists.length);

            let totalSongs = 0;
            for (let playlist of userPlaylists) {
                const token = localStorage.getItem("token");
                const res = await fetch(`http://localhost:5000/api/playlists/${playlist.id}/songs`, {
                    headers: {Authorization: `Bearer ${token}`}
                });
                const data = await res.json();
                totalSongs += data.length;
            }
            setSongCount(totalSongs);
        } catch (error) {
            console.error("Errore nel recupero delle statistiche:", error);
        }
    };

    return (
        <div className="container mt-5 mb-auto">
            <h1>Ciao, {username}!</h1>
            <p>Benvenuto nella tua area personale.</p>

            <div className="row mt-4">
                <div className="col-md-6">
                    <div className="card text-white bg-info mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Playlist create</h5>
                            <p className="card-text fs-4">{playlistCount}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card text-white bg-primary mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Canzoni aggiunte</h5>
                            <p className="card-text fs-4">{songCount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <h3 className="mt-5">Ultime canzoni ascoltate</h3>
            {recentSongs.length === 0 ? (
                <p>Non hai ancora ascoltato canzoni.</p>
            ) : (
                <ul className="list-group mt-3 w-75">
                    {recentSongs.map((song, index) => (
                        <li key={index} className="list-group-item bg-white text-black">
                            {song.title} - {song.artist}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dashboard;
