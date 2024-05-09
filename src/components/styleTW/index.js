import tw from "twin.macro";
import styled from "styled-components";
import { motion } from "framer-motion";
import { css } from "styled-components/macro";
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-5.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/svg-decorator-blob-7.svg";
import { PrimaryButton as PrimaryButtonBase } from "../misc/Buttons";
import { Container as ContainerBase } from "../misc/Layouts";

export const HighlightedText = tw.span`bg-green-500 text-gray-100 px-4 transform -skew-x-12 inline-block mt-2`;

export const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-20 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
export const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-20 transform -translate-x-2/3 text-green-500`}
`;

export const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
export const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;

export const TabControl = styled.div`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${(props) => props.active && tw`bg-green-500! text-gray-100!`}
  }
`;

export const CardContainer = tw.div`mt-10 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 sm:pr-10 md:pr-6 lg:pr-12`;
export const Card = tw(
  motion.a,
)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
export const CardImageContainer = styled.div`
  ${(props) => css`
    background-image: url("products/${props.imageSrc}");
  `}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;
export const CardRatingContainer = tw.div`leading-none absolute inline-flex bg-gray-100 bottom-0 left-0 ml-4 mb-4 rounded-full px-5 py-2 items-end`;
export const CardRating = styled.div`
  ${tw`mr-1 text-sm font-bold flex items-end`}
  svg {
    ${tw`w-4 h-4 fill-green-100 text-orange-400`}
  }
`;

export const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-12 grid`}
`;
export const CardButton = tw(PrimaryButtonBase)`text-sm`;

export const CardReview = tw.div`font-medium text-xs text-gray-600`;

export const CardText = tw.div`p-4 text-gray-900`;
export const CardTitle = tw.h5`text-lg font-semibold group-hover:text-green-500`;
export const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
export const CardPrice = tw.p`mt-4 text-sm font-bold`;

export const Container = tw(
  ContainerBase,
)`min-h-fit text-white font-medium flex justify-center -m-8`;
export const Content = tw.div`max-w-screen-xl m-0 sm:mx-20 bg-white text-gray-900 shadow sm:rounded-lg flex justify-center flex-1`;
export const MainContainer = tw.div`lg:w-1/2 xl:w-5/12 p-6 sm:p-12`;
export const LogoLink = tw.a``;
export const LogoImage = tw.img`h-12 mx-auto`;
export const MainContent = tw.div`mt-12 flex flex-col items-center`;
export const Heading = tw.h1`text-2xl xl:text-3xl font-extrabold`;
export const FormContainer = tw.div`w-full flex-1 mt-8`;
export const SocialButtonsContainer = tw.div`flex flex-col items-center`;
export const SocialButton = styled.a`
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
export const DividerTextContainer = tw.div`my-12 border-b text-center relative`;
export const DividerText = tw.div`leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform -translate-y-1/2 absolute inset-x-0 top-1/2 bg-transparent`;
export const Form = tw.form`mx-auto max-w-xs`;
export const Input = tw.input`w-full px-8 py-4 rounded-lg font-medium bg-gray-100 border border-gray-200 placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white mt-5 first:mt-0`;
export const SubmitButton = styled.button`
  ${tw`flex items-center justify-center w-full py-4 mt-5 font-semibold tracking-wide text-gray-100 transition-all duration-300 ease-in-out rounded-lg bg-green-100 hover:bg-green-900 focus:outline focus:outline-none`}
  .icon {
    ${tw`w-6 h-6 -ml-2`}
  }
  .text {
    ${tw`ml-3`}
  }
`;
export const IllustrationContainer = tw.div`sm:rounded-r-lg flex-1 bg-white text-center hidden lg:flex justify-center`;

export const IllustrationImage = styled.div`
  ${(props) => `background-image: url("${props.imageSrc}");`}
  ${tw`w-full max-w-sm m-12 bg-center bg-no-repeat bg-contain xl:m-16`}
`;
