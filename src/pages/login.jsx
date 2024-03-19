import React, { useEffect, useState } from "react";
import tw from "twin.macro";
import styled from "styled-components"; //eslint-disable-line
import { ReactComponent as LoginIcon } from "feather-icons/dist/icons/log-in.svg";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import { useLocation, useNavigate } from "react-router-dom";
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
export function Login({
  logoLinkUrl = "#",
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
  forgotPasswordUrl = "#",
  signupUrl = "#",
}) {
  const spinner = useSelector((state) => state.spinner);
  const message = useSelector((state) => state.messages);
  const persist = useSelector((state) => state.persist);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fromAdmin = location.state?.from?.pathname || "/admin/home";
  const from = location.state?.from?.pathname || "/customer";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(load());
    const data = { email, password };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/login`,
        JSON.stringify(data),
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        },
      );
      const accessToken = response?.data?.token;
      const roles = response?.data?.roles;
      dispatch(setAuth({ roles, accessToken }));
      if (roles.includes("ROLE_SUPER_ADMIN" || "ROLE_ADMIN")) {
        navigate(fromAdmin, { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (error) {
      if (!error.response) {
        dispatch(setMessages("Oops! Server Error"));
      } else {
        dispatch(setMessages(error.response.data.message));
      }
    } finally {
      dispatch(unload());
    }
  };

  const togglePersist = () => {
    dispatch(setPersist());
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

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
                  <DividerText>Or Sign in with your e-mail</DividerText>
                </DividerTextContainer>
                <Form onSubmit={handleSubmit}>
                  {message ? (
                    <Stack sx={{ width: "100%" }} spacing={2}>
                      <Alert
                        severity="error"
                        action={
                          <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                              dispatch(setMessages(""));
                            }}
                          >
                            <MdClose />
                          </IconButton>
                        }
                      >
                        {message}
                      </Alert>
                    </Stack>
                  ) : (
                    <span />
                  )}
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
                  {spinner ? (
                    <Box sx={{ textAlign: "center", marginTop: "1rem" }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <SubmitButton type="submit">
                      <SubmitButtonIcon className="icon" />
                      <span className="text">{submitButtonText}</span>
                    </SubmitButton>
                  )}
                  <div className="flex gap-x-2 mt-2">
                    <input
                      className="text-xs text-gray-600"
                      type="checkbox"
                      id="persist"
                      onChange={() => togglePersist()}
                      checked={persist}
                    />
                    <label className="text-sm text-gray-600" htmlFor="persist">
                      Trust This Device?
                    </label>
                  </div>
                </Form>

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
