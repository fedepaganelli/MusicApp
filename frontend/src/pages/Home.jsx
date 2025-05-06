import React, {useState, useEffect} from "react";
import {searchSongs, getPlaylists, addSongToPlaylist} from "../services/api";


const Home = ({onPlaySong}) => {
    const [query, setQuery] = useState("");
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [playlists, setPlaylists] = useState([]);
    const [selectedPlaylists, setSelectedPlaylists] = useState({});
    const [searched, setSearched] = useState(false);


    const isLoggedIn = localStorage.getItem("token");

    useEffect(() => {
        if (isLoggedIn) {
            fetchPlaylists();
        }
    }, [isLoggedIn]);

    useEffect(() => {
        const song = JSON.parse(localStorage.getItem("selectedSong"));
        if (song) {
            onPlaySong(song);
            localStorage.removeItem("selectedSong");
        }
    }, []);


    const fetchPlaylists = async () => {
        try {
            const playlistsData = await getPlaylists();

            let userId = null;
            try {
                const userData = localStorage.getItem("user");
                if (userData) {
                    userId = JSON.parse(userData).id;
                }
            } catch (err) {
                console.error("Errore nel parsing dei dati utente:", err);
            }

            const filtered = playlistsData.filter(p => p.user_id === parseInt(userId));
            setPlaylists(filtered);
        } catch (error) {
            console.error("Errore nel recupero delle playlist:", error);
        }
    };

    const handleSearch = async () => {
        if (!query) {
            setError("Per favore, inserisci un nome di canzone!");
            return;
        }
        setLoading(true);
        setError("");
        setSearched(true);

        try {
            const results = await searchSongs(query);
            setSongs(results);
        } catch (err) {
            setError("Errore durante la ricerca. Riprova più tardi.");
        } finally {
            setLoading(false);
        }
    };

    const handlePlaylistSelect = (songId, playlistId) => { // function to handle the selection of a playlist
        setSelectedPlaylists(prev => ({
            ...prev,
            [songId]: playlistId
        }));
    };

    const handleAddToPlaylist = async (songId, playlistId) => {
        try {
            const playlist = playlists.find(p => p.id === playlistId);
            let userId = null;

            try {
                const userData = localStorage.getItem("user");
                if (userData) {
                    userId = JSON.parse(userData).id;
                }
            } catch (err) {
                console.error("Errore nel parsing dati utente:", err);
            }

            if (!playlist) throw new Error("Playlist non trovata.");
            if (playlist.user_id !== userId) throw new Error("Permessi insufficienti.");

            await addSongToPlaylist(playlistId, songId);
            alert("Canzone aggiunta con successo!");
        } catch (err) {
            console.error("Errore:", err);
            alert("Errore durante l'aggiunta.");
        }
    };


    const handlePlaySong = (song) => {

        let recentSongs = JSON.parse(localStorage.getItem("recentSongs")) || [];
        if (!recentSongs.some(s => s.id === song.id)) {  // to avoid duplicates
            recentSongs.unshift(song);  // add the song to the beginning of the array
            if (recentSongs.length > 5) {
                recentSongs.pop();
            }
            localStorage.setItem("recentSongs", JSON.stringify(recentSongs));
        }
        onPlaySong(song);
    };

    return (
        <div className="page-container">
            <div className="content-wrap">
                <h1 className="text-center">Benvenuto in MusicApp</h1>
                <p className="text-center text-white">Cerca e ascolta la tua musica preferita!</p>

                {isLoggedIn && (
                    <div className="d-flex justify-content-center mb-4">
                        <input
                            type="text"
                            className="form-control w-50"
                            placeholder="Cerca una canzone..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <button className="btn btn ms-2 bg-info-subtle text-black" onClick={handleSearch} disabled={loading}>
                            {loading ? "Caricamento..." : "Cerca"}
                        </button>
                    </div>
                )}

                {!isLoggedIn && <p className="text-center text-warning">Accedi per cercare le canzoni!</p>}
                {error && <p className="text-danger text-center text-white">{error}</p>}

                <div className="row">
                    {isLoggedIn && searched && songs.length === 0 && !loading &&
                        <p className="text-center text-warning">Nessun risultato trovato</p>}
                    {songs.map((song) => (
                        <div key={song.id} className="col-md-3 mb-5">
                            <div className="card h-100">
                                <img src={song.album_cover} className="card-img-top" alt={song.title}/>
                                <div className="card-body">
                                    <h5 className="card-title">{song.title}</h5>
                                    <p className="card-text">Artista: {song.artist}</p>
                                    <p className="card-text">Album: {song.album_title}</p>

                                    <button className="btn btn-outline-success" onClick={() => handlePlaySong(song)}>
                                        Riproduci
                                    </button>

                                    <select
                                        className="form-select my-3 w-75"
                                        value={selectedPlaylists[song.id] || ""}
                                        onChange={(e) => handlePlaylistSelect(song.id, e.target.value)}
                                    >
                                        <option value="">Seleziona una playlist</option>
                                        {playlists.map((playlist) => (
                                            <option key={playlist.id} value={playlist.id}>
                                                {playlist.name}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        className="btn btn-info w-75"
                                        onClick={() => {
                                            const selectedId = selectedPlaylists[song.id];
                                            if (selectedId) {
                                                handleAddToPlaylist(song.id, parseInt(selectedId));
                                            } else {
                                                alert("Seleziona prima una playlist.");
                                            }
                                        }}
                                    >
                                        Aggiungi alla Playlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
