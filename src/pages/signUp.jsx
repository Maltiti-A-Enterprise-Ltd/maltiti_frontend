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
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import googleIconImageSrc from "../images/google-icon.png";
import logo from "../images/logo.svg";
import illustration from "../images/login-illustration.svg";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import { signUp } from "../features/user/userSlice";
import {
  confirmPasswordValidator,
  emailValidator,
  passwordValidator,
  requiredValidator,
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

export function SignUp({
  logoLinkUrl = "#",
  illustrationImageSrc = illustration,
  headingText = "Sign Up To Maltiti",
  socialButtons = [
    {
      iconImageSrc: googleIconImageSrc,
      text: "Sign Up With Google",
      url: "https://google.com",
    },
  ],
  submitButtonText = "Sign Up",
  SubmitButtonIcon = LoginIcon,
}) {
  const status = useSelector((state) => state.user.status);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = () => {
    if (
      name &&
      email &&
      password &&
      confirmPassword &&
      !passwordError &&
      !nameError &&
      !confirmPasswordError &&
      !emailError
    ) {
      dispatch(
        signUp({
          name,
          email,
          password,
          confirmPassword,
          userType: "user",
        }),
      );
    } else {
      setNameError(requiredValidator(name));
      setEmailError(emailValidator(email));
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
                {/*<SocialButtonsContainer>*/}
                {/*  {socialButtons.map((socialButton) => (*/}
                {/*    <SocialButton key={socialButton} href={socialButton.url}>*/}
                {/*      <span className="iconContainer">*/}
                {/*        <img*/}
                {/*          src={socialButton.iconImageSrc}*/}
                {/*          className="icon"*/}
                {/*          alt=""*/}
                {/*        />*/}
                {/*      </span>*/}
                {/*      <span className="text">{socialButton.text}</span>*/}
                {/*    </SocialButton>*/}
                {/*  ))}*/}
                {/*</SocialButtonsContainer>*/}
                <DividerTextContainer>
                  <DividerText>Sign Up with your e-mail</DividerText>
                </DividerTextContainer>
                <div>
                  <FormControl
                    sx={{ mb: 3 }}
                    color={"success"}
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Full Name
                    </InputLabel>
                    <OutlinedInput
                      className="capitalize"
                      type="text"
                      placeholder="Full Name"
                      value={name}
                      name="name"
                      onChange={(event) => {
                        setName(event.target.value);
                        if (nameError) {
                          setNameError(requiredValidator(event.target.value));
                        }
                      }}
                      onBlur={() => setNameError(requiredValidator(name))}
                      id="outlined-adornment-password"
                      label="Full Name"
                    />
                    <FormHelperText error id="outlined-weight-helper-text">
                      {nameError}
                    </FormHelperText>
                  </FormControl>
                  <FormControl
                    sx={{ mb: 3 }}
                    color={"success"}
                    fullWidth
                    variant="outlined"
                  >
                    <InputLabel htmlFor="outlined-adornment-password">
                      Email
                    </InputLabel>
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
                  Already have an account?{" "}
                  <Link
                    to={"/login"}
                    className="border-b border-green-100 border-dotted"
                  >
                    Login
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
