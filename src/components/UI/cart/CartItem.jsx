import React, { useState } from "react";
import { ListGroupItem } from "reactstrap";

import "../../../styles/cart-item.css";

import { useDispatch } from "react-redux";

import {
  decreaseAmount,
  increaseAmount,
  removeOrderProduct,
} from "../../../store/shopping-cart/orderSlide";
const CartItem = ({ item }) => {
  const { product, name, price, image, amount } = item;
  console.log("product", product);
  const dispatch = useDispatch();
  const idProduct = product;
  const incrementItem = () => {
    dispatch(increaseAmount({ idProduct }));
  };

  const decreaseItem = () => {
    if (amount > 1) dispatch(decreaseAmount({ idProduct }));
    else {
      dispatch(removeOrderProduct({ idProduct }));
    }
  };

  const deleteItem = () => {
    dispatch(removeOrderProduct({ idProduct }));
  };

  return (
    <ListGroupItem className="border-0 cart__item">
      <div className="cart__item-info d-flex gap-2">
        <img src={image} alt="product-img" />

        <div className="cart__product-info w-100 d-flex align-items-center gap-4 justify-content-between">
          <div>
            <h6 className="cart__product-title">{name}</h6>
            <p className=" d-flex align-items-center gap-5 cart__product-price">
              {amount}x <span>{amount * price} VND</span>
            </p>
            <div className=" d-flex align-items-center justify-content-between increase__decrease-btn">
              <span className="decrease__btn" onClick={decreaseItem}>
                <i className="ri-subtract-line"></i>
              </span>
              <span className="quantity">{amount}</span>

              <span className="increase__btn" onClick={incrementItem}>
                <i className="ri-add-line"></i>
              </span>
            </div>
          </div>

          <span className="delete__btn" onClick={deleteItem}>
            <i className="ri-close-line"></i>
          </span>
        </div>
      </div>
    </ListGroupItem>
  );
};

export default CartItem;
