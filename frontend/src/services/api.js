import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const searchSongs = async (query) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Devi essere loggato per cercare canzoni");
        }

        const response = await axios.get(`${API_URL}/songs/search?q=${query}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Errore nella ricerca delle canzoni:", error.response?.data || error.message);
        return [];
    }
};

export const getPlaylists = async () => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Token non trovato. Assicurati di essere loggato.");
        }

        const response = await axios.get(`${API_URL}/playlists/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error("Errore nel recupero delle playlist:", error.response?.data || error.message);
        return [];
    }
};

export const createPlaylist = async (name) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Devi essere loggato per creare una playlist");
        }

        const response = await axios.post(
            `${API_URL}/playlists/`,
            {name},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Errore nella creazione della playlist:", error.response?.data || error.message);
        throw error;
    }
};

export const addSongToPlaylist = async (playlist_id, song_id) => {
    try {
        const token = localStorage.getItem("token");

        console.log("Chiamata API con (playlist_id,song_id,token):", {playlist_id, song_id, token});    // log for debugging

        if (!token) {
            throw new Error("Devi essere loggato per aggiungere una canzone alla playlist");
        }

        const response = await axios.post(
            `${API_URL}/playlists/${playlist_id}/add-song`,
            {song_id},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Errore nell'aggiungere la canzone alla playlist:", error.response?.data || error.message);
        throw error;
    }
};

export const deletePlaylist = async (playlist_id) => {
    try {
        const token = localStorage.getItem("token");

        if (!token) {
            throw new Error("Devi essere loggato per eliminare una playlist");
        }

        const response = await axios.delete(`${API_URL}/playlists/${playlist_id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Errore nell'eliminare la playlist:", error.response?.data || error.message);
        throw error;
    }
};


