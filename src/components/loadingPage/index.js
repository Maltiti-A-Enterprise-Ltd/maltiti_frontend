import { CircularProgress } from "@mui/material";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifying } from "../../features/user/userSlice";

const LoadingPage = () => {
  const { id, token } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(verifying({ id, token }));
  }, []);
  return (
    <div className="h-screen gap-y-4 flex-col flex items-center justify-center">
      <div>Verifying Account...</div>
      <CircularProgress color={"success"} />
    </div>
  );
};

export default LoadingPage;
