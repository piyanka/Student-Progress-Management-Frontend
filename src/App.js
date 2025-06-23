import './App.css';
import Nav from './Components/Nav';
import Footer from './Components/Footer';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Signup from './Components/Signup';
import PrivateComponent from './Components/PrivateComponent';
import Login from './Components/Login';
import StudentTable from './Components/Dashboard';
import StudentProfilePage from './Components/StudentProfile/StudentProfilePage';
import AddStudent from './Components/AddStudent';
import UpdateStudent from './Components/UpdateStudentDetails';
import SyncSettings from './Components/SyncSettings';
import InactivityLogs from "./Components/InactivityLogs"; 
import HeroSection from "./Components/HeroSection";

import { useState, useEffect } from 'react';

// Toastify imports
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Extracted App content so we can use useLocation
function AppContent({ toggleTheme, darkMode }) {
  const location = useLocation();

  // Check if the current route is a profile page
    const showHeader = ['/', '/login', '/signup'].includes(location.pathname);

  return (
    <>
      {/* Navbar */}
      <Nav toggleTheme={toggleTheme} darkMode={darkMode} />

      {/* Header only if not on profile page */}
      {/* {showHeader && (
        <div className='header'>
          <h2>Welcome to the Student Progress Manager</h2>
        </div>
      )} */}

      {/* Routes */}
      <Routes>
        <Route element={<PrivateComponent />}>
          <Route path="/dashboard" element={<StudentTable />} />
          <Route path="/students/add" element={<AddStudent />} />
          <Route path="/students/:id/profile" element={<StudentProfilePage />} />
          <Route path="/sync-settings" element={<SyncSettings />} />
          <Route path="/students/:id" element={<UpdateStudent />} />
          <Route path="/inactivity-logs" element={<InactivityLogs />} />
          <Route path="/logout" element={<h1>Logout Component</h1>} />
        </Route>
        <Route path="/" element={<HeroSection />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>

      {/*ToastContainer */}
      <ToastContainer position="top-right" autoClose={3000} />

      <Footer />
    </>
  );
}

// Theme State
function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    document.body.className = darkMode ? 'dark' : 'light';
  }, [darkMode]);

  return (
    <div className={`App ${darkMode ? 'dark' : 'light'}`}>
      <BrowserRouter>
        <AppContent toggleTheme={toggleTheme} darkMode={darkMode} />
      </BrowserRouter>
    </div>
  );
}

export default App;
