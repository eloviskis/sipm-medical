import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

/**
 * PrivateRoute — protects routes by authentication and optional role check.
 * @param {React.ReactNode} children - The component to render if authorized
 * @param {string[]} [roles] - Optional array of allowed roles (e.g. ["admin", "medico"])
 */
const PrivateRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && roles.length > 0) {
    const userRole = user?.role || "paciente";
    if (!roles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default PrivateRoute;
