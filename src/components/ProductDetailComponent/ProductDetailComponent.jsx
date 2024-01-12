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
import products from "../../assets/fake-data/products";

import {
  addOrderProduct,
  resetOrder,
} from "../../store/shopping-cart/orderSlide";
import { useNavigate } from "react-router-dom";
import * as CartService from "../../services/CartService";
import * as EvaluateService from "../../services/EvaluateService";
import { useDebounce } from "../../hooks/useDebounce";

import { convertPrice } from "../../utils";
import StarRatingUI from "../StarRatingUI/StarRatingUI";
import ProductCard from "../UI/product-card/ProductCard";
import { all } from "axios";

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
  const [recommendProducts, setRecommendProducts] = useState([]);
  const [evalaute, setEvalaute] = useState([]);
  const [productDetail, setproductDetail] = useState([]);
  const order = useSelector((state) => state.order);
  const [errorLimitOrder, setErrorLimitOrder] = useState(false);
  const [numProduct, setNumProduct] = useState(1);
  const evalauteDebounce = useDebounce(evalaute, 500);

  const product = products.find((product) => product.id === id);
  const { title, price, category, desc, image01 } = product;
  const relatedProduct = products.filter((item) => category === item.category);

  const fetchGetDetailsProduct = async () => {
    if (idProduct.idProduct.id) {
      const res = await ProductService.getDetailsProduct(
        idProduct.idProduct.id
      );
      setproductDetail(res[0]);
    }
  };

  useEffect(() => {
    fetchGetDetailsProduct();
  }, [idProduct.idProduct.id]);

  const fetchGetRecommend = async (id) => {
    const res = await ProductService.getRecommend(id);
    if (res) {
      setRecommendProducts(res);
    }
  };

  useEffect(() => {
    if (idProduct.idProduct.id) {
      fetchGetRecommend(idProduct.idProduct.id);
    }
  }, [idProduct.idProduct.id]);

  const fetchGetEvaluate = async (id) => {
    const res = await EvaluateService.getEvaluateByItem(id);
    console.log("resEva", res);
    if (res) {
      setEvalaute(res);
    }
  };

  useEffect(() => {
    if (idProduct.idProduct.id) {
      fetchGetEvaluate(idProduct.idProduct.id);
    }
  }, [idProduct.idProduct.id]);

  const addItem = () => {
    if (!user?.id) {
      navigate("/login");
    } else {
      const orderRedux = order?.orderItems?.find(
        (item) => item.product === productDetail?._id
      );
      console.log("orderRedux", orderRedux);
      if (
        orderRedux?.amount + numProduct <= orderRedux?.countInstock ||
        (!orderRedux && productDetail?.countInStock > 0)
      ) {
        if (orderRedux) {
          console.log("orderRedux.amount", orderRedux.amount);
          const idItem = productDetail?._id;
          const amount = orderRedux.amount + numProduct;
          const idUser = user?.id;
          CartService.UpdateCart(idItem, amount, idUser);
        } else {
          const idItem = productDetail?._id;
          const amount = numProduct;
          const totalPrice = productDetail?.price * amount;
          const idUser = user?.id;
          CartService.createCart({ idItem, amount, totalPrice, idUser });
        }

        dispatch(
          addOrderProduct({
            orderItem: {
              name: productDetail?.name,
              type: productDetail?.type,
              amount: numProduct,
              image: productDetail?.image,
              price: productDetail?.price,
              product: productDetail?._id,
              discount: productDetail?.discount,
              countInstock: productDetail?.countInStock,
              idStore: productDetail?.idStore,
            },
          })
        );
      } else {
        setErrorLimitOrder(true);
      }
      navigate("/cart");
    }
  };

  const incrementItem = () => {
    if (numProduct < productDetail?.countInStock)
      setNumProduct((prevCount) => prevCount + 1);
  };

  const decreaseItem = () => {
    if (numProduct > 1) {
      setNumProduct((prevCount) => prevCount - 1);
    }
  };

  return (
    <Helmet title="Product-details">
      <CommonSection title={productDetail?.name} />

      <section>
        <Container>
          <Row>
            <Col lg="4" md="4">
              <div className="product__main-img">
                <img src={productDetail?.image} alt="" className="w-100" />
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__title mb-3">{productDetail?.name}</h2>
                <div className="product__price">
                  <span
                    style={{
                      textDecoration: "underline",
                    }}
                  >
                    {productDetail?.rating}
                  </span>
                  <span>
                    <StarRatingUI
                      rating={productDetail?.rating}
                      color={"lightgray"}
                    ></StarRatingUI>
                  </span>
                </div>
                <p className="product__price">
                  Price: <span>{convertPrice(productDetail?.price)} </span>
                </p>
                <p className="category mb-3">
                  Category: <span>{productDetail?.type}</span>
                </p>
                <p className="category-input mb-5">
                  Amount:
                  <div className=" d-flex align-items-center justify-content-between text-center  increase__decrease-btn ">
                    <span className="decrease__btn" onClick={decreaseItem}>
                      <i className="ri-subtract-line "></i>
                    </span>
                    <span className="quantity">{numProduct}</span>{" "}
                    <span className="increase__btn" onClick={incrementItem}>
                      <i className="ri-add-line"></i>
                    </span>
                  </div>
                </p>
                <p className="category ">
                  Remaining: {productDetail?.countInStock}
                </p>
                <p className="category ">
                  Store:{productDetail?.selled} Remaining:{" "}
                  {productDetail?.countInStock}
                </p>
                <p className="category ">
                  Store:{" "}
                  <Link to={`/store/${productDetail?.idStore}`}>
                    {productDetail?.store?.map((item) => item.nameStore)}
                  </Link>
                </p>
                <p className="category ">Open: 8:00 - 23:00</p>
                <button onClick={addItem} className="addTOCart__btn">
                  Add to Cart
                </button>
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
                  <p>{productDetail?.description}</p>
                </div>
              ) : (
                <div className="tab__form mb-3">
                  {evalaute.map((eva) => (
                    <div className="review pt-5">
                      <p className="user__name mb-0">{eva?.User[0]?.name}</p>
                      <p className="user__email">
                        <StarRatingUI
                          rating={eva.star}
                          fontSize="2em"
                        ></StarRatingUI>
                      </p>
                      <p className="feedback__text">{eva.content} </p>
                    </div>
                  ))}
                </div>
              )}
            </Col>
            <Col lg="12" className="mt-4">
              <hr></hr>
            </Col>
            <Col lg="12" className="mb-5 mt-4">
              {recommendProducts.length > 0 && (
                <h2 className="related__Product-title">You might also like</h2>
              )}
            </Col>

            {recommendProducts.map((item) => (
              <Col lg="3" md="4" sm="6" xs="6" className="mb-4" key={item.id}>
                <ProductCard item={item.products[0]} />
                {/* {localStorage.getItem("myid") !== "" ? (
                  ) : (
                    <ProductCard item={item} />
                  )} */}
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default ProductDetailComponent;
