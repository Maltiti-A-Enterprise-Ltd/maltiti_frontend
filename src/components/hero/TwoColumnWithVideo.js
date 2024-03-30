import React, { useState } from "react";
import styled from "styled-components";
import tw from "twin.macro";
// eslint-disable-next-line
import { css } from "styled-components/macro";

import { ReactComponent as PlayIcon } from "feather-icons/dist/icons/play-circle.svg";
import { ReactComponent as CloseIcon } from "feather-icons/dist/icons/x.svg";
import { Link } from "react-router-dom";
import ReactModalAdapter from "../../helpers/ReactModalAdapter.js";
import ResponsiveVideoEmbed from "../../helpers/ResponsiveVideoEmbed.js";

import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-1.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/dot-pattern.svg";
import DesignIllustration from "../../images/design-illustration.svg";

const Container = tw.div`relative`;
const TwoColumn = tw.div`flex flex-col lg:flex-row md:items-center max-w-screen-xl mx-auto py-20 md:py-24`;
const LeftColumn = tw.div`relative lg:w-6/12 lg:pr-12 flex-shrink-0 text-center lg:text-left`;
const RightColumn = tw.div`relative mt-12 lg:mt-0 flex flex-col justify-center`;

const Heading = tw.h1`font-black text-3xl md:text-5xl leading-snug max-w-3xl`;
const Paragraph = tw.p`my-5 lg:my-8 text-sm lg:text-base font-medium text-gray-600 max-w-lg mx-auto lg:mx-0`;

const Actions = tw.div`flex flex-col items-center sm:flex-row justify-center lg:justify-start mt-8`;
const PrimaryButton = tw.button`font-bold px-8 lg:px-10 py-3 rounded bg-green-500 text-gray-100 hocus:bg-green-700 focus:outline focus:outline-none transition duration-300`;
const WatchVideoButton = styled.button`
  ${tw`flex items-center mt-4 text-black transition duration-300 sm:mt-0 sm:ml-8 hocus:text-green-400 focus:outline-none`}
  .playIcon {
    ${tw`w-12 h-12 stroke-1`}
  }
  .playText {
    ${tw`ml-2 font-medium`}
  }
`;

const IllustrationContainer = tw.div`flex justify-center md:justify-end items-center relative max-w-3xl lg:max-w-none`;

// Random Decorator Blobs (shapes that you see in background)
const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`absolute bottom-0 left-0 w-64 h-64 transform pointer-events-none opacity-5 -translate-x-1 -z-10`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`absolute bottom-0 right-0 w-32 h-32 text-green-500 transform translate-x-10 translate-y-10 opacity-25 pointer-events-none z-10`}
`;

const StyledModal = styled(ReactModalAdapter)`
  &.mainHeroModal__overlay {
    ${tw`fixed inset-0 z-50`}
  }
  &.mainHeroModal__content {
    ${tw`absolute inset-0 flex items-center justify-center max-w-screen-xl m-4 bg-gray-200 rounded-lg outline-none xl:mx-auto sm:m-16`}
  }
  .content {
    ${tw`w-full lg:p-16`}
  }
`;
const CloseModalButton = tw.button`absolute top-0 right-0 mt-8 mr-8 hocus:text-green-500`;

export default function ({
  heading = "Modern React Templates, Just For You",
  description = "Our templates are easy to setup, understand and customize. Fully modular components with a variety of pages and components.",
  primaryButtonText = "Get Started",
  watchVideoButtonText = "Watch Video",
  watchVideoYoutubeUrl = "https://www.youtube.com/embed/urqDElN7gzo",
  imageSrc = DesignIllustration,
  imageCss = null,
  imageDecoratorBlob = false,
}) {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  return (
    <Container id="home">
      <TwoColumn>
        <LeftColumn>
          <Heading>{heading}</Heading>
          <Paragraph>{description}</Paragraph>
          <Actions>
            <PrimaryButton as="a">
              <Link to="/shop">{primaryButtonText}</Link>
            </PrimaryButton>
            <WatchVideoButton onClick={toggleModal}>
              <span className="playIconContainer">
                <PlayIcon className="playIcon" />
              </span>
              <span className="playText">{watchVideoButtonText}</span>
            </WatchVideoButton>
          </Actions>
        </LeftColumn>
        <RightColumn>
          <IllustrationContainer>
            {/* eslint-disable-next-line react/no-unknown-property */}
            <img css={imageCss} src={imageSrc} alt="Hero" />
            {imageDecoratorBlob && <DecoratorBlob2 />}
          </IllustrationContainer>
        </RightColumn>
      </TwoColumn>
      <DecoratorBlob1 />
      <StyledModal
        closeTimeoutMS={300}
        className="mainHeroModal"
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        shouldCloseOnOverlayClick
      >
        <CloseModalButton onClick={toggleModal}>
          <CloseIcon tw="w-6 h-6" />
        </CloseModalButton>
        <div className="content">
          <ResponsiveVideoEmbed url={watchVideoYoutubeUrl} tw="w-full" />
        </div>
      </StyledModal>
    </Container>
  );
}
