import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await response.json();
            if (response.ok) {
                navigate("/login");
            } else {
                setError(data.message || "Errore durante la registrazione");
            }
        } catch (error) {
            setError("Errore di connessione al server!");
        }
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="mb-4">Registrazione</h1>
            {error && <p className="text-danger">{error}</p>}
            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow w-25">
                <div className="mb-3">
                    <label className="form-label text-dark">Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-dark">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label text-dark">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Registrati</button>
            </form>
        </div>
    );
};

export default Register;
