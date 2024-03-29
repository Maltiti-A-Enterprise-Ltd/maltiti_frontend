import React, { useEffect, useState } from "react";
import { Container, Skeleton, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import { Link } from "react-router-dom";
import { NavBar } from "../components/header";
import AnimationRevealPage from "../helpers/AnimationRevealPage";
import Footer from "../components/footers/MiniCenteredFooter";
import {
  Card,
  CardButton,
  CardContainer,
  CardContent,
  CardHoverOverlay,
  CardImageContainer,
  CardPrice,
  CardRating,
  CardRatingContainer,
  CardReview,
  CardText,
  CardTitle,
  HeaderRow,
  HighlightedText,
  TabControl,
  TabsControl,
} from "../components/styleTW";
import { Header } from "../components/misc/Headings";
import { ContentWithPaddingXl } from "../components/misc/Layouts";
import { ReactComponent as StarIcon } from "../images/star-icon.svg";
import {
  getProducts,
  toggleShowError,
  updateCurrentPage,
} from "../features/shop/shopSlice";
import { convertGramUnits } from "../utility/unitConverter";

function Shop() {
  const tabs = [
    { name: "All", value: "" },
    { name: "Shea butter", value: "shea butter" },
    { name: "Soap", value: "soap" },
    { name: "Essential Oils", value: "essential oil" },
    { name: "Others", value: "others" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const products = useSelector((state) => state.shop.products);
  const status = useSelector((state) => state.shop.status);
  const showError = useSelector((state) => state.shop.showError);
  const errorMessage = useSelector((state) => state.shop.errorMessage);
  const totalPages = useSelector((state) => state.shop.totalPages);
  const currentPage = useSelector((state) => state.shop.currentPage);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getProducts({
        category: activeTab,
        page: currentPage,
        searchTerm: "",
      }),
    );
  }, [currentPage, activeTab]);

  const handleScroll = () => {
    const { scrollY } = window;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollY + windowHeight >= documentHeight - 250) {
      if (currentPage < totalPages && status !== "loading") {
        dispatch(updateCurrentPage(currentPage + 1));
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [totalPages, status]);

  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => dispatch(toggleShowError(""))}
      >
        <Alert
          onClose={() => dispatch(toggleShowError(""))}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
      <AnimationRevealPage>
        <NavBar />
        <Container id="shop">
          <ContentWithPaddingXl>
            <div className="mt-4">
              <Header>
                Checkout our <HighlightedText>Products</HighlightedText>
              </Header>
            </div>
            <div className="mt-4">
              <HeaderRow>
                <Header />
                <TabsControl>
                  {tabs.map((tab) => (
                    <TabControl
                      key={tab.value}
                      active={activeTab === tab.value}
                      onClick={() => setActiveTab(tab.value)}
                    >
                      {tab.name}
                    </TabControl>
                  ))}
                </TabsControl>
              </HeaderRow>
            </div>
            <div className="mt-6 flex flex-wrap sm:-mr-10 md:-mr-6 lg:-mr-12">
              {status === "loading" && !products.length
                ? Array.from({ length: 8 }).map((item) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <CardContainer key={item}>
                      <Card className="group">
                        <CardImageContainer>
                          <Skeleton
                            variant="rectangular"
                            width="100%"
                            height={200}
                          />
                        </CardImageContainer>
                        <CardText>
                          <Skeleton variant="text" width="80%" height={20} />
                          <Skeleton variant="text" width="60%" height={16} />
                          <Skeleton variant="text" width="70%" height={16} />
                          <Skeleton variant="text" width="50%" height={16} />
                        </CardText>
                      </Card>
                    </CardContainer>
                  ))
                : products.map((product) => (
                    <CardContainer key={product.id}>
                      <Card
                        className="group"
                        href="#"
                        initial="rest"
                        whileHover="hover"
                        animate="rest"
                      >
                        <CardImageContainer imageSrc={product.image}>
                          <img
                            className="h-56 xl:h-64 bg-center bg-contain relative w-full rounded-t"
                            src={product.image}
                            alt={product.name}
                          />
                          <CardRatingContainer>
                            <CardRating>
                              <StarIcon />
                              {4}
                            </CardRating>
                            <CardReview>({87})</CardReview>
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
                            <CardButton type="button">
                              <Link to={`${product.id}`}>View Details</Link>
                            </CardButton>
                          </CardHoverOverlay>
                        </CardImageContainer>
                        <CardText>
                          <CardTitle>{product.name}</CardTitle>
                          <CardContent>
                            {String(product.size).toUpperCase()} (
                            {convertGramUnits(product.weight)})
                          </CardContent>
                          <CardPrice>GH₵ {product.retail}</CardPrice>
                          {/* <CardPrice>Retail: GH₵ {card.price_retail}</CardPrice> */}
                        </CardText>
                      </Card>
                    </CardContainer>
                  ))}
            </div>
          </ContentWithPaddingXl>
          {/* <DecoratorBlob1 /> */}
          {/* <DecoratorBlob2 /> */}
        </Container>
        <Footer />
      </AnimationRevealPage>
    </div>
  );
}
export default Shop;
