import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Custom sub-components
import StudentSidebar from "./StudentSidebar";
import ContestHistory from "./ContestHistory";
import ProblemSolvingStats from "./ProblemSolvingStats";

/** StudentProfilePage 

 * This component displays a detailed profile page for a single student.
 * It fetches:
 * - Basic student info (name, email, handle, etc.)
 * - Codeforces data: rating history & submissions
 * And renders:
 * - Sidebar with student details and last sync time
 * - Main section with Contest History and Problem Solving Stats
 
 */
const StudentProfilePage = () => {
  const { id } = useParams();                                 // Student ID from URL
  const [cfData, setCfData] = useState(null);                 // Codeforces data
  const [student, setStudent] = useState(null);               // Student basic info

  //Fetch student details and Codeforces data on mount
 
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        console.log("Fetching for studentId:", id);

        // Fetch Codeforces performance data
        const cfRes = await axios.get(`http://localhost:5000/students/${id}/codeforces`, {
          headers: {
            'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
          }
        });

        // Fetch student personal info
        const studentRes = await axios.get(`http://localhost:5000/students/${id}`, {
          headers: {
            'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
          }
        });

        setCfData(cfRes.data);
        setStudent(studentRes.data);
      } catch (err) {
        console.error("Error fetching student profile:", err);
      }
    };

    fetchStudentProfile();
  }, [id]);

  // Show loading state until data is fetched
  if (!cfData || !student) return <div>Loading...</div>;

  return (
    <div className="student-profile-page">
      <div className="student-profile-layout">
        {/* Sidebar: Student info + last sync status */}
        <div className="sidebar-section">
          <StudentSidebar
            student={student}
            info={cfData.info}
            lastSynced={cfData.lastSynced}
          />
        </div>

        {/* Main profile section: Contest history & problem-solving stats */}
        <div className="main-section">
          <div className="scrollable-content">
            <ContestHistory
              ratingHistory={cfData.ratingHistory}
              submissions={cfData.submissions}
            />
            <ProblemSolvingStats
              submissions={cfData.submissions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
