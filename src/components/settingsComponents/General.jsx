import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { emailValidator } from "../../utility/validator";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

//component to view and change user profile details
const General = () => {
  const user = useSelector((state) => state.user).user.user;

  //state of input fields
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [location, setLocation] = useState("");
  const [emailError, setEmailError] = useState("");

  const dispatch = useDispatch();
  const status = "idle";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
      }}
      className="pl-8 w-80 flex flex-col gap-y-4"
    >
      <div>
        <FormControl
          sx={{ mb: 3 }}
          color={"success"}
          fullWidth
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">Name</InputLabel>
          <OutlinedInput
            type="text"
            placeholder="Name"
            value={name}
            name="name"
            onChange={(event) => {
              setName(event.target.value);
              if (emailError) {
                setEmailError(emailValidator(event.target.value));
              }
            }}
            onBlur={() => setEmailError(emailValidator(email))}
            id="outlined-adornment-password"
            label="Email"
          />
          <FormHelperText error id="outlined-weight-helper-text">
            {emailError}
          </FormHelperText>
        </FormControl>
      </div>
      <div>
        <FormControl
          sx={{ mb: 3 }}
          color={"success"}
          fullWidth
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
          <OutlinedInput
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) {
                setEmailError(emailValidator(event.target.value));
              }
            }}
            onBlur={() => setEmailError(emailValidator(email))}
            id="outlined-adornment-password"
            label="Email"
          />
          <FormHelperText error id="outlined-weight-helper-text">
            {emailError}
          </FormHelperText>
        </FormControl>
      </div>
      <div>
        <FormControl
          sx={{ mb: 3 }}
          color={"success"}
          fullWidth
          variant="outlined"
        >
          <InputLabel htmlFor="outlined-adornment-password">Email</InputLabel>
          <OutlinedInput
            type="email"
            placeholder="Email"
            value={email}
            name="email"
            onChange={(event) => {
              setEmail(event.target.value);
              if (emailError) {
                setEmailError(emailValidator(event.target.value));
              }
            }}
            onBlur={() => setEmailError(emailValidator(email))}
            id="outlined-adornment-password"
            label="Email"
          />
          <FormHelperText error id="outlined-weight-helper-text">
            {emailError}
          </FormHelperText>
        </FormControl>
      </div>
      <div className="flex justify-end">
        {status === "loading" ? (
          <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
            <CircularProgress color={"success"} />
          </Box>
        ) : (
          <Button>Save</Button>
        )}
      </div>
    </form>
  );
};

export default General;
