import React from "react";
import { NavBar } from "../components/header";
import Footer from "../components/footers/MiniCenteredFooter";
import AnimationRevealPage from "../helpers/AnimationRevealPage";
import ProductDetails from "../components/productDetails";
import Orders from "../components/settingsComponents/Orders";

function MyOrders() {
  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <NavBar />
      <AnimationRevealPage>
        <Orders />
        <Footer />
      </AnimationRevealPage>
    </div>
  );
}

export default MyOrders;
