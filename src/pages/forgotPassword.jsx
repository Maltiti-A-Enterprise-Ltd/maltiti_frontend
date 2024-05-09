import React, { useState } from "react";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import Box from "@mui/material/Box";
import { useSelector, useDispatch } from "react-redux";
import logo from "../images/logo.svg";
import illustration from "../images/forgot_password.svg";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import { emailValidator } from "../utility/validator";
import { forgotPassword, login } from "../features/user/userSlice";
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
export function ForgotPassword({
  logoLinkUrl = "login",
  illustrationImageSrc = illustration,
  headingText = "Forgot Password",
  submitButtonText = "Submit",
  SubmitButtonIcon = LoginIcon,
  signupUrl = "signup",
}) {
  const dispatch = useDispatch();
  const status = useSelector((state) => state.user.status);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const onSubmit = () => {
    if (email && !emailError) {
      dispatch(forgotPassword(email));
    } else {
      setEmailError(emailValidator(email));
    }
  };

  return (
    <AnimationRevealPage>
      <div className={"mt-16"}>
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
                    <DividerText>Don't worry it happens</DividerText>
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
      </div>
    </AnimationRevealPage>
  );
}
