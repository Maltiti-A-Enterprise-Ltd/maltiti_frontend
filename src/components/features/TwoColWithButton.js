import React from "react";
import tw from "@/lib/tw";
import styled from "styled-components";
import { css } from "styled-components"; //eslint-disable-line
import {
  SectionHeading,
  Subheading as SubheadingBase,
} from "../misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "../misc/Buttons.js";
import TeamIllustrationSrc from "../../images/team-illustration-2.svg";
import { ReactComponent as SvgDotPattern } from "../../images/dot-pattern.svg";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col md:flex-row justify-between max-w-screen-xl mx-auto py-20 md:py-24 items-center`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:w-6/12 flex-shrink-0 relative`;
const TextColumn = styled(Column)((props) => [
  tw`mt-16 md:w-6/12 md:mt-0`,
  props.textOnLeft
    ? tw`md:mr-12 lg:mr-16 md:order-first`
    : tw`md:ml-12 lg:ml-16 md:order-last`,
]);

const Image = styled.img((props) => [
  props.imageRounded && tw`rounded`,
  props.imageBorder && tw`border`,
  props.imageShadow && tw`shadow`,
]);

const DecoratorBlob = styled(SvgDotPattern)(() => [
  tw`absolute bottom-0 right-0 w-20 h-20 text-green-500 transform translate-x-1/2 translate-y-1/2 fill-green-100 -z-10`,
]);

const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Subheading = tw(SubheadingBase)`text-center md:text-left`;
const Heading = tw(
  SectionHeading,
)`mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;
const Description = tw.p`mt-4 text-center md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-black`;

const PrimaryButton = styled(PrimaryButtonBase)((props) => [
  tw`inline-block mx-auto mt-8 text-sm md:mt-8 md:mx-0`,
  props.buttonRounded && tw`rounded-full`,
]);

export default function ({
  subheading = "Our Expertise",
  heading = (
    <>
      {/* eslint-disable-next-line react/no-unknown-property */}
      Designed & Developed by <span tw="text-green-500">Professionals.</span>
    </>
  ),
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  primaryButtonText = "Learn More",
  imageSrc = TeamIllustrationSrc,
  buttonRounded = true,
  imageRounded = true,
  imageBorder = false,
  imageShadow = false,
  imageCss = null,
  imageDecoratorBlob = false,
  imageDecoratorBlobCss = null,
  textOnLeft = true,
  modal,
}) {
  return (
    <div id="about">
      <Container>
        <TwoColumn>
          <ImageColumn>
            <Image
              css={imageCss}
              src={imageSrc}
              imageBorder={imageBorder}
              imageShadow={imageShadow}
              imageRounded={imageRounded}
            />
            {imageDecoratorBlob && (
              <DecoratorBlob css={imageDecoratorBlobCss} />
            )}
          </ImageColumn>
          <TextColumn textOnLeft={textOnLeft}>
            <TextContent>
              <Subheading>{subheading}</Subheading>
              <Heading>{heading}</Heading>
              <Description>{description}</Description>
              <PrimaryButton buttonRounded={buttonRounded} onClick={modal}>
                {primaryButtonText}
              </PrimaryButton>
            </TextContent>
          </TextColumn>
        </TwoColumn>
      </Container>
    </div>
  );
}
