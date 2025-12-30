"use client";

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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NavBar } from "../../src/components/header";
import AnimationRevealPage from "../../src/helpers/AnimationRevealPage";
import Footer from "../../src/components/footers/MiniCenteredFooter";
import {
  Card,
  CardContainer,
  CardImageContainer,
  CardText,
  HighlightedText,
  HeaderRow,
  TabControl,
  TabsControl,
} from "../../src/components/styleTW";
import { Header } from "../../src/components/misc/Headings";
import { ContentWithPaddingXl } from "../../src/components/misc/Layouts";
import {
  getProducts,
  resetProducts,
  toggleShowError,
  updateCurrentPage,
} from "../../src/features/shop/shopSlice";
import { addToCart } from "../../src/features/cart/cartSlice";
import { setToast } from "../../src/features/toast/toastSlice";
import ShopCard from "../../src/components/ShopCard";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";

export default function ShopPage() {
  const tabs = [
    { name: "All", value: "" },
    { name: "Shea butter", value: "shea butter" },
    { name: "Soap", value: "soap" },
    { name: "Essential Oils", value: "essential oil" },
    { name: "Others", value: "others" },
  ];
  const [activeTab, setActiveTab] = useState(tabs[0].value);
  const [search, setSearch] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const products = useSelector((state: any) => state.shop.products);
  const status = useSelector((state: any) => state.shop.status);
  const showError = useSelector((state: any) => state.shop.showError);
  const errorMessage = useSelector((state: any) => state.shop.errorMessage);
  const totalPages = useSelector((state: any) => state.shop.totalPages);
  const currentPage = useSelector((state: any) => state.shop.currentPage);
  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getProducts({
        category: activeTab,
        page: currentPage,
        searchTerm: search,
      }) as any,
    );
  }, [currentPage, activeTab]);

  const handleScroll = () => {
    if (typeof window === "undefined") return;
    const { scrollY } = window;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    if (scrollY + windowHeight >= documentHeight - 250) {
      if (currentPage < totalPages && status !== "loading") {
        dispatch(updateCurrentPage(currentPage + 1) as any);
      }
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
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
        onClose={() => dispatch(toggleShowError("") as any)}
      >
        <Alert
          onClose={() => dispatch(toggleShowError("") as any)}
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
          <Link style={{ display: "flex", alignItems: "center" }} href="/">
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
                        dispatch(resetProducts() as any);
                        dispatch(updateCurrentPage(1) as any);
                        dispatch(
                          getProducts({
                            category: activeTab,
                            page: currentPage,
                            searchTerm: search,
                          }) as any,
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
                        dispatch(updateCurrentPage(1) as any);
                        setActiveTab(tab.value);
                        dispatch(resetProducts() as any);
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
                ? Array.from({ length: 8 }).map((item, index) => (
                    <CardContainer key={index}>
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
                : products.map((product: any) => (
                    <ShopCard
                      key={product.id}
                      selectProduct={() => router.push(`/shop/${product.id}`)}
                      image={product.image}
                      name={product.name}
                      price={product.retail}
                      property={product.size}
                      click={(event: any) => {
                        event.stopPropagation();
                        if (user) {
                          dispatch(
                            addToCart({
                              productId: product.id,
                              userId: user.user.id,
                            }) as any,
                          );
                        } else {
                          router.push("/login");
                          dispatch(
                            setToast({
                              type: "info",
                              message: "Please login to continue",
                            }) as any,
                          );
                        }
                      }}
                    />
                  ))}
              {status !== "loading" && !products.length && (
                <div className={"flex item-center w-full mt-5 justify-center"}>
                  <span>No products found</span>
                </div>
              )}
            </div>
          </ContentWithPaddingXl>
        </Container>
        <Footer />
      </AnimationRevealPage>
    </div>
  );
}
