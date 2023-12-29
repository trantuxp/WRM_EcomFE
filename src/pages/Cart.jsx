import React, { useEffect } from "react";

import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import "../styles/cart-page.css";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import {
  decreaseAmount,
  increaseAmount,
  removeOrderProduct,
  resetAllOrder,
  addOrderProduct,
} from "../store/shopping-cart/orderSlide";

import * as CartService from "../services/CartService";
import { useMutationHooks } from "../hooks/useMutationHook";

import { useState } from "react";

const Cart = () => {
  const cartProducts1 = useSelector((state) => state.order);
  const [carts1, setCarts1] = useState([]);
  const dispatch = useDispatch();

  const priceMemo = useMemo(() => {
    const result = cartProducts1?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [cartProducts1]);

  return (
    <Helmet title="Cart">
      <CommonSection title="Your Cart" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              {cartProducts1?.orderItems?.length === 0 ? (
                <h5 className="text-center">Your cart is empty</h5>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Action</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts1?.orderItems?.map((item) => (
                      <Tr item={item} key={item.id} />
                    ))}
                  </tbody>
                </table>
              )}

              <div className="mt-4">
                <h6>
                  Subtotal:
                  <span className="cart__subtotal"> {priceMemo || 0} VND</span>
                </h6>
                <p>Taxes and shipping will calculate at checkout</p>
                <div className="cart__page-btn">
                  <button className="addTOCart__btn me-4">
                    <Link to="/foods">Continue Shopping</Link>
                  </button>
                  <button className="addTOCart__btn">
                    <Link to="/checkout">Proceed to checkout</Link>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

const Tr = (props) => {
  const { product: idProduct, image, name, price, amount } = props.item;
  const idUser = localStorage.getItem("myid");

  const dispatch = useDispatch();

  const deleteItem = () => {
    dispatch(removeOrderProduct({ idProduct }));
    CartService.deleteCart(idProduct, idUser);
  };
  const incrementItem = () => {
    dispatch(increaseAmount({ idProduct }));
    const newAmount = amount + 1;
    CartService.UpdateCart(idProduct, newAmount, idUser);
    // mutation.mutate({
    //   id: idProduct,
    //   amount: newAmount,
    // });
  };

  const decreaseItem = () => {
    if (amount > 1) {
      dispatch(decreaseAmount({ idProduct }));
      const newAmount = amount - 1;
      CartService.UpdateCart(idProduct, newAmount, idUser);
    } else {
      // dispatch(removeOrderProduct({ idProduct }));
    }
  };
  return (
    <tr>
      <td className="text-center cart__img-box">
        <img src={image} alt="" />
      </td>
      <td className="text-center">{name}</td>
      <td className="text-center">{price} VND</td>
      <td className="text-center">{amount}px</td>
      <td className="text-center cart__item-del">
        <div className=" d-flex align-items-center justify-content-between text-center  increase__decrease-btn">
          <span className="increase__btn" onClick={incrementItem}>
            <i className="ri-add-line"></i>
          </span>
          <span className="quantity">{amount}</span>
          <span className="decrease__btn" onClick={decreaseItem}>
            <i className="ri-subtract-line "></i>
          </span>
        </div>
      </td>
      <td className="text-center cart__item-del">
        <i className="ri-delete-bin-line" onClick={deleteItem}></i>
      </td>
    </tr>
  );
};

export default Cart;
