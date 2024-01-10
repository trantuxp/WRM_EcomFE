import React from "react";

import "../../../styles/product-card.css";

import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { convertPrice } from "../../../utils";
import { useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../../store/shopping-cart/orderSlide";
import { useState } from "react";
import * as CartService from "../../../services/CartService";
import StarRatingUI from "../../StarRatingUI/StarRatingUI";

const ProductCardV2 = (props) => {
  const { _id, name, image, price, countInStock, discount, idStore, rating } =
    props.item;

  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user);
  const order = useSelector((state) => state.order);
  const navigate = useNavigate();
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const [numProduct, setNumProduct] = useState(1);

  const addToCart = () => {
    if (!user?.id) {
      navigate("/login");
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === _id
      );
      console.log("orderRedux", orderRedux);
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && countInStock > 0)
      ) {
        if (orderRedux) {
          console.log("orderRedux.amount", orderRedux.amount);
          const idItem = _id;
          const amount = orderRedux.amount + numProduct;
          const idUser = user?.id;
          CartService.UpdateCart(idItem, amount, idUser);
        } else {
          const idItem = _id;
          const amount = numProduct;
          const totalPrice = price * amount;
          const idUser = user?.id;
          CartService.createCart({ idItem, amount, totalPrice, idUser });
        }
        dispatch(
          addOrderProduct({
            orderItem: {
              name: name,
              amount: numProduct,
              image: image,
              price: price,
              product: _id,
              discount: discount,
              countInstock: countInStock,
              idStore: idStore,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  return (
    <>
      {props?.item.map((i) => (
        <div className="product__item">
          <div className="product__img">
            <img src={i.image} alt="product-img" className="w-50" />
          </div>

          <div className="product__content">
            <Link to={`/foods/${i._id}`}>
              <h5>{i.name} </h5>
            </Link>
            <div
              style={{
                display: "flex",
                flex: 1,
                textDecoration: "underline",
                justifyContent: "center",
              }}
            >
              <StarRatingUI
                rating={i.rating}
                color={"lightgray"}
              ></StarRatingUI>
            </div>

            <div className=" d-flex align-items-center justify-content-between ">
              <span className="product__price">{convertPrice(i.price)} </span>
              <button className="addTOCart__btn" onClick={addToCart}>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default ProductCardV2;
