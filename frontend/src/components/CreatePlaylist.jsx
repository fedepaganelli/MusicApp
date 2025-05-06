import React, {useState} from "react";
import {createPlaylist} from "../services/api";

const CreatePlaylist = ({onPlaylistCreated}) => {
    const [name, setName] = useState("");

    const handleCreatePlaylist = async () => {
        if (!name) {
            alert("Devi inserire un nome per la playlist!");
            return;
        }

        const token = localStorage.getItem("token");

        try {

            await createPlaylist(name, token);
            setName("");
            onPlaylistCreated();
        } catch (error) {
            alert("Errore durante la creazione della playlist.");
        }
    };

    return (
        <div>
            <h2>Crea una nuova Playlist</h2>
            <input
                type="text"
                placeholder="Nome della playlist"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button className="btn btn-info bg-light-subtle m-md-2" onClick={handleCreatePlaylist}>Crea Playlist</button>
        </div>
    );
};

export default CreatePlaylist;
