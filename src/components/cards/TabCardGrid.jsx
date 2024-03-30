import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Container, ContentWithPaddingXl } from "../misc/Layouts";
import { Header } from "../misc/Headings";
import { ReactComponent as StarIcon } from "../../images/star-icon.svg";
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
  DecoratorBlob1,
  DecoratorBlob2,
  HeaderRow,
} from "../styleTW";
import { getBestProducts } from "../../features/shop/shopSlice";
import { convertGramUnits } from "../../utility/unitConverter";
import { addToCart } from "../../features/cart/cartSlice";
import "./index.css";
import { setToast } from "../../features/toast/toastSlice";
import { SERVER_ERROR } from "../../utility/constants";

// eslint-disable-next-line react/display-name,func-names
export default function ({
  // eslint-disable-next-line react/prop-types
  heading = "Checkout the Menu",
  // eslint-disable-next-line react/prop-types
}) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.shop.bestProducts);
  const status = useSelector((state) => state.shop.statusBestProducts);
  const user = useSelector((state) => state.user.user);
  const adding = useSelector((state) => state.cart.adding);
  const id = useSelector((state) => state.cart.id);
  const ref = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getBestProducts());
  }, []);

  return (
    <Container id="shop">
      <ContentWithPaddingXl>
        <HeaderRow>
          <Header>{heading}</Header>
          {/* <TabsControl> */}
          {/*  {Object.keys(tabs).map((tabName) => ( */}
          {/*    <TabControl */}
          {/*      key={tabName} */}
          {/*      active={activeTab === tabName} */}
          {/*      onClick={() => setActiveTab(tabName)}> */}
          {/*      {tabName} */}
          {/*    </TabControl> */}
          {/*  ))} */}
          {/* </TabsControl> */}
        </HeaderRow>
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
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                  >
                    <CardImageContainer imageSrc={product.image}>
                      <img
                        ref={ref}
                        className={`${adding === "loading" && id === product.id && "send-to-cart"} h-56 xl:h-64 bg-center bg-contain relative w-full rounded-t`}
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
                        <CardButton
                          type={"button"}
                          onClick={() => {
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
                        >
                          Add to Cart
                        </CardButton>
                        <br />
                        <CardButton type="button">
                          <Link to={`shop/${product.id}`}>View Details</Link>
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
                    </CardText>
                  </Card>
                </CardContainer>
              ))}
        </div>
      </ContentWithPaddingXl>
      <DecoratorBlob1 />
      <DecoratorBlob2 />
    </Container>
  );
}
