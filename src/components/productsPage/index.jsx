import React, { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import searchIcon from "../../images/search.svg";
import {
  fetchProducts,
  clearSnackbarMessage,
} from "../../redux/productSlice.js";
import { motion } from "framer-motion";
import tw from "twin.macro";
import { CardContainer } from "../cards/CardContainter.js";
import styled from "styled-components";
import { css } from "styled-components/macro"; //eslint-disable-line
import { Container, ContentWithPaddingXl } from "../misc/Layouts.js";
import { SectionHeading } from "../misc/Headings.js";
import { PrimaryButton as PrimaryButtonBase } from "../misc/Buttons.js";
import { ReactComponent as StarIcon } from "../../images/star-icon.svg";
import { ReactComponent as SvgDecoratorBlob1 } from "../../images/svg-decorator-blob-5.svg";
import { ReactComponent as SvgDecoratorBlob2 } from "../../images/svg-decorator-blob-7.svg";

const Header = tw(SectionHeading)`mt-12`;
const HeaderRow = tw.div`flex items-center flex-col xl:flex-row mt-0`;

const Search = tw.div`my-8 mr-16 w-6/12 flex items-center justify-between p-2 rounded shadow-md`;
const SearchInput = tw.input`w-11/12 px-4 py-2 border-none focus:outline-none focus:border-none focus:ring-2 focus:ring-green-500 rounded-md`;

const TabsControl = tw.div`flex flex-wrap bg-gray-200 px-2 py-2 rounded leading-none mt-12 xl:mt-0`;

const TabControl = styled.div`
  ${tw`cursor-pointer px-6 py-3 mt-2 sm:mt-0 sm:mr-2 last:mr-0 text-gray-600 font-medium rounded-sm transition duration-300 text-sm sm:text-base w-1/2 sm:w-auto text-center`}
  &:hover {
    ${tw`bg-gray-300 text-gray-700`}
  }
  ${(props) => props.active && tw`bg-green-500! text-gray-100!`}
  }
`;

const Card = tw(
  motion.a
)`bg-gray-200 rounded-b block max-w-xs mx-auto sm:max-w-none sm:mx-0`;
const CardImageContainer = styled.div`
  ${(props) =>
    css`
      background-image: url("products/${props.image}");
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

const ProductsPage = ({ heading = "Checkout Our Products" }) => {
  const dispatch = useDispatch();
  const tabs = useSelector((state) => state.productSlice.tabs);
  const products = useSelector((state) => state.productSlice.items);

  const loading = useSelector((state) => state.productSlice.loading);
  const snackbarMessage = useSelector(
    (state) => state.productSlice.snackbarMessage
  );
  const error = useSelector((state) => state.productSlice.error);

  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch, activeTab]);

  useEffect(() => {
    dispatch(fetchProducts({ page: currentPage, searchTerm }));
  }, [dispatch, currentPage, searchTerm]);

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
        <Header>{heading}</Header>

        <HeaderRow>
          <Search>
            <SearchInput
              placeholder="Search Products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <img
              src={searchIcon}
              class="cursor-pointer"
              alt="search"
              onClick={() => fetchProducts(searchTerm)}
            />
          </Search>
          <TabsControl>
            {tabs.map((tab, index) => (
              <TabControl
                key={index}
                active={activeTab === tab.name}
                onClick={() => setActiveTab(tab.name)}
              >
                {tab.name}
              </TabControl>
            ))}
          </TabsControl>
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
      <div className="flex items-center justify-center mt-4">
        <Pagination
          page={currentPage}
          onChange={(e, value) => setCurrentPage(value)}
          color="primary"
        />
      </div>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
};

export default ProductsPage;
