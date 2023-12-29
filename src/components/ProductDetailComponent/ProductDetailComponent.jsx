import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "../../styles/product-details.css";
import * as ProductService from "../../services/ProductService";
import { useQuery } from "@tanstack/react-query";
import * as message from "../Message/Message";
import {
  addOrderProduct,
  resetOrder,
} from "../../store/shopping-cart/orderSlide";
import { useNavigate } from "react-router-dom";
import * as CartService from "../../services/CartService";

import { convertPrice } from "../../utils";

const ProductDetailComponent = (idProduct) => {
  const [tab, setTab] = useState("desc");
  const [enteredName, setEnteredName] = useState("");
  const [enteredEmail, setEnteredEmail] = useState("");
  const [reviewMsg, setReviewMsg] = useState("");
  const [Commented, setCommented] = useState(false);
  const navigate = useNavigate();

  console.log("idProduct", idProduct.idProduct.id);
  const id = "02";
  const user = useSelector((state) => state?.user);
  const dispatch = useDispatch();

  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const [numProduct, setNumProduct] = useState(1);

  const fetchGetDetailsProduct = async () => {
    if (idProduct.idProduct.id) {
      const res = await ProductService.getDetailsProduct(
        idProduct.idProduct.id
      );
      console.log("res.data", res.data);
      return res.data;
    }
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details"],
    queryFn: fetchGetDetailsProduct,
  });

  const addItem = () => {
    if (!user?.id) {
      navigate("/login");
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetails?._id
      );
      console.log("orderRedux", orderRedux);
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && productDetails?.countInStock > 0)
      ) {
        if (orderRedux) {
          console.log("orderRedux.amount", orderRedux.amount);
          const idItem = productDetails?._id;
          const amount = orderRedux.amount + numProduct;
          const idUser = user?.id;
          CartService.UpdateCart(idItem, amount, idUser);
        } else {
          const idItem = productDetails?._id;
          const amount = numProduct;
          const totalPrice = productDetails?.price * amount;
          const idUser = user?.id;
          CartService.createCart({ idItem, amount, totalPrice, idUser });
        }

        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetails?.name,
              amount: numProduct,
              image: productDetails?.image,
              price: productDetails?.price,
              product: productDetails?._id,
              discount: productDetails?.discount,
              countInstock: productDetails?.countInStock,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();

    console.log(enteredName, enteredEmail, reviewMsg);
    setCommented(true);
    setEnteredEmail("");
    setEnteredName("");
    setReviewMsg("");
  };

  const incrementItem = () => {
    if (numProduct <= productDetails?.countInStock)
      setNumProduct((prevCount) => prevCount + 1);
  };

  const decreaseItem = () => {
    if (numProduct > 1) {
      setNumProduct((prevCount) => prevCount - 1);
    }
  };

  return (
    <Helmet title="Product-details">
      <CommonSection title={productDetails?.name} />

      <section>
        <Container>
          <Row>
            {/* <Col lg="2" md="2">
              <div className="product__images ">
                <div
                  className="img__item mb-3"
                  onClick={() => setPreviewImg(product.image01)}
                >
                  <img src={product.image01} alt="" className="w-50" />
                </div>
                <div
                  className="img__item mb-3"
                  onClick={() => setPreviewImg(product.image02)}
                >
                  <img src={product.image02} alt="" className="w-50" />
                </div>

                <div
                  className="img__item"
                  onClick={() => setPreviewImg(product.image03)}
                >
                  <img src={product.image03} alt="" className="w-50" />
                </div>
              </div>
            </Col> */}

            <Col lg="4" md="4">
              <div className="product__main-img">
                <img src={productDetails?.image} alt="" className="w-100" />
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__title mb-3">{productDetails?.name}</h2>
                <p className="product__price">
                  Price: <span>{convertPrice(productDetails?.price)} </span>
                </p>
                <p className="category mb-3">
                  Category: <span>{productDetails?.type}</span>
                </p>
                <p className="category-input mb-5">
                  Amount:
                  <div className=" d-flex align-items-center justify-content-between text-center  increase__decrease-btn ">
                    <span className="increase__btn" onClick={incrementItem}>
                      <i className="ri-add-line"></i>
                    </span>
                    <span className="quantity">{numProduct}</span>
                    <span className="decrease__btn" onClick={decreaseItem}>
                      <i className="ri-subtract-line "></i>
                    </span>
                  </div>
                </p>

                <button onClick={addItem} className="addTOCart__btn">
                  Add to Cart
                </button>
                <p className="category mb-5 mt-3">
                  Store:{" "}
                  <Link to={`/store/${user?.id}`}>
                    {!user?.name || "Shop Food"}
                  </Link>
                </p>
              </div>
            </Col>

            <Col lg="12">
              <div className="tabs d-flex align-items-center gap-5 py-3">
                <h6
                  className={` ${tab === "desc" ? "tab__active" : ""} `}
                  onClick={() => setTab("desc")}
                >
                  Description
                </h6>
                <h6
                  className={` ${tab === "rev" ? "tab__active" : ""}`}
                  onClick={() => setTab("rev")}
                >
                  Review
                </h6>
              </div>

              {tab === "desc" ? (
                <div className="tab__content">
                  <p>{productDetails?.description}</p>
                </div>
              ) : (
                <div className="tab__form mb-3">
                  <div className="review pt-5">
                    <p className="user__name mb-0">Jhon Doe</p>
                    <p className="user__email">jhon1@gmail.com</p>
                    <p className="feedback__text">great product</p>
                  </div>

                  <div className="review">
                    <p className="user__name mb-0">Jhon Doe</p>
                    <p className="user__email">jhon1@gmail.com</p>
                    <p className="feedback__text">great product</p>
                  </div>

                  <div className="review">
                    <p className="user__name mb-0">Jhon Doe</p>
                    <p className="user__email">jhon1@gmail.com</p>
                    <p className="feedback__text">great product</p>
                  </div>
                  {Commented && (
                    <div className="review">
                      <p className="user__name mb-0">tu</p>
                      <p className="user__email">tu@gmail.com</p>
                      <p className="feedback__text">good</p>
                    </div>
                  )}
                  <form className="form" onSubmit={submitHandler}>
                    <div className="form__group">
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={enteredName}
                        onChange={(e) => setEnteredName(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form__group">
                      <input
                        type="text"
                        placeholder="Enter your email"
                        value={enteredEmail}
                        onChange={(e) => setEnteredEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form__group">
                      <textarea
                        rows={5}
                        type="text"
                        value={reviewMsg}
                        placeholder="Write your review"
                        onChange={(e) => setReviewMsg(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="addTOCart__btn">
                      Submit
                    </button>
                  </form>
                </div>
              )}
            </Col>

            <Col lg="12" className="mb-5 mt-4">
              {/* <h2 className="related__Product-title">You might also like</h2> */}
            </Col>

            {/* {relatedProduct.map((item) => (
              <Col lg="3" md="4" sm="6" xs="6" className="mb-4" key={item.id}>
                <ProductCard item={item} />
              </Col>
            ))} */}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetailComponent;
