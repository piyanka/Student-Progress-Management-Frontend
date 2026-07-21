import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

/** PrivateComponent

 This is a protected route wrapper.
 It checks whether a user is authenticated.
 If yes, it renders the nested routes (using <Outlet />).
 If not, it redirects the user to the login page.

*/
const PrivateComponent = () => {
    const auth = localStorage.getItem('user');  // Check if user data exists in localStorage

    // If authenticated, allow access to child routes. Else, redirect to login.
    return auth ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateComponent;
