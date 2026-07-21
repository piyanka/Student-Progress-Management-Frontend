import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { apiRequest } from "../../utils/api";

/** StudentSidebar Component
 
  Displays basic student information alongside Codeforces profile stats.
  Props:
  - student: basic student details (name, email, phone)
  - info: Codeforces user info (handle, avatar, rating, rank, etc.)
  - lastSynced: timestamp of last CF data sync
 
  Features:
  - Shows user avatar, name, handle, and contact info
  - Displays Codeforces statistics
  - Shows last sync time
  - Allows manual sync with a button (disabled if synced within 10 minutes)
  - Shows toast notifications for sync status
 */
const StudentSidebar = ({ student, info, lastSynced }) => {
  const [syncing, setSyncing] = useState(false);

  if (!student || !info) return null;

  const handleSync = async () => {
    const toastId = toast.loading("🔄 Syncing Codeforces data...", {
      position: "top-center",
    });

    try {
      setSyncing(true);

      await apiRequest(`/sync/${student._id}`);

      toast.update(toastId, {
        render: "✅ Codeforces data synced successfully!",
        type: "success",
        isLoading: false,
        autoClose: 2000,
        position: "top-center",
      });

      window.location.reload(); // Refresh to update stats
    } catch (err) {
      console.error("Sync failed:", err);

      toast.update(toastId, {
        render: "❌ Failed to sync Codeforces data.",
        type: "error",
        isLoading: false,
        autoClose: 3000,
        position: "top-center",
      });
    } finally {
      setSyncing(false);
    }
  };

  // 🕒 Check if synced in last 10 minutes
  const syncedRecently = () => {
    if (!lastSynced) return false;
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    return new Date(lastSynced).getTime() > tenMinutesAgo;
  };

  const recentlySynced = syncedRecently();

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
        <p>🪪 Rank: {info.rank || "N/A"}</p>
        <p>👑 Max Rank: {info.maxRank || "N/A"}</p>

        {/* Contact Information */}
        <h4 style={{ marginTop: "1rem" }}>Contact Info</h4>
        <p>📧 {student.email}</p>
        <p>📞 {student.phone}</p>

        {/* Last Data Sync */}
        <h4>Last Synced</h4>
        <p>{new Date(lastSynced).toLocaleString()}</p>

        <button
          onClick={handleSync}
          className="dashboard-button"
          style={{
            marginTop: "8px",
            opacity: recentlySynced ? 0.5 : 1,
            cursor: recentlySynced ? "not-allowed" : "pointer",
          }}
          disabled={syncing || recentlySynced}
        >
          {recentlySynced
            ? "⏳ Synced recently"
            : syncing
            ? "🔄 Syncing..."
            : "🔁 Sync Now"}
        </button>
      </div>
    </div>
  );
};

export default StudentSidebar;
