import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { useSelector, useDispatch } from "react-redux";
import IconButton from "@mui/material/IconButton";
import { MdClose } from "react-icons/md";
import {
  load,
  setAuth,
  setMessages,
  setPersist,
  unload,
} from "../actions/index.js";
import googleIconImageSrc from "../images/google-icon.png";
import logo from "../images/logo.svg";
import illustration from "../images/login-illustration.svg";
import { Container as ContainerBase } from "../components/misc/Layouts";
import AnimationRevealPage from "../helpers/AnimationRevealPage.js";
import { signUp } from "../features/user/userSlice";

const Container = tw(
  ContainerBase,
)`min-h-fit text-white font-medium flex justify-center -m-8`;
const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
const LogoLink = tw.a``;
const LogoImage = tw.img`h-12 mx-auto`;
const MainContent = tw.div`mt-12 flex flex-col items-center`;
const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
const FormContainer = tw.div`w-full flex-1 mt-8`;
const SocialButtonsContainer = tw.div`flex flex-col items-center`;
const SocialButton = styled.a`
  ${tw`flex items-center justify-center w-full max-w-xs py-3 mt-5 text-sm font-semibold text-gray-900 transition-all duration-300 bg-gray-100 border rounded-lg hocus:bg-gray-200 hocus:border-gray-400 focus:outline-none focus:outline first:mt-0`}
  .iconContainer {
    ${tw`p-2 bg-white rounded-full`}
  }
  .icon {
    ${tw`w-4`}
  }
  .text {
    ${tw`ml-4`}
  }
`;
const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;
const Form = tw.form`mx-auto max-w-xs`;
const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
const SubmitButton = styled.button`
  ${tw`flex items-center justify-center w-full py-4 mt-5 font-semibold tracking-wide text-gray-100 transition-all duration-300 ease-in-out rounded-lg bg-green-100 hover:bg-green-900 focus:outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-white text-center hidden lg:flex justify-center`;
const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`w-full max-w-sm m-12 bg-center bg-no-repeat bg-contain xl:m-16`}
`;
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
                <SocialButtonsContainer>
                  {socialButtons.map((socialButton) => (
                    <SocialButton key={socialButton} href={socialButton.url}>
                      <span className="iconContainer">
                        <img
                          src={socialButton.iconImageSrc}
                          className="icon"
                          alt=""
                        />
                      </span>
                      <span className="text">{socialButton.text}</span>
                    </SocialButton>
                  ))}
                </SocialButtonsContainer>
                <DividerTextContainer>
                  <DividerText>Or Sign Up with your e-mail</DividerText>
                </DividerTextContainer>
                <Form
                  onSubmit={() =>
                    dispatch(
                      signUp({
                        name,
                        email,
                        password,
                        confirmPassword,
                        userType: "user",
                      }),
                    )
                  }
                >
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    name="name"
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    name="email"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    name="password"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <Input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    name="confirmPassword "
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    required
                  />
                  {status === "loading" ? (
                    <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <SubmitButton type="submit">
                      <SubmitButtonIcon className="icon" />
                      <span className="text">{submitButtonText}</span>
                    </SubmitButton>
                  )}
                </Form>
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
