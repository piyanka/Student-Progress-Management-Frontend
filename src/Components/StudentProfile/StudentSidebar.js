import React from "react";

/** StudentSidebar Component

 * Displays basic student information alongside Codeforces profile stats.
 * Props:
 * - student: basic student details (name, email, phone)
 * - info: Codeforces user info (handle, avatar, rating, rank, etc.)
 * - lastSynced: timestamp of last CF data sync

 */
const StudentSidebar = ({ student, info, lastSynced }) => {
  if (!student || !info) return null;                                           // Wait until data is available

  return (
    <div className="student-sidebar">
      
      {/* Profile Avatar + Name + Handle */}
      <div className="student-avatar">
        <img
          src={info.avatar || "https://placehold.co/100x100"}
          alt="Avatar"
        />
        <h2>{student.name}</h2>
        <p>@{info.handle}</p>
      </div>

      {/* Codeforces Statistics */}
      <div className="student-info">
        <h4>Codeforces Stats</h4>
        <p>🏅 Current Rating: <strong>{info.rating || 0}</strong></p>
        <p>🌟 Max Rating: <strong>{info.maxRating || 0}</strong></p>
        <p>🪪 Rank: {info.rank || 'N/A'}</p>
        <p>👑 Max Rank: {info.maxRank || 'N/A'}</p>

        {/* Last Data Sync */}
        <h4>Last Synced</h4>
        <p>{new Date(lastSynced).toLocaleString()}</p>

        {/* Contact Information */}
        <h4>Contact Info</h4>
        <p>📧 {student.email}</p>
        <p>📞 {student.phone}</p>
      </div>
    </div>
  );
};

export default StudentSidebar;
