import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Login Component
 
 * Renders a login form that authenticates existing users.
 * If the user is already authenticated, redirects to the dashboard.
 * On successful login, stores user and token in localStorage.

*/
 
const Login = () => {

    // State variables to store email and password input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    // Redirects to the dashboard if the user is already logged in
    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/dashboard');
        }
    }, [navigate]);

    /**
     * Handles login process.
     * Sends credentials to backend and stores auth token + user info on success.
     */
    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                },
            });

            const result = await response.json();
            console.log(result);

            // If authentication is successful
            if (result && result.auth) {
                localStorage.setItem('user', JSON.stringify(result.user));
                localStorage.setItem('token', JSON.stringify(result.auth));
                navigate('/dashboard');
            } else {
                alert('Please enter correct login details.');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Something went wrong. Please try again later.');
        }
    };

    return (
        <div className="login-ul">
            <h3>Login</h3>

            {/* Email input field */}
            <input
                className="inputBox"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
            />

            {/* Password input field */}
            <input
                className="inputBox"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
            />

            {/* Login button */}
            <button onClick={handleLogin} className="button-ul" type="button">
                Login
            </button>
        </div>
    );
};

export default Login;
