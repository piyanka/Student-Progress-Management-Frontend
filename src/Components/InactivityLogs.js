import React, { useEffect, useState } from "react";
import { apiRequest } from "../utils/api";

/**
 * InactivityLogs Component
 *
 * Purpose:
 * - Displays a paginated list of students who were inactive on Codeforces.
 * - Shows: Name, Email, Last Active Date, Mail Sent Time, and Reason.
 * - Admins can review when and why reminder emails were sent.
 *
 * Features:
 * - Pagination (6 records per page)
 * - Styled using the `.Students-List` CSS theme (no extra styling needed)
 * - Fetches data from `/inactivity-logs` route with token-based auth
 */

const InactivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch logs from backend API with pagination
  const fetchLogs = async (pageNumber = 1) => {
    try {
      const data = await apiRequest(`/inactivity-logs?page=${pageNumber}&limit=6`);

      setLogs(data.logs || []);
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch logs:", err.message);
    }
  };

  useEffect(() => {
    fetchLogs(); // Initial fetch on mount
  }, []);

  return (
    <div className="Students-List">
      <h2>📬 Inactivity Email Logs</h2>

      {logs.length === 0 ? (
        <p className="no-students">No inactivity logs available.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>📛 Student Name</th>
              <th>📧 Email</th>
              <th>📅 Last Active</th>
              <th>📨 Mail Sent At</th>
              <th>📝 Reason</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td>{log.studentId?.name || "Unknown"}</td>
                <td>{log.email}</td>
                <td>{new Date(log.lastActive).toLocaleString()}</td>
                <td>{new Date(log.mailSentAt).toLocaleString()}</td>
                <td>{log.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination Controls */}
      {logs.length > 0 && (
        <div className="pagination-container">
          <button
            className="pagination-button"
            onClick={() => fetchLogs(page - 1)}
            disabled={page === 1}
          >
            ⬅️ Prev
          </button>

          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>

          <button
            className="pagination-button"
            onClick={() => fetchLogs(page + 1)}
            disabled={page === totalPages}
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default InactivityLogs;
