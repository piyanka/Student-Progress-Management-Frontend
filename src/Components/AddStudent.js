import React, { useState } from 'react';

/** AddStudent Component

 * This component provides a form for adding new student details into the system.
 * It collects name, email, phone number, Codeforces handle, and ratings,
 * validates the input, and makes a POST request to the backend API to store the student.

*/
const AddStudent = () => {
    // State variables for form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [cfHandle, setCfHandle] = useState('');
    const [currentRating, setCurrentRating] = useState('');
    const [maxRating, setMaxRating] = useState('');
    const [error, setError] = useState(false); // Controls validation message visibility

    /**
     * Handles the student creation logic
     * Validates inputs and sends a POST request to the backend API
     */
    const handleAddStudent = async () => {
        // Input validation: show errors if any field is empty
        if (!name || !email || !phone || !cfHandle || !currentRating || !maxRating) {
            setError(true);
            return;
        }

        // Retrieve user data from local storage
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        // Ensure the user is authenticated before allowing submission
        if (!user || !token) {
            alert("You're not logged in. Please log in.");
            return;
        }

        const userId = JSON.parse(user)._id;

        try {
            // POST request to backend to add a student
            const response = await fetch('http://localhost:5000/students/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${JSON.parse(token)}`
                },
                body: JSON.stringify({
                    name,
                    email,
                    phone,
                    cfHandle,
                    currentRating,
                    maxRating,
                    userId
                })
            });

            const data = await response.json();
            console.log("Student added:", data);

            // Clear the form after successful submission
            setName('');
            setEmail('');
            setPhone('');
            setCfHandle('');
            setCurrentRating('');
            setMaxRating('');
            setError(false);
        } catch (err) {
            console.error("Failed to add student:", err);
        }
    };

    return (
        <div className='addStudent-ul'>
            <h1>Add Student</h1>

            {/* Student Name */}
            <input
                className='inputBox'
                type='text'
                placeholder='Enter Student Name'
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {error && !name && <span className='invalid-input'>Enter valid name</span>}

            {/* Email */}
            <input
                className='inputBox'
                type='email'
                placeholder='Enter Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            {error && !email && <span className='invalid-input'>Enter valid email</span>}

            {/* Phone Number */}
            <input
                className='inputBox'
                type='text'
                placeholder='Enter Phone Number'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            {error && !phone && <span className='invalid-input'>Enter valid phone number</span>}

            {/* Codeforces Handle */}
            <input
                className='inputBox'
                type='text'
                placeholder='Enter Codeforces Handle'
                value={cfHandle}
                onChange={(e) => setCfHandle(e.target.value)}
            />
            {error && !cfHandle && <span className='invalid-input'>Enter valid Codeforces handle</span>}

            {/* Current Rating */}
            <input
                className='inputBox'
                type='number'
                placeholder='Enter Current Rating'
                value={currentRating}
                onChange={(e) => setCurrentRating(e.target.value)}
            />
            {error && !currentRating && <span className='invalid-input'>Enter valid current rating</span>}

            {/* Max Rating */}
            <input
                className='inputBox'
                type='number'
                placeholder='Enter Max Rating'
                value={maxRating}
                onChange={(e) => setMaxRating(e.target.value)}
            />
            {error && !maxRating && <span className='invalid-input'>Enter valid max rating</span>}

            {/* Submit Button */}
            <button className='button-ul' onClick={handleAddStudent}>
                Add Student
            </button>
        </div>
    );
};

export default AddStudent;
