import React, { useEffect, useState } from "react";
import {
  Breadcrumbs,
  Container,
  Skeleton,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import { Link, useNavigate } from "react-router-dom";
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
  resetProducts,
  toggleShowError,
  updateCurrentPage,
} from "../features/shop/shopSlice";
import { convertGramUnits } from "../utility/unitConverter";
import { addToCart } from "../features/cart/cartSlice";
import { setToast } from "../features/toast/toastSlice";
import ShopCard from "../components/ShopCard";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

function Shop() {
  const tabs = [
    { name: "All", value: "" },
    { name: "Shea butter", value: "shea butter" },
    { name: "Soap", value: "soap" },
    { name: "Essential Oils", value: "essential oil" },
    { name: "Others", value: "others" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const [search, setSearch] = useState("");
  const [timer, setTimer] = useState(null);
  const products = useSelector((state) => state.shop.products);
  const status = useSelector((state) => state.shop.status);
  const showError = useSelector((state) => state.shop.showError);
  const errorMessage = useSelector((state) => state.shop.errorMessage);
  const totalPages = useSelector((state) => state.shop.totalPages);
  const currentPage = useSelector((state) => state.shop.currentPage);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getProducts({
        category: activeTab,
        page: currentPage,
        searchTerm: search,
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
        <div className={"mt-20"}></div>
        <Breadcrumbs separator={">"} aria-label="breadcrumb">
          <Link
            underline="hover"
            sx={{ display: "flex", alignItems: "center" }}
            color="inherit"
            to="/"
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Typography
            sx={{ display: "flex", alignItems: "center" }}
            color="text.primary"
          >
            <ShoppingBagIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Shop
          </Typography>
        </Breadcrumbs>
        <Container id="shop">
          <ContentWithPaddingXl>
            <div>
              <Header>
                Checkout our <HighlightedText>Products</HighlightedText>
              </Header>
            </div>
            <div className="mt-4">
              <HeaderRow>
                <TextField
                  id="standard-basic"
                  label="Search"
                  variant="standard"
                  color={"success"}
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    if (timer) {
                      clearTimeout(timer);
                      setTimer(null);
                    }
                    setTimer(
                      setTimeout(() => {
                        dispatch(resetProducts());
                        dispatch(updateCurrentPage(1));
                        dispatch(
                          getProducts({
                            category: activeTab,
                            page: currentPage,
                            searchTerm: search,
                          }),
                        );
                      }, 1000),
                    );
                  }}
                />
                <TabsControl>
                  {tabs.map((tab) => (
                    <TabControl
                      key={tab.value}
                      active={activeTab === tab.value}
                      onClick={() => {
                        dispatch(updateCurrentPage(1));
                        setActiveTab(tab.value);
                        dispatch(resetProducts());
                      }}
                    >
                      {tab.name}
                    </TabControl>
                  ))}
                </TabsControl>
              </HeaderRow>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-10">
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
                    <>
                      <ShopCard
                        key={product.id}
                        selectProduct={() => navigate(`./${product.id}`)}
                        image={product.image}
                        name={product.name}
                        price={product.retail}
                        property={product.size}
                        click={(event) => {
                          event.stopPropagation();
                          if (user) {
                            dispatch(
                              addToCart({
                                productId: product.id,
                                userId: user.user.id,
                              }),
                            );
                          } else {
                            navigate("/login");
                            dispatch(
                              setToast({
                                type: "info",
                                message: "Please login to continue",
                              }),
                            );
                          }
                        }}
                      />
                    </>
                  ))}
              {status !== "loading" && !products.length && (
                <div className={"flex item-center w-full mt-5 justify-center"}>
                  <span>No products found</span>
                </div>
              )}
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
