import React, { useState } from "react";
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Box from "@mui/material/Box";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import logo from "../images/logo.svg";
import illustration from "../images/reset-password.svg";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import { resetPassword, signUp } from "../features/user/userSlice";
import {
  confirmPasswordValidator,
  passwordValidator,
} from "../utility/validator";
import IconButton from "@mui/material/IconButton";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Container,
  Content,
  DividerText,
  DividerTextContainer,
  FormContainer,
  Heading,
  IllustrationContainer,
  IllustrationImage,
  LogoImage,
  LogoLink,
  MainContainer,
  MainContent,
  SubmitButton,
} from "../components/styleTW";

export function ResetPassword({
  logoLinkUrl = "#",
  illustrationImageSrc = illustration,
  headingText = "Reset Password",
  submitButtonText = "Reset",
  SubmitButtonIcon = LoginIcon,
}) {
  const status = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = async () => {
    if (
      password &&
      confirmPassword &&
      !passwordError &&
      !confirmPasswordError
    ) {
      try {
        await dispatch(
          resetPassword({
            password,
            confirmPassword,
            token,
          }),
        );
        navigate("/login");
      } catch (err) {
        throw new Error(error);
      }
    } else {
      setPasswordError(passwordValidator(password));
      setConfirmPasswordError(
        confirmPasswordValidator(password, confirmPassword),
      );
    }
  };

  return (
    <AnimationRevealPage>
      <Container>
        <Content>
          <MainContainer>
            <LogoLink href={logoLinkUrl}>
              <LogoImage src={logo} />
            </LogoLink>
            <MainContent>
              <Heading>{headingText}</Heading>
              <FormContainer>
                <DividerTextContainer>
                  <DividerText>Hurray, you can reset your password</DividerText>
                </DividerTextContainer>
                <div>
                  <FormControl
                    sx={{ mb: 3 }}
                    color={"success"}
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Password
                    </InputLabel>
                    <OutlinedInput
                      name={"password"}
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        if (passwordError) {
                          setPasswordError(
                            passwordValidator(event.target.value),
                          );
                        }
                      }}
                      onBlur={() =>
                        setPasswordError(passwordValidator(password))
                      }
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Password"
                    />
                    <FormHelperText error id="outlined-weight-helper-text">
                      {passwordError}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    sx={{ mb: 3 }}
                    color={"success"}
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Confirm Password
                    </InputLabel>
                    <OutlinedInput
                      placeholder="Confirm Password"
                      value={confirmPassword}
                      name="confirmPassword "
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        if (confirmPasswordError) {
                          setConfirmPasswordError(
                            confirmPasswordValidator(
                              password,
                              event.target.value,
                            ),
                          );
                        }
                      }}
                      onBlur={() =>
                        setConfirmPasswordError(
                          confirmPasswordValidator(password, confirmPassword),
                        )
                      }
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Confirm Password"
                    />
                    <FormHelperText error id="outlined-weight-helper-text">
                      {confirmPasswordError}
                    </FormHelperText>
                  </FormControl>
                  {status === "loading" ? (
                    <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                      <CircularProgress color={"success"} />
                    </Box>
                  ) : (
                    <SubmitButton onClick={onSubmit}>
                      <SubmitButtonIcon className="icon" />
                      <span className="text">{submitButtonText}</span>
                    </SubmitButton>
                  )}
                </div>
                <p className="mt-8 text-sm text-gray-600 hover:text-green-100 text-center">
                  Don't have an account?{" "}
                  <Link
                    to={"/signup"}
                    className="border-b border-green-100 border-dotted"
                  >
                    Create Account
                  </Link>
                </p>
              </FormContainer>
            </MainContent>
          </MainContainer>
          <IllustrationContainer>
            <IllustrationImage imageSrc={illustrationImageSrc} />
          </IllustrationContainer>
        </Content>
      </Container>
    </AnimationRevealPage>
  );
}
