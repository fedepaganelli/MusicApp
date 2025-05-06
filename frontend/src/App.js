import React, {useState, useRef} from "react";
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PlaylistPage from "./pages/PlaylistPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AudioPlayer from "./components/AudioPlayer";
import logo from "./images/music-app-logo.png";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg bg-white border rounded mb-2">
            <div className="container">
                <Link className="navbar-brand d-flex align-items-center" to="/">
                    <img src={logo} alt="MusicApp Logo" style={{width: "120px", height: "90px", marginRight: "10px"}}/>
                    <strong>MusicApp</strong>
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item"><Link className="nav-link bg-info-subtle border rounded" to="/">Home</Link></li>
                        {!token ? (
                            <>
                                <li className="nav-item"><Link className="nav-link bg-info-subtle border rounded" to="/login">Login</Link></li>
                                <li className="nav-item"><Link className="nav-link bg-info-subtle border rounded" to="/register">Registrazione</Link>
                                </li>
                            </>
                        ) : (
                            <>
                                <li className="nav-item"><Link className="nav-link bg-info-subtle border rounded" to="/dashboard">Dashboard</Link>
                                </li>
                                <li className="nav-item"><Link className="nav-link bg-info-subtle border rounded" to="/playlists">Playlists</Link>
                                </li>
                                <li className="nav-item">
                                    <button className="btn btn-danger ms-2" onClick={handleLogout}>Logout</button>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

const App = () => {
    const [currentSong, setCurrentSong] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1.0);
    const audioRef = useRef(null);

    const playSong = (song) => {
        setCurrentSong(song);
        setIsPlaying(true);
    };

    const handleVolumeChange = (newVolume) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };

    return (
        <Router>
            <div className="container-fluid bg-dark text-white min-vh-100">
                <Navbar/>
                <div className="container py-4">
                    <Routes>
                        <Route path="/" element={
                            <Home onPlaySong={playSong}/>
                        }/>
                        <Route path="/login" element={<Login/>}/>
                        <Route path="/register" element={<Register/>}/>
                        <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>}/>
                        <Route path="/playlists" element={<ProtectedRoute><PlaylistPage/></ProtectedRoute>}/>
                    </Routes>
                </div>
                <AudioPlayer
                    currentSong={currentSong}
                    isPlaying={isPlaying}
                    onPlayPause={setIsPlaying}
                    volume={volume}
                    onVolumeChange={handleVolumeChange}
                    audioRef={audioRef}
                />
                <footer className="text-center text-white mb-2 bbg-dark">
                    © 2025 Federico Paganelli – Progetto accademico sviluppato per l’esame di Tecnologie Web.<br/>
                    Questa applicazione utilizza brevi anteprime di brani musicali esclusivamente a fini didattici e non
                    commerciali.
                </footer>
            </div>
        </Router>
    );
};

export default App;
