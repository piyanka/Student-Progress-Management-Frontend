import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/** Signup Component

 * Renders a user registration form for the Student Progress Manager system.
 * Allows new users to sign up by entering their name, email, and password.
 * If the user is already authenticated (based on localStorage), they are redirected to the dashboard.

*/

const Signup = () => {

    // State variables to manage input fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // Redirects to dashboard if user is already logged in 
    useEffect(() => {
        const auth = localStorage.getItem('user');
        if (auth) {
            navigate('/dashboard');
        }
    }, [navigate]);

    /**
     * Handles the signup process by sending a POST request to the backend
     * Stores user and token in localStorage on successful registration
     */
    const collectData = async () => {
        try {
            const response = await fetch('http://localhost:5000/register', {
                method: "POST",
                body: JSON.stringify({ name, email, password }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();

            // On successful response, store data and navigate to dashboard
            if (result && result.result) {
                localStorage.setItem('user', JSON.stringify(result.result));
                localStorage.setItem('token', JSON.stringify(result.auth));
                navigate('/dashboard');
            } else {
                alert(result.error || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during signup:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className='register-ul'>
            <h3>Register</h3>

            {/* Name input field */}
            <input
                className="inputBox"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='Enter Name'
            />

            {/* Email input field */}
            <input
                className="inputBox"
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='Enter Email'
            />

            {/* Password input field */}
            <input
                className="inputBox"
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Enter Password'
            />

            {/* Signup button */}
            <button onClick={collectData} className="button-ul" type='button'>
                SignUp
            </button>
        </div>
    )
}

export default Signup;
