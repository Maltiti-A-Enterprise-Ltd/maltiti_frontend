import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
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
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import googleIconImageSrc from "../images/google-icon.png";
import logo from "../images/logo.svg";
import illustration from "../images/login-illustration.svg";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import { emailValidator, requiredValidator } from "../utility/validator";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "../features/user/userSlice";
import {
  Container,
  Content,
  DividerText,
  DividerTextContainer,
  FormContainer,
  Heading,
  IllustrationContainer,
  LogoImage,
  LogoLink,
  MainContainer,
  MainContent,
  SubmitButton,
} from "../components/styleTW";

const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`w-full max-w-sm m-12 bg-center bg-no-repeat bg-contain xl:m-16`}
`;
export function Login({
  logoLinkUrl = "login",
  illustrationImageSrc = illustration,
  headingText = "Sign In To Maltiti",
  socialButtons = [
    {
      iconImageSrc: googleIconImageSrc,
      text: "Sign In With Google",
      url: "https://google.com",
    },
  ],
  submitButtonText = "Sign In",
  SubmitButtonIcon = LoginIcon,
  forgotPasswordUrl = "forgot-password",
  signupUrl = "signup",
}) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.user.status);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = () => {
    if (email && password && !emailError && !passwordError) {
      dispatch(
        login({
          email,
          password,
        }),
      );
    } else {
      setEmailError(emailValidator(email));
      setPasswordError(requiredValidator(password));
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
                  <DividerText>Sign in with your e-mail</DividerText>
                </DividerTextContainer>
                <div>
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
                            requiredValidator(event.target.value),
                          );
                        }
                      }}
                      id="outlined-adornment-password"
                      type={showPassword ? "text" : "password"}
                      onBlur={() =>
                        setPasswordError(requiredValidator(password))
                      }
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
                <p className="mt-6 text-xs text-gray-600 hover:text-green-100 text-center">
                  <a
                    href={forgotPasswordUrl}
                    className="border- border-green-500 border-dotted"
                  >
                    Forgot Password ?
                  </a>
                </p>
                <p className="mt-8 text-sm text-gray-600 hover:text-green-100 text-center">
                  Dont have an account?{" "}
                  <a
                    href={signupUrl}
                    className="border-b border-green-100 border-dotted"
                  >
                    Sign Up
                  </a>
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
