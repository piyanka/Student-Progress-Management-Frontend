import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

// Toast notifications
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/** StudentList Component

 * Displays a table of all enrolled students with search, view, edit, delete, and download CSV capabilities.
 * - Data fetched from backend on initial load
 * - Supports client-side search and deletion
 * - CSV export includes essential student details and last sync time

*/
const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 6;


    // Fetch all students on component mount
    useEffect(() => {
        getStudents(page);
    }, [page]);

    // Fetch student data from backend

    const getStudents = async () => {
        try {
            let result = await fetch(`http://localhost:5000/students?page=${page}&limit=${limit}`, {
                headers: {
                    'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            const data = await result.json();
            setStudents(data.students || []);
            setTotalPages(data.totalPages || 1);

        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    //Delete a student by ID(Student ID)

    const deleteStudent = async (id) => {
        try {
            let result = await fetch(`http://localhost:5000/students/${id}`, {
                method: "DELETE",
                headers: {
                    'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            result = await result.json();
            if (result) {
                getStudents(page); // Refresh list
            }
        } catch (err) {
            console.error("Failed to delete student:", err);
        }
    };

    // Filter students by search input

    const handleSearch = async (event) => {
        let key = event.target.value;
        if (key) {
            let result = await fetch(`http://localhost:5000/students/search/${key}`, {
                headers: {
                    'authorization': `Bearer ${JSON.parse(localStorage.getItem('token'))}`
                }
            });
            const data = await result.json();


            if (data) {
                setStudents(data);
            }
            setTotalPages(1); // search results = no pagination
            setPage(1);
        } else {
            getStudents(); // Reset list if search is cleared
        }
    };

    // Download student list as CSV file

    const downloadCSV = () => {
        const headers = ['Name', 'Email', 'Phone', 'Codeforces Handle', 'Current Rating', 'Max Rating', 'Last Synced'];
        const rows = students.map(student => [
            student.name,
            student.email,
            student.phone,
            student.cfHandle,
            student.currentRating,
            student.maxRating,
            student.lastSynced ? new Date(student.lastSynced).toLocaleString() : 'Not Synced'
        ]);

        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += headers.join(',') + '\r\n';
        rows.forEach(row => {
            csvContent += row.join(',') + '\r\n';
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "students_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast.success('CSV downloaded successfully!', {
            position: "top-right",
            autoClose: 3000
        });
    };

    return (
        <div className='Students-List'>
            {/* <div>
                <h2>Student Dashboard</h2>
            </div> */}

            {/* Search input */}
            <input
                className="student-search-input"
                onChange={handleSearch}
                type="text"
                placeholder="🔍 Search by name, email, handle, or phone"
            />

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
                    {
                        students.length > 0 ? students.map((item, index) => (
                            <tr key={item._id}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                                <td>{item.email}</td>
                                <td>{item.phone}</td>
                                <td>{item.cfHandle}</td>
                                <td>{item.currentRating}</td>
                                <td>{item.maxRating}</td>
                                <td>
                                    {item.lastSynced
                                        ? new Date(item.lastSynced).toLocaleString()
                                        : "Not Synced"}
                                </td>
                                <td>
                                    <Link to={`/students/${item._id}/profile`} style={{ color: 'blue', textDecoration: 'underline' }}>
                                        View
                                    </Link>
                                </td>
                                <td>
                                    <button className='dashboard-button' onClick={() => deleteStudent(item._id)}>Delete</button>
                                    &nbsp;
                                    <Link to={`/students/${item._id}`}>Update</Link>
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan="10" style={{ textAlign: 'center' }}>No Students Found</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination-container">
                <button
                    className="pagination-button"
                    disabled={page === 1}
                    onClick={() => setPage(prev => prev - 1)}
                >
                    ⬅ Prev
                </button>
                <span className="pagination-info">Page {page} of {totalPages}</span>
                <button
                    className="pagination-button"
                    disabled={page === totalPages}
                    onClick={() => setPage(prev => prev + 1)}
                >
                    Next ➡
                </button>
            </div>
            {/* CSV download button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className='dashboard-button' onClick={downloadCSV}>
                    ⬇️ Download CSV
                </button>
            </div>
        </div>
    );
};

export default StudentList;
