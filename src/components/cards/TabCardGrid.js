import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  clearSnackbarMessage,
} from "../../redux/productSlice.js";
import { motion } from "framer-motion";
import tw from "twin.macro";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "../misc/Layouts.js";
import { SectionHeading } from "../misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "../misc/Buttons.js";
import { ReactComponent as StarIcon } from "../../images/star-icon.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-5.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/svg-decorator-blob-7.svg";

const HeaderRow = tw.div`flex justify-between items-center flex-col xl:flex-row`;
const Header = tw(SectionHeading)``;

const CardContainer = tw.div`mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8`;
const Card = tw(
  motion.a
)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;

const CardImageContainer = styled.div`
  ${(props) =>
    css`
      background-image: url("products/${props.imageSrc}");
    `}
  ${tw`h-56 xl:h-64 bg-center bg-cover relative rounded-t`}
`;

const CardRatingContainer = tw.div`leading-none absolute inline-flex bg-gray-100 bottom-0 left-0 ml-4 mb-4 rounded-full px-5 py-2 items-end`;
const CardRating = styled.div`
  ${tw`mr-1 text-sm font-bold flex items-end`}
  svg {
    ${tw`w-4 h-4 fill-green-100 text-orange-400`}
  }
`;

const CardHoverOverlay = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.5);
  ${tw`absolute inset-12 grid`}
`;

const CardButton = tw(PrimaryButtonBase)`text-sm`;

const CardReview = tw.div`font-medium text-xs text-gray-600`;

const CardText = tw.div`p-4 text-gray-900`;
const CardTitle = tw.h5`text-lg font-semibold group-hover:text-green-500`;
const CardContent = tw.p`mt-1 text-sm font-medium text-gray-600`;
const CardPrice = tw.p`mt-4 text-sm font-bold`;

const DecoratorBlob1 = styled(SvgDecoratorBlob1)`
  ${tw`pointer-events-none -z-20 absolute right-0 top-0 h-64 w-64 opacity-20 transform translate-x-2/3 -translate-y-12 text-pink-400`}
`;
const DecoratorBlob2 = styled(SvgDecoratorBlob2)`
  ${tw`pointer-events-none -z-20 absolute left-0 bottom-0 h-80 w-80 opacity-20 transform -translate-x-2/3 text-green-500`}
`;

export default ({ heading = "Checkout the Menu" }) => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.productSlice.items);
  const loading = useSelector((state) => state.productSlice.loading);
  const snackbarMessage = useSelector(
    (state) => state.productSlice.snackbarMessage
  );

  const error = useSelector((state) => state.productSlice.error);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    if (snackbarMessage) {
      setIsSnackbarOpen(true);
    }
  }, [snackbarMessage]);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsSnackbarOpen(false);
    dispatch(clearSnackbarMessage());
  };

  return (
    <Container id="shop">
      <ContentWithPaddingXl>
        <HeaderRow>
          <Header>{heading}</Header>
        </HeaderRow>

        <CardContainer>
          {loading
            ? // Display Skeleton when loading
              Array.from({ length: 8 }).map((_, index) => (
                <Card key={index} className="group">
                  <CardImageContainer>
                    <Skeleton variant="rectangular" width="100%" height={200} />
                  </CardImageContainer>
                  <CardText>
                    <Skeleton variant="text" width="80%" height={20} />
                    <Skeleton variant="text" width="60%" height={16} />
                    <Skeleton variant="text" width="70%" height={16} />
                    <Skeleton variant="text" width="50%" height={16} />
                  </CardText>
                </Card>
              ))
            : products.map((product, id) => (
                <Card
                  key={id}
                  className="group"
                  // href={product.url}
                  initial="rest"
                  whileHover="hover"
                  animae="rest"
                >
                  <CardImageContainer>
                    <img src={product.image} alt={product.name} />
                    <CardRatingContainer>
                      <CardRating>
                        <StarIcon />
                        {product.rating}
                      </CardRating>
                      {/* <CardReview>({product.reviews})</CardReview> */}
                    </CardRatingContainer>
                    <CardHoverOverlay
                      variants={{
                        hover: {
                          opacity: 1,
                          height: "auto",
                        },
                        rest: {
                          opacity: 0,
                          height: 0,
                        },
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <CardButton>Add to Cart</CardButton>
                      <br />
                      <CardButton>View Details</CardButton>
                    </CardHoverOverlay>
                  </CardImageContainer>
                  <CardText>
                    <CardTitle>{product.name}</CardTitle>
                    <CardPrice>Wholesale: GH₵ {product.wholesale}</CardPrice>
                    <CardPrice>Retail: GH₵ {product.retail}</CardPrice>
                    <CardContent>{product.description}</CardContent>
                  </CardText>
                </Card>
              ))}
        </CardContainer>
        <Snackbar
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          open={isSnackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
        >
          <Alert
            elevation={6}
            variant="filled"
            onClose={handleSnackbarClose}
            severity={error ? "error" : "success"}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
};
