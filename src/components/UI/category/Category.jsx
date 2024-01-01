import React from "react";

import { Container, Row, Col } from "reactstrap";

import foodCategoryImg01 from "../../../assets/images/hamburger.png";
import foodCategoryImg02 from "../../../assets/images/drink.png";
import foodCategoryImg03 from "../../../assets/images/bread.png";
import foodCategoryImg04 from "../../../assets/images/cake.png";

import "../../../styles/category.css";

const categoryData = [
  {
    display: "Food",
    imgUrl: foodCategoryImg01,
  },
  {
    display: "Drink",
    imgUrl: foodCategoryImg02,
  },

  {
    display: "Vegatarian food",
    imgUrl: foodCategoryImg03,
  },

  {
    display: "Cake",
    imgUrl: foodCategoryImg04,
  },
];

const Category = () => {
  return (
    <Container>
      <Row>
        {categoryData.map((item, index) => (
          <Col lg="3" md="4" sm="6" xs="6" className="mb-4" key={index}>
            <div className="category__item d-flex align-items-center gap-3">
              <div className="category__img">
                <img
                  src={item.imgUrl}
                  alt="category__item"
                  style={{ width: "64px" }}
                />
              </div>
              <h6>{item.display}</h6>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Category;
