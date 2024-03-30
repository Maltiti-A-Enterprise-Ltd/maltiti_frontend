import { Navigate } from "react-router-dom";
import store from "../app/store";

export const ProtectedRoute = ({ children }) => {
  const userData = store.getState().user.user;

  if (!userData) {
    return <Navigate to="/" replace />;
  }

  return children;
};

//function to protect authentication pages if user is logged
export const ProtectedAuth = ({ children }) => {
  const userData = store.getState().user.user;

  if (userData) {
    return <Navigate to="/" replace />;
  }
  return children;
};

//function to prevent patient dashboard if user not a logged in or not a patient
export const ProtectedPatient = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  } else {
    const userRole = user["role__name"];
    if (userRole === "Admin" || userRole === "Super Admin")
      return <Navigate to="/patient" replace />;
  }

  return children;
};
