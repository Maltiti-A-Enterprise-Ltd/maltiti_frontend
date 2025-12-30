import React, { useState } from "react";
import tw from "@/lib/tw";
import styled from "styled-components";
import { css } from "styled-components"; //eslint-disable-line
import axios from "axios";
import { CircularProgress } from "@mui/material";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "../misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "../misc/Buttons.js";
import EmailIllustrationSrc from "../../images/email-illustration.svg";
import { backendUrl } from "../constants/index.js";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-5/12 flex-shrink-0 h-80 md:h-auto`;
const TextColumn = styled(Column)((props) => [
  tw`md:w-7/12 mt-16 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-12 lg:mr-16 md:order-first`
    : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled.div((props) => [
  `background-image: url("${props.imageSrc}");`,
  tw`rounded bg-contain bg-no-repeat bg-center h-full`,
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading,
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const Form = tw.form`mt-8 md:mt-10 text-sm flex flex-col`;
const Input = tw.input`md:w-96 border-2 px-4 py-3 rounded focus:outline-none font-medium transition duration-300 hocus:border-green-500`;

const SubmitButton = tw(PrimaryButtonBase)`md:w-96 inline-block mt-6 lg:mt-0`;

function Contactus({
  subheading = "Contact Us",
  heading = (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      Feel free to <span tw="text-green-500">get in touch</span>
      <wbr /> with us.
    </>
  ),
  description = "Send us a message, enquiry or concern by entering your email and message below.",
  submitButtonText = "Contact Us",
  textOnLeft = true,
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    setIsLoading(true);
    event.preventDefault();
    const data = { fullName, email, number, message };
    console.log(data);
    axios
      .post(`${backendUrl}/contactus`, data)
      .then(function (response) {
        setAlertMessage(response.data.message);
        setError(false);
        setFullName("");
        setEmail("");
        setNumber("");
        setMessage("");
        setIsLoading(false);
      })
      .catch(function () {
        setError(true);
        setAlertMessage("Oopps!!! Something Went Wrong, Try again!!!");
        setIsLoading(false);
      });
  };

  return (
    <Container id="contactus">
      <TwoColumn>
        <ImageColumn>
          <Image imageSrc={EmailIllustrationSrc} />
        </ImageColumn>
        <TextColumn textOnLeft={textOnLeft}>
          <TextContent>
            {subheading && <Subheading>{subheading}</Subheading>}
            <Heading>{heading}</Heading>
            <Description>{description}</Description>
            <Form onSubmit={handleSubmit}>
              {alertMessage ? (
                <Stack sx={{ width: "100%" }} spacing={2}>
                  <Alert severity={`${error ? "error" : "success"}`}>
                    {alertMessage}
                  </Alert>
                </Stack>
              ) : (
                <span />
              )}
              <br />
              <Input
                type="text"
                name="name"
                value={fullName}
                placeholder="Enter full name"
                onChange={(event) => setFullName(event.target.value)}
              />
              <br />
              <Input
                type="email"
                name="email"
                value={email}
                placeholder="Your Email Address"
                onChange={(event) => setEmail(event.target.value)}
              />
              <br />
              <Input
                type="number"
                name="phone"
                value={number}
                placeholder="Enter phone number"
                onChange={(event) => setNumber(event.target.value)}
              />
              <br />
              <textarea
                name="message"
                value={message}
                className="w-96 border-2 font-medium"
                placeholder="Enter message"
                onChange={(event) => setMessage(event.target.value)}
                required
              />
              <br />
              <SubmitButton type="submit">
                {isLoading ? (
                  <CircularProgress color="inherit" />
                ) : (
                  submitButtonText
                )}
              </SubmitButton>
            </Form>
          </TextContent>
        </TextColumn>
      </TwoColumn>
    </Container>
  );
}

export default Contactus;
