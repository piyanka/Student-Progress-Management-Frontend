import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoImg from './Assets.js/logo.png';

// Accept toggleTheme and darkMode props
const Nav = ({ toggleTheme, darkMode }) => {
  const auth = localStorage.getItem('user');
  const navigate = useNavigate();

  let userName = '';

  if (auth) {
    try {
      userName = JSON.parse(auth).name;
    } catch (err) {
      console.error("Invalid user data in localStorage");
    }
  }

  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className='nav-bar'>
    <div className="nav-left">
      <img className="logo-ul" alt="logo" src={LogoImg} />

      {/* Navbar shown after the user logged in */}
      {auth ? (
        <ul className="nav-ul">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/students/add">Add Student</Link></li>
          <li><Link to="/sync-settings">Sync Settings</Link></li>
          <li><Link onClick={logout} to="/signup">Logout({userName})</Link></li>

          {/* Theme toggle button shown when user is logged in*/}
          <li style={{ marginLeft: 'auto' }}>
            <button className="theme-toggle-button" onClick={toggleTheme}>
              {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
            </button>
          </li>
        </ul>
      ) : (
        <ul className="nav-ul nav-right">
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/login">Login</Link></li>

        </ul>
      )}
    </div>
    </div>
    
    
  );
};

export default Nav;
