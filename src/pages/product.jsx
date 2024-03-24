import React from "react";
import { NavBar } from "../components/header";
import Footer from "../components/footers/MiniCenteredFooter";
import AnimationRevealPage from "../helpers/AnimationRevealPage";
import ProductDetails from "../components/productDetails";

function Product() {
  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <NavBar />
      <AnimationRevealPage>
        <ProductDetails />
        <Footer />
      </AnimationRevealPage>
    </div>
  );
}

export default Product;
