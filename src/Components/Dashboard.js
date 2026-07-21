import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../utils/api";

// Toast notifications
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/** StudentList Component

 Displays a table of all enrolled students with search, view, edit, delete, and download CSV capabilities.
  - Data fetched from backend on initial load
  - Supports client-side search and deletion
  - CSV export includes essential student details and last sync time

*/
const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const limit = 6;

  // Fetch students and search results with a small debounce for search input.
  useEffect(() => {
    let cancelled = false;
    const timeout = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        if (searchTerm.trim()) {
          const data = await apiRequest(`/students/search/${encodeURIComponent(searchTerm.trim())}`);
          if (!cancelled) {
            setStudents(Array.isArray(data) ? data : []);
            setTotalPages(1);
          }
        } else {
          const data = await apiRequest(`/students?page=${page}&limit=${limit}`);
          if (!cancelled) {
            setStudents(data.students || []);
            setTotalPages(data.totalPages || 1);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Error fetching students");
          setStudents([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, searchTerm.trim() ? 300 : 0);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [page, searchTerm]);

  //Delete a student by ID(Student ID)

  const deleteStudent = async (id) => {
    try {
      const result = await apiRequest(`/students/${id}`, {
        method: "DELETE",
      });
      if (result.success) {
        setSearchTerm("");
        setPage(1);
      }
    } catch (err) {
      console.error("Failed to delete student:", err);
    }
  };

  // Download student list as CSV file

  const downloadCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Codeforces Handle",
      "Current Rating",
      "Max Rating",
      "Last Synced",
    ];
    const rows = students.map((student) => [
      student.name,
      student.email,
      student.phone,
      student.cfHandle,
      student.currentRating,
      student.maxRating,
      student.lastSynced
        ? new Date(student.lastSynced).toLocaleString()
        : "Not Synced",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "students_data.csv";
    link.click();

    URL.revokeObjectURL(url);

    toast.success("CSV downloaded successfully!", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  return (
    <div className="Students-List">
      {/* Search input */}
      <input
        className="student-search-input"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
          setPage(1);
        }}
        type="text"
        placeholder="🔍 Search by name, email, handle, or phone"
      />

      {loading && <p style={{ marginTop: "1rem" }}>Loading students...</p>}
      {error && !loading && <p style={{ marginTop: "1rem", color: "crimson" }}>{error}</p>}

      {/* Student table */}
      <table className="student-table">
        <thead>
          <tr>
            <th>S. No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>CF Handle</th>
            <th>Current Rating</th>
            <th>Max Rating</th>
            <th>Last Synced</th>
            <th>Profile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((s, index) => (
              <tr key={s._id}>
                <td>{index + 1}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.cfHandle}</td>
                <td>{s.currentRating}</td>
                <td>{s.maxRating}</td>
                <td>
                  {s.lastSynced
                    ? new Date(s.lastSynced).toLocaleString()
                    : "Not Synced"}
                </td>
                <td>
                  <Link
                    to={`/students/${s._id}/profile`}
                    style={{ color: "blue", textDecoration: "underline" }}
                  >
                    View
                  </Link>
                </td>
                <td>
                  <button
                    className="dashboard-button"
                    onClick={() => deleteStudent(s._id)}
                  >
                    Delete
                  </button>
                  &nbsp;
                  <Link to={`/students/${s._id}`}>Update</Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" style={{ textAlign: "center" }}>
                {loading ? "Loading..." : "No Students Found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="pagination-container">
        <button
          className="pagination-button"
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          ⬅ Prev
        </button>
        <span className="pagination-info">
          Page {page} of {totalPages}
        </span>
        <button
          className="pagination-button"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next ➡
        </button>
      </div>
      {/* CSV download button */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: "1rem",
        }}
      >
        <button className="dashboard-button" onClick={downloadCSV}>
          ⬇️ Download CSV
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
