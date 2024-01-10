import React, { useState, useEffect } from "react";

import Helmet from "../components/Helmet/Helmet.js";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";

import heroImg from "../assets/images/hero.png";
import "../styles/hero-section.css";

import { Link } from "react-router-dom";

import Category from "../components/UI/category/Category.jsx";

import "../styles/home.css";

import featureImg01 from "../assets/images/service-01.png";
import featureImg02 from "../assets/images/service-02.png";
import featureImg03 from "../assets/images/service-03.png";

import foodCategoryImg01 from "../assets/images/hamburger.png";
import foodCategoryImg02 from "../assets/images/drink.png";
import foodCategoryImg03 from "../assets/images/bread.png";
import foodCategoryImg04 from "../assets/images/cake.png";

import ProductCard from "../components/UI/product-card/ProductCard.jsx";

import whyImg from "../assets/images/location.png";

import networkImg from "../assets/images/network.png";

import { useDebounce } from "../hooks/useDebounce";
import * as ProductService from "../services/ProductService";
import { useDispatch, useSelector } from "react-redux";

import { useQuery } from "@tanstack/react-query";
import * as CartService from "../services/CartService";

import {
  resetAllOrder,
  addOrderProduct,
} from "../store/shopping-cart/orderSlide";
import ChatbotButton from "../components/Chatbot/ChatbotButton.jsx";

// import TestimonialSlider from "../components/UI/slider/TestimonialSlider.jsx";
const featureData = [
  {
    title: "Quick Delivery",
    imgUrl: featureImg01,
    desc: "",
  },

  {
    title: "Super Dine In",
    imgUrl: featureImg02,
    desc: "",
  },
  {
    title: "Easy Pick Up",
    imgUrl: featureImg03,
    desc: "",
  },
];
const Home = () => {
  const dispatch = useDispatch();

  const [category, setCategory] = useState("ALL");
  const [allProducts, setAllProducts] = useState([]);
  const [allProductsOrigin, setAllProductsOrigin] = useState([]);

  const [hotPizza, setHotPizza] = useState([]);
  const user = useSelector((state) => state.user);

  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const [limit, setLimit] = useState();
  const [carts1, setCarts1] = useState([]);

  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct(searchDebounce, limit);
    if (res?.status === "OK") {
      setAllProducts(res?.data);
      setAllProductsOrigin(res?.data);
    }
  };

  useEffect(() => {
    fetchProductAll();
  }, [searchDebounce]);

  useEffect(() => {
    // const filteredPizza = products.filter((item) => item.category === "Pizza");
    const filteredPizza1 = allProductsOrigin.filter(
      (item) => item.type === "Đồ ăn"
    );

    const slicePizza = filteredPizza1.slice(0, 4);
    setHotPizza(slicePizza);
  }, [allProducts]);

  useEffect(() => {
    if (category === "ALL") {
      setAllProducts(allProductsOrigin);
    }

    if (category === "Đồ ăn") {
      const filteredProducts = allProductsOrigin.filter(
        (item) => item.type === "Đồ ăn"
      );

      setAllProducts(filteredProducts);
    }

    if (category === "Đồ uống") {
      const filteredProducts = allProductsOrigin.filter(
        (item) => item.type === "Đồ uống"
      );

      setAllProducts(filteredProducts);
    }

    if (category === "Đồ chay") {
      const filteredProducts = allProductsOrigin.filter(
        (item) => item.type === "Đồ chay"
      );

      setAllProducts(filteredProducts);
    }
    if (category === "Bánh kem") {
      const filteredProducts = allProductsOrigin.filter(
        (item) => item.type === "Bánh kem"
      );

      setAllProducts(filteredProducts);
    }
  }, [category]);

  return (
    <Helmet title="Home">
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6">
              <div className="hero__content  ">
                <h1 className="mb-4 hero__title">
                  <span>HUNGRY?</span> Savor <br /> Our Culinary Surprises!"
                </h1>

                <p></p>

                <div className="hero__btns d-flex align-items-center gap-5 mt-4">
                  <button className="order__btn d-flex align-items-center justify-content-between">
                    Order now <i className="ri-arrow-right-s-line"></i>
                  </button>

                  <button className="all__foods-btn">
                    <Link to="/foods">See all foods</Link>
                  </button>
                </div>

                <div className=" hero__service  d-flex align-items-center gap-5 mt-5 ">
                  <p className=" d-flex align-items-center gap-2 ">
                    <span className="shipping__icon">
                      <i className="ri-car-line"></i>
                    </span>{" "}
                    Can free shipping charge
                  </p>

                  <p className=" d-flex align-items-center gap-2 ">
                    <span className="shipping__icon">
                      <i className="ri-shield-check-line"></i>
                    </span>{" "}
                    100% secure checkout
                  </p>
                </div>
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="hero__img">
                <img src={heroImg} alt="hero-img" className="w-100" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-0">
        <Category />
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2 className="feature__title">Just sit back at home</h2>
              <h2 className="feature__title">
                we will <span>take care</span>
              </h2>
              <p className="mb-1 mt-4 feature__text"></p>
              <p className="feature__text"></p>
            </Col>

            {featureData.map((item, index) => (
              <Col lg="4" md="6" sm="6" key={index} className="mt-5">
                <div className="feature__item text-center px-5 py-3">
                  <img
                    src={item.imgUrl}
                    alt="feature-img"
                    className="w-25 mb-3"
                  />
                  <h5 className=" fw-bold mb-3">{item.title}</h5>
                  <p>{item.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section>
        <Container>
          <Row>
            <Col lg="12" className="text-center">
              <h2>Popular Foods</h2>
            </Col>

            <Col lg="12">
              <div className="food__category d-flex align-items-center justify-content-center gap-4">
                <button
                  className={`all__btn  ${
                    category === "ALL" ? "foodBtnActive" : ""
                  } `}
                  onClick={() => setCategory("ALL")}
                >
                  All
                </button>
                <button
                  className={`d-flex align-items-center gap-2 ${
                    category === "Đồ ăn" ? "foodBtnActive" : ""
                  } `}
                  onClick={() => setCategory("Đồ ăn")}
                >
                  <img src={foodCategoryImg01} alt="" />
                  Food
                </button>

                <button
                  className={`d-flex align-items-center gap-2 ${
                    category === "Đồ uống" ? "foodBtnActive" : ""
                  } `}
                  onClick={() => setCategory("Đồ uống")}
                >
                  <img src={foodCategoryImg02} alt="" />
                  Drink
                </button>

                <button
                  className={`d-flex align-items-center gap-2 ${
                    category === "Đồ chay" ? "foodBtnActive" : ""
                  } `}
                  onClick={() => setCategory("Đồ chay")}
                >
                  <img src={foodCategoryImg03} alt="" />
                  Vegetarian food
                </button>
                <button
                  className={`d-flex align-items-center gap-2 ${
                    category === "Bánh kem" ? "foodBtnActive" : ""
                  } `}
                  onClick={() => setCategory("Bánh kem")}
                >
                  <img src={foodCategoryImg04} alt="" />
                  Cake
                </button>
              </div>
            </Col>

            {allProducts.map((item) => (
              <Col lg="3" md="4" sm="6" xs="6" key={item._id} className="mt-5">
                <ProductCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="why__choose-us">
        <Container>
          <Row>
            <Col lg="6" md="6">
              <img src={whyImg} alt="why-tasty-treat" className="w-100" />
            </Col>

            <Col lg="6" md="6">
              <div className="why__tasty-treat">
                <h2 className="tasty__treat-title mb-4">
                  Why <span>Tasty Treat?</span>
                </h2>
                <p className="tasty__treat-desc"></p>

                <ListGroup className="mt-4">
                  <ListGroupItem className="border-0 ps-0">
                    <p className=" choose__us-title d-flex align-items-center gap-2 ">
                      <i className="ri-checkbox-circle-line"></i> Fresh and
                      tasty foods
                    </p>
                    <p className="choose__us-desc"></p>
                  </ListGroupItem>

                  <ListGroupItem className="border-0 ps-0">
                    <p className="choose__us-title d-flex align-items-center gap-2 ">
                      <i className="ri-checkbox-circle-line"></i> Quality
                      support
                    </p>
                    <p className="choose__us-desc"></p>
                  </ListGroupItem>

                  <ListGroupItem className="border-0 ps-0">
                    <p className="choose__us-title d-flex align-items-center gap-2 ">
                      <i className="ri-checkbox-circle-line"></i>Order from any
                      location{" "}
                    </p>
                    <p className="choose__us-desc"></p>
                  </ListGroupItem>
                </ListGroup>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-0">
        <Container>
          <Row>
            <Col lg="12" className="text-center mb-5 ">
              <h2>Hot Search</h2>
            </Col>

            {hotPizza.map((item) => (
              <Col lg="3" md="4" sm="6" xs="6" key={item._id}>
                <ProductCard item={item} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Home;
