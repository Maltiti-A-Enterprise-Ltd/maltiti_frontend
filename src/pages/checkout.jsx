import React from "react";
import { NavBar } from "../components/header";
import Footer from "../components/footers/MiniCenteredFooter";
import AnimationRevealPage from "../helpers/AnimationRevealPage";
import CheckoutComponent from "../components/checkout";

function Checkout() {
  return (
    <div className="overflow-x-hidden overflow-y-hidden">
      <NavBar />
      <AnimationRevealPage>
        <CheckoutComponent />
        <Footer />
      </AnimationRevealPage>
    </div>
  );
}

export default Checkout;
