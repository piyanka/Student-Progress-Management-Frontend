import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { apiRequest } from "../../utils/api";

// Custom sub-components
import StudentSidebar from "./StudentSidebar";
import ContestHistory from "./ContestHistory";
import ProblemSolvingStats from "./ProblemSolvingStats";

/** StudentProfilePage 

 This component displays a detailed profile page for a single student.
  It fetches:
  - Basic student info (name, email, handle, etc.)
  - Codeforces data: rating history & submissions
  And renders:
  - Sidebar with student details and last sync time
  - Main section with Contest History and Problem Solving Stats
 
 */

const StudentProfilePage = () => {
  const { id } = useParams();                                 // Student ID from URL
  const [cfData, setCfData] = useState(null);                 // Codeforces data
  const [student, setStudent] = useState(null);               // Student basic info
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //Fetch student details and Codeforces data on mount

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        setError("");

        const [cfDataRes, studentRes] = await Promise.all([
          apiRequest(`/students/${id}/codeforces`),
          apiRequest(`/students/${id}`)
        ]);

        setCfData(cfDataRes);
        setStudent(studentRes);
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setError(err.message || "Failed to load student profile");
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [id]);

  // Show loading state until data is fetched
  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ padding: "1rem", color: "crimson" }}>{error}</div>;
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
          </div>

          <div className="scrollable-content">
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
