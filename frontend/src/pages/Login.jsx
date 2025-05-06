import React, {useState} from "react";
import {useNavigate, Link} from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:5000/api/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            console.log("Dati restituiti dal server:", data);

            if (response.ok) {

                localStorage.setItem("token", data.access_token);
                localStorage.setItem("user", JSON.stringify(data.user));


                navigate("/dashboard");
            } else {
                setError(data.message || "Credenziali non valide. Riprova.");
            }
        } catch (error) {

            setError("Errore di connessione al server.");
        }
    };

    return (
        <div className="d-flex flex-column align-items-center justify-content-center vh-100">
            <h1 className="mb-4">Accedi</h1>
            {error && <p className="text-danger">{error}</p>}

            <form onSubmit={handleSubmit} className="bg-light p-4 rounded shadow w-25">
                <div className="mb-3">
                    <label className="form-label text-dark">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
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

                <button type="submit" className="btn btn-primary w-100">Accedi</button>
            </form>

            <p className="mt-3 text-center">
                Non sei ancora registrato? <Link to="/register">Registrati qui</Link>
            </p>
        </div>
    );
};

export default Login;
