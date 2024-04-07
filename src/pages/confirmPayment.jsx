import { CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "../utility/success-animation.css";
import "../utility/error-animation.css";
import Button from "@mui/material/Button";
import { confirmPayment } from "../features/cart/cartSlice";
const ConfirmPayment = () => {
  const { userId, checkoutId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(10);
  const status = useSelector((state) => state.cart.confirmPaymentStatus);

  useEffect(() => {
    if (status === "loading") {
      dispatch(confirmPayment({ userId, checkoutId }));
    }
    if (status === "success") {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      setTimeout(() => {
        clearInterval(interval);
        navigate("/");
      }, 10000);
    }
  }, [status]);
  return (
    <div className="h-screen w-full gap-y-4 flex-col flex items-center justify-center">
      {status === "loading" && (
        <div className={"flex flex-col items-center justify-center"}>
          <div className={"mb-2"}>Confirming Payment...</div>
          <CircularProgress color={"success"} />
        </div>
      )}
      {status === "error" && (
        <div>
          <div className={"border p-32 border-gray-200 shadow-2xl rounded-md"}>
            <div className="success-animation">
              <div
                className={
                  "flex font-semibold text-lg item-center justify-center"
                }
              >
                Oops... Payment Confirmation Failed
              </div>
              <div className={"container"}>
                <div className={"circle-border"}></div>
                <div className={"circle"}>
                  <div className={"error"}></div>
                  <div></div>
                </div>
              </div>
              <div className={"mt-4 flex item-center justify-center"}>
                If you have been debited please contact support at
                support@maltitiaenterprise.com
              </div>
              <div className={"mt-4 flex item-center justify-center"}>
                <Button
                  onClick={() => navigate("/")}
                  color={"success"}
                  variant="outlined"
                >
                  Go home
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      {status === "success" && (
        <div>
          <div className={"border p-32 border-gray-200 shadow-2xl rounded-md"}>
            <div className="success-animation">
              <div
                className={
                  "flex font-semibold text-lg item-center justify-center"
                }
              >
                Payment Confirmed
              </div>
              <svg
                className="checkmark"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 52 52"
              >
                <circle
                  className="checkmark__circle"
                  cx="26"
                  cy="26"
                  r="25"
                  fill="none"
                />
                <path
                  className="checkmark__check"
                  fill="none"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
              <div className={"mt-4 flex item-center justify-center"}>
                Redirecting in {timer}
              </div>
              <div className={"mt-4 flex item-center justify-center"}>
                <Button
                  onClick={() => navigate("/")}
                  color={"success"}
                  variant="outlined"
                >
                  Redirect Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfirmPayment;
