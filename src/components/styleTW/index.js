import tw from 'twin.macro';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { css } from 'styled-components/macro';
import { ReactComponent as SvgDecoratorBlob1 } from '../../images/svg-decorator-blob-5.svg';
import { ReactComponent as SvgDecoratorBlob2 } from '../../images/svg-decorator-blob-7.svg';
import { PrimaryButton as PrimaryButtonBase } from '../misc/Buttons';

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
  motion.a
)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
export const CardImageContainer = styled.div`
  ${(props) => css`
    background-image: url('products/${props.imageSrc}');
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
