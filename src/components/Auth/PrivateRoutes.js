// import React from "react";
// import { Route, Navigate } from "react-router-dom";
// import useAuthentication from "./LoginAuth";

// const PrivateRoute = ({ element, role, ...rest }) => {
//   const { isLoggedIn, userRole } = useAuthentication();

//   // Check if the user is logged in and has the required role
//   const isAuthenticated = isLoggedIn && userRole === role;
// console.log("hiiiiiiiiii");
//   return isAuthenticated ? (
//     <Route {...rest} element={element} />
//   ) : (
//     <Navigate to="/" replace />
//   );
// };

// export default PrivateRoute;


import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthentication from "./LoginAuth"; // Import the authentication hook

const PrivateRoute = () => {
    const { isLoggedIn } = useAuthentication(); // Get authentication status from hook

    // If authorized, return an outlet that will render child elements
    // If not, return element that will navigate to login page
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
