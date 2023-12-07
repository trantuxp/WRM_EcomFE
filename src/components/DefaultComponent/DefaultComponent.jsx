import React from "react";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import { useSelector } from "react-redux";
import Carts from "../UI/cart/Carts";
const DefaultComponent = ({ children }) => {
  const showCart = useSelector((state) => state.cartUi.cartIsVisible);

  return (
    <div>
      <Header />
      {showCart && <Carts />}

      {children}
      <Footer />
    </div>
  );
};

export default DefaultComponent;
