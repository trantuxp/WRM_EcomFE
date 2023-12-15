import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import products from "../../assets/fake-data/products";
import { useParams } from "react-router-dom";
import Helmet from "../../components/Helmet/Helmet";
import CommonSection from "../../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import * as StoreService from "../../services/StoreService";
import * as PostService from "../../services/PostService";

import { useDispatch, useSelector } from "react-redux";
import { cartActions } from "../../store/shopping-cart/cartSlice";

import "../../styles/product-details.css";

import ProductCard from "../../components/UI/product-card/ProductCard";

const DetailStorePage = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);

  // const relatedProduct = products.filter((item) => category === item.category);

  const fetchGetDetailsStore = async () => {
    if (id) {
      const res = await StoreService.getDetailsStore(id);
      return res.data;
    }
  };

  const { isPending, data: storeDetails } = useQuery({
    queryKey: ["product-details"],
    queryFn: fetchGetDetailsStore,
  });

  const fetchGetPostByStore = async () => {
    if (id) {
      const res = await PostService.getPostByStore(id);
      return res.data;
    }
  };

  const { isPending: isLoading, data: PostByStore } = useQuery({
    queryKey: ["Post-by-store"],
    queryFn: fetchGetPostByStore,
  });
  console.log("PostByStore", PostByStore);
  return (
    <Helmet title="Product-details">
      <CommonSection title={storeDetails?.nameStore} />

      <section>
        <Container>
          <Row>
            <Col lg="4" md="4">
              <div className="product__main-img">
                <img src={storeDetails?.avatarStore} alt="" className="w-100" />
              </div>
            </Col>

            <Col lg="6" md="6">
              <div className="single__product-content">
                <h2 className="product__title mb-3">
                  {storeDetails?.nameStore}
                </h2>
                <p className="product__price">
                  Phone: <span>{user?.phone} </span>
                </p>
                <p className="category mb-5">
                  Address: <span>{storeDetails?.addressStore}</span>
                </p>

                {/* <button onClick={addItem} className="addTOCart__btn">
                  Add to Cart
                </button> */}
              </div>
            </Col>

            <Col lg="12">
              <div className="tabs d-flex align-items-center gap-5 py-3">
                <h6>Posts</h6>
              </div>

              {/* <div className="tab__content">
                <p>{desc}</p>
              </div> */}
            </Col>
            <Col lg="12" className="mb-5 mt-4">
              {PostByStore?.map((item, key) => (
                <Row key={item._id}>
                  <Col lg="4" md="4">
                    <div className="product__main-img">
                      <img src={item?.image} alt="" className="w-50" />
                    </div>
                  </Col>

                  <Col lg="8" md="8">
                    <div className="single__product-content">
                      <h2 className="product__title mb-3">
                        Title: {item?.title}
                      </h2>
                      <p className="category mb-5">
                        Content: <span>{item?.content}</span>
                      </p>
                    </div>
                  </Col>
                </Row>
              ))}
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

export default DetailStorePage;
