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
import {
  Backdrop,
  CircularProgress,
  Snackbar,
  Typography,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { resetToast } from "./features/toast/toastSlice";
import Results from "./components/results";
import LoadingPage from "./components/loadingPage";
import Checkout from "./pages/checkout";
import { toggleOpenPhoneVerification } from "./features/cart/cartSlice";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { ProtectedAuth, ProtectedRoute } from "./utility/protected";

function App() {
  const message = useSelector((state) => state.toast.message);
  const type = useSelector((state) => state.toast.type);
  const isOpen = useSelector((state) => state.toast.isOpen);
  const isBackDropOpen = useSelector((state) => state.toast.isBackDropOpen);
  const dispatch = useDispatch();

  return (
    <div className="App">
      <Backdrop
        sx={{ color: "#cefad0", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isBackDropOpen}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar
        open={isOpen}
        autoHideDuration={10000}
        onClose={() => dispatch(resetToast())}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
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
          <Route path="verify/:id/:token" element={<LoadingPage />} />
          <Route
            path="checkout/:id"
            element={
              <ProtectedRoute>
                <Checkout />{" "}
              </ProtectedRoute>
            }
          />
          <Route
            path="/verification-success"
            element={<Results type={"success"} />}
          />
          <Route
            path="/verification-error"
            element={<Results type={"error"} />}
          />
          {/* login routes */}
          <Route
            path="/login"
            element={
              <ProtectedAuth>
                <Login />
              </ProtectedAuth>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedAuth>
                <SignUp />{" "}
              </ProtectedAuth>
            }
          />
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
