// pages/products.js
import React from "react";
import { Container } from "../components/misc/Layouts";
import { NavBar } from "../components/header";
import ProductsPage from "../components/productsPage";
import Footer from "../components/footers/MiniCenteredFooter.js";

export const ProductPage = () => {
  return (
    <Container>
      <NavBar />
      <ProductsPage />
      <Footer />
    </Container>
  );
};
