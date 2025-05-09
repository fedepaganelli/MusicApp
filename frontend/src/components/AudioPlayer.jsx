import React, {useEffect} from "react";

const AudioPlayer = ({ currentSong, isPlaying, onPlayPause, volume, onVolumeChange, audioRef }) => {


    useEffect(() => {
        if (audioRef.current && currentSong?.preview_url) {
            audioRef.current.src = currentSong.preview_url;
            audioRef.current.play().catch(err => console.error("Errore nella riproduzione:", err));
        }
    }, [currentSong, audioRef]);

    // to handle the play/pause functionality
    useEffect(() => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.play().catch(err => console.error("Errore nella riproduzione:", err));
        } else {
            audioRef.current.pause();
        }
    }, [isPlaying, audioRef]);


    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume, audioRef]);

    return currentSong ? (
        <div className="fixed-bottom bg-dark bg-opacity-75 text-white p-3">
            <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                    <img src={currentSong.album_cover} alt={currentSong.album_title}
                         style={{width: "50px", borderRadius: "5px", marginRight: "10px"}}/>
                    <strong>{currentSong.title}</strong> - {currentSong.artist}
                </div>
                <audio ref={audioRef} onEnded={() => onPlayPause(false)} />
                <div>
                    <button className="btn btn-light me-3" onClick={() => onPlayPause(!isPlaying)}>
                        {isPlaying ? "Pause" : "Play"}
                    </button>
                    <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={volume}
                        onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    />
                </div>
            </div>
        </div>
    ) : null;
};

export default AudioPlayer;
