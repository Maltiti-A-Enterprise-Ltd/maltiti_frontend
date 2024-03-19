import "./index.css";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Results = ({ type }) => {
  const navigate = useNavigate();
  const login = () => {
    navigate("/login");
  };
  return (
    <div className={"main"}>
      <div className="card">
        {type === "success" ? (
          <div className="icon-wrapper success">
            <CheckIcon
              style={{ width: "200px", height: "200px" }}
              fontSize={"large"}
              color={"success"}
            />
          </div>
        ) : (
          <div className="icon-wrapper error">
            <CloseIcon
              style={{ width: "200px", height: "200px" }}
              fontSize={"large"}
              color={"error"}
            />
          </div>
        )}
        <h1 className={type}>{type === "success" ? "Success" : "Failed"}</h1>
        <p>
          {type === "success"
            ? "You have successfully verified your account"
            : "Verification failed. The link may have expired or invalid. Login to send another verification link"}
        </p>
        <div className="mt-4" onClick={login}>
          <Button variant="contained" color="success">
            Login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Results;
