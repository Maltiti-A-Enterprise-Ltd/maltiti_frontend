import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { Link } from "react-router-dom";
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

// eslint-disable-next-line react/display-name,func-names
export default function ({
  // eslint-disable-next-line react/prop-types
  heading = "Checkout the Menu",
  // eslint-disable-next-line react/prop-types
}) {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.shop.bestProducts);
  const status = useSelector((state) => state.shop.statusBestProducts);

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
                      {/* <CardPrice>Retail: GH₵ {card.price_retail}</CardPrice> */}
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

/* This function is only there for demo purposes. It populates placeholder cards */
// const getRandomCards = () => {
//   const cards = [
//     {
//       imageSrc:
//         "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
//       title: "Chicken Chilled",
//       content: "Chicken Main Course",
//       price: "$5.99",
//       rating: "5.0",
//       reviews: "87",
//       url: "#"
//     },
//     {
//       imageSrc:
//         "https://images.unsplash.com/photo-1582254465498-6bc70419b607?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
//       title: "Samsa Beef",
//       content: "Fried Mexican Beef",
//       price: "$3.99",
//       rating: "4.5",
//       reviews: "34",
//       url: "#"
//     },
//     {
//       imageSrc:
//         "https://images.unsplash.com/photo-1565310022184-f23a884f29da?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
//       title: "Carnet Nachos",
//       content: "Chilli Crispy Nachos",
//       price: "$3.99",
//       rating: "3.9",
//       reviews: "26",
//       url: "#"
//     },
//     {
//       imageSrc:
//         "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
//       title: "Guacamole Mex",
//       content: "Mexican Chilli",
//       price: "$3.99",
//       rating: "4.2",
//       reviews: "95",
//       url: "#"
//     },
//     {
//       imageSrc:
//         "https://images.unsplash.com/photo-1550461716-dbf266b2a8a7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
//       title: "Chillie Cake",
//       content: "Deepfried Chicken",
//       price: "$2.99",
//       rating: "5.0",
//       reviews: "61",
//       url: "#"
//     },
//     {
//       imageSrc:
//         "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327??ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
//       title: "Nelli",
//       content: "Hamburger & Fries",
//       price: "$7.99",
//       rating: "4.9",
//       reviews: "89",
//       url: "#"
//     },
//     {
//       imageSrc:
//         "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
//       title: "Jalapeno Poppers",
//       content: "Crispy Soyabeans",
//       price: "$8.99",
//       rating: "4.6",
//       reviews: "12",
//       url: "#"
//     },
//     {
//       imageSrc:
//         "https://images.unsplash.com/photo-1473093226795-af9932fe5856?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=80",
//       title: "Cajun Chicken",
//       content: "Roasted Chicken & Egg",
//       price: "$7.99",
//       rating: "4.2",
//       reviews: "19",
//       url: "#"
//     }
//   ];

// Shuffle array
//   return cards.sort(() => Math.random() - 0.5);
// };
