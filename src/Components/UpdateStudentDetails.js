import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

/** UpdateStudent Component

 * This component allows users to update an existing student's information.
 * It fetches the current details of the student using their ID from URL parameters,
 * displays the data in a form, and allows submission of updated values to the backend.
 
*/
const UpdateStudent = () => {

  // Local state for each student field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cfHandle, setCfHandle] = useState('');
  const [currentRating, setCurrentRating] = useState('');
  const [maxRating, setMaxRating] = useState('');

  const params = useParams();             // Get student ID from route
  const navigate = useNavigate();         

  /**
   * Fetch the current student details when the component mounts.
   * Uses token from localStorage for authorization.
   */
  useEffect(() => {
    const getStudentDetails = async () => {
      try {
        const res = await fetch(`http://localhost:5000/students/${params.id}`, {
          headers: {
            'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
          }
        });

        const result = await res.json();

        if (res.ok) {
          
          // Populate form fields with fetched data
          setName(result.name);
          setEmail(result.email);
          setPhone(result.phone);
          setCfHandle(result.cfHandle);
          setCurrentRating(result.currentRating);
          setMaxRating(result.maxRating);
        } else {
          console.error(result);
          alert("Failed to load student");
        }
      } catch (err) {
        console.error("Error fetching student:", err);
      }
    };

    getStudentDetails();
  }, [params.id]);

  /**
   * Handles the update operation.
   * Sends updated student data to the backend using a PUT request.
   */
  const handleUpdateStudent = async () => {
    try {
      const response = await fetch(`http://localhost:5000/students/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          cfHandle,
          currentRating,
          maxRating,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Student updated successfully.");
        navigate('/');
      } else {
        alert(result?.error || "Update failed");
      }
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  return (
    <div className='addStudent-ul'>
      <h1>Update Student</h1>

      {/* Student Name */}
      <input
        className='inputBox'
        type='text'
        placeholder='Enter Student Name'
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      {/* Email */}
      <input
        className='inputBox'
        type='email'
        placeholder='Enter Email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Phone Number */}
      <input
        className='inputBox'
        type='text'
        placeholder='Enter Phone Number'
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      {/* Codeforces Handle */}
      <input
        className='inputBox'
        type='text'
        placeholder='Enter Codeforces Handle'
        value={cfHandle}
        onChange={(e) => setCfHandle(e.target.value)}
      />

      {/* Current Rating */}
      <input
        className='inputBox'
        type='number'
        placeholder='Enter Current Rating'
        value={currentRating}
        onChange={(e) => setCurrentRating(e.target.value)}
      />

      {/* Max Rating */}
      <input
        className='inputBox'
        type='number'
        placeholder='Enter Max Rating'
        value={maxRating}
        onChange={(e) => setMaxRating(e.target.value)}
      />

      {/* Submit Button */}
      <button onClick={handleUpdateStudent} className='button-ul'>
        Update Student
      </button>
    </div>
  );
};

export default UpdateStudent;
