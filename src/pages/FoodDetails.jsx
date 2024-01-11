import React from "react";
// import ProductDetailsComponent from "../components/ProductDetailsComponent/ProductDetailsComponent";
import { useNavigate, useParams } from "react-router-dom";
import ProductDetailComponent from "../components/ProductDetailComponent/ProductDetailComponent";

const FoodDetails = () => {
  const id = useParams();
  return (
    <>
      <div style={{ marginTop: "100px" }}>
        <ProductDetailComponent idProduct={id} />;
      </div>
      ;
    </>
  );
};

export default FoodDetails;
