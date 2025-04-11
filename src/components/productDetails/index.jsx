import React, { useEffect } from "react";
import "./index.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import { getProduct } from "../../features/shop/shopSlice";
import { convertGramUnits } from "../../utility/unitConverter";
import { addToCart } from "../../features/cart/cartSlice";
import { setToast } from "../../features/toast/toastSlice";
import { CardButton } from "../styleTW";
import { Helmet } from "react-helmet-async";

function ProductDetails() {
  const dispatch = useDispatch();
  const { id } = useParams();
  const product = useSelector((state) => state.shop.product);
  const status = useSelector((state) => state.shop.statusProduct);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProduct(id));
  }, []);

  return (
    <>
      <Helmet>
        <title>
          {product?.name
            ? `${product.name} | Maltiti Enterprise`
            : "Product | Maltiti Enterprise"}
        </title>
        <meta name="description" content={product.description} />
        <link
          rel="canonical"
          href={`https://maltitiaenterprise.com/shop/${product.id}`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            image: product.image,
            category: product.category,
          })}
        </script>
      </Helmet>
      <main className="container">
        <div className="left-column">
          {status === "loading" ? (
            <Skeleton
              variant="rectangular"
              className="mt-32"
              width="100%"
              height={400}
            />
          ) : (
            <img className="active" src={product.image} alt="" />
          )}
        </div>
        <div className="right-column">
          <div className="product-description">
            {status === "loading" ? (
              <>
                <Skeleton variant="text" width="40%" height={15} />
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="100%" height={300} />
              </>
            ) : (
              <>
                <span>{product.category}</span>
                <h1>{product.name}</h1>
                <p>{product.description}</p>
              </>
            )}
          </div>
          <div className="product-configuration">
            <div className="product-color">
              {status === "loading" ? (
                <Skeleton variant="text" width="30%" height={15} />
              ) : (
                <span>Weight</span>
              )}

              <div className="color-choose">
                {status === "loading" ? (
                  <Skeleton variant="text" width="30%" height={15} />
                ) : (
                  <span>
                    {String(product.size).toUpperCase()} (
                    {convertGramUnits(product.weight)})
                  </span>
                )}
              </div>
            </div>
            <div className="cable-config">
              {status === "loading" ? (
                <>
                  <Skeleton variant="text" width="30%" height={15} />
                  <Skeleton variant="text" width="80%" height={40} />
                </>
              ) : (
                <>
                  <span className="mb-2">Ingredients</span>
                  <div className="cable-choose">
                    {product.ingredients?.split(",").map((ingredient) => (
                      <button key={ingredient}>{ingredient}</button>
                    ))}
                  </div>
                  <a href="#">Learn about the order process</a>
                </>
              )}
            </div>
          </div>
          {status === "loading" ? (
            <Skeleton variant="text" width="80%" height={50} />
          ) : (
            <div className="product-price">
              <span>GHC {product.retail}</span>
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
            </div>
          )}
        </div>
      </main>
    </>
  );
}

export default ProductDetails;
