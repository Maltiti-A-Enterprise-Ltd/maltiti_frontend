import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./pages/home";
import { Login } from "./pages/login";
import Dashboard from "./pages/adminDashboard";
import Missing from "./components/missing";
import Unauthorized from "./components/unauthorized";
import RequireAuth from "./utility/requiredAuth";
import Customer from "./pages/userDashboard";
import PersistLogin from "./utility/persistLogin";
import Shop from "./pages/shop";
import Product from "./pages/product";
import { SignUp } from "./pages/signUp";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar } from "@mui/material";
import Alert from "@mui/material/Alert";
import { resetToast } from "./features/toast/toastSlice";

function App() {
  const message = useSelector((state) => state.toast.message);
  const type = useSelector((state) => state.toast.type);
  const isOpen = useSelector((state) => state.toast.isOpen);
  const dispatch = useDispatch();
  return (
    <div className="App">
      <Snackbar
        open={isOpen}
        autoHideDuration={6000}
        onClose={() => dispatch(resetToast())}
      >
        <Alert
          onClose={() => dispatch(resetToast())}
          severity={type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:id" element={<Product />} />
          {/* login routes */}
          <Route
            path="/login"
            element={
              // <ProtectedAuth>
              <Login />
              // </ProtectedAuth>
            }
          />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[]} />}>
              <Route path="/admin/*" element={<Dashboard />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[]} />}>
              <Route path="/customer" element={<Customer />} />
            </Route>
          </Route>

          {/* catch all */}
          <Route path="/*" element={<Missing />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
