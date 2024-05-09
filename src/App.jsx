import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./pages/home";
import { Login } from "./pages/login";
import Missing from "./components/missing";
import Unauthorized from "./components/unauthorized";
import Shop from "./pages/shop";
import Product from "./pages/product";
import { SignUp } from "./pages/signUp";
import { useDispatch, useSelector } from "react-redux";
import {
  Backdrop,
  CircularProgress,
  createTheme,
  Snackbar,
  ThemeProvider,
} from "@mui/material";
import Alert from "@mui/material/Alert";
import { closeModal, resetToast } from "./features/toast/toastSlice";
import Results from "./components/results";
import LoadingPage from "./components/loadingPage";
import Checkout from "./pages/checkout";
import {
  ProtectedAuth,
  ProtectedCheckout,
  ProtectedRoute,
} from "./utility/protected";
import ConfirmPayment from "./pages/confirmPayment";
import Settings from "./pages/settings";
import MyOrders from "./pages/myOrders";
import { ForgotPassword } from "./pages/forgotPassword";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { modalStyle } from "./utility/constants";
import { ResetPassword } from "./pages/resetPassword";
import IconButton from "@mui/material/IconButton";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

function App() {
  const message = useSelector((state) => state.toast.message);
  const type = useSelector((state) => state.toast.type);
  const isOpen = useSelector((state) => state.toast.isOpen);
  const isBackDropOpen = useSelector((state) => state.toast.isBackDropOpen);
  const isModalOpen = useSelector((state) => state.toast.isModalOpen);
  const modalData = useSelector((state) => state.toast.modalData);
  const dispatch = useDispatch();

  const theme = createTheme({
    palette: {
      primary: {
        main: "#0F6938",
      },
    },
  });

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Modal
          open={isModalOpen}
          onClose={() => dispatch(closeModal())}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <div
              className={
                "flex translate-x-5 -translate-y-5 items-end justify-end"
              }
            >
              <HighlightOffIcon
                onClick={() => dispatch(closeModal())}
                className={"hover:text-red-600 cursor-pointer"}
              />
            </div>
            <div className={"flex items-center justify-center"}>
              <img
                width={200}
                src={`/${modalData.image}`}
                alt={"illustration"}
              />
            </div>
            <p className={"text-base font-bold mt-4 mb-5"}>
              {modalData.message}
            </p>
          </Box>
        </Modal>

        <Backdrop
          sx={{ color: "#cefad0", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isBackDropOpen}
        >
          <CircularProgress color="success" />
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
        {/*<Alert variant="filled" severity="success">*/}
        {/*  This is a filled success Alert.*/}
        {/*</Alert>*/}
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<Product />} />
            <Route path="verify/:id/:token" element={<LoadingPage />} />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <MyOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="confirm-payment/:userId/:checkoutId"
              element={
                <ProtectedRoute>
                  <ConfirmPayment />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings/*"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route
              path="checkout/:id"
              element={
                <ProtectedRoute>
                  <ProtectedCheckout>
                    <Checkout />
                  </ProtectedCheckout>
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
              path="/forgot-password"
              element={
                <ProtectedAuth>
                  <ForgotPassword />
                </ProtectedAuth>
              }
            />
            <Route
              path="/reset-password/:token"
              element={
                <ProtectedAuth>
                  <ResetPassword />
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
            {/* catch all */}
            <Route path="/*" element={<Missing />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </div>
  );
}

export default App;
