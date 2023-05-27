import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "http://localhost:5000/auth/login",
                { email, password }
            );
            const token = response.data.token;
            // Save the token to localStorage or a global state management tool
            console.log("Login successful! Token:", token);
        } catch (error) {
            console.error("Login error:", error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default LoginPage;
