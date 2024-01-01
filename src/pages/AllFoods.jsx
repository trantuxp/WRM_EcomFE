import React, { useState, useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";

import { Container, Row, Col } from "reactstrap";

import products from "../assets/fake-data/products";
import ProductCard from "../components/UI/product-card/ProductCard";
import ReactPaginate from "react-paginate";

import { useDebounce } from "../hooks/useDebounce";
import * as ProductService from "../services/ProductService";
import { useSelector, useDispatch } from "react-redux";
import { searchProduct } from "../store/shopping-cart/productSlide";

import "../styles/all-foods.css";
import "../styles/pagination.css";

const AllFoods = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [pageNumber, setPageNumber] = useState(0);

  const [allProducts, setAllProducts] = useState([]);
  const [allProductsOrigin, setAllProductsOrigin] = useState([]);
  const searchPro = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchPro, 0);
  const [limit, setLimit] = useState();
  const dispatch = useDispatch();

  const fetchProductAll = async () => {
    const res = await ProductService.getAllProduct(searchDebounce, limit);
    if (res?.status === "OK") {
      setAllProducts(res?.data);
      setAllProductsOrigin(res?.data);
    }
  };

  useEffect(() => {
    fetchProductAll();
  }, []);

  const onSearch = (e) => {
    setSearchTerm(e.target.value);
    dispatch(searchProduct(e.target.value));
    fetchProductAll();
    // console.log("search", e.target.value);
  };
  return (
    <Helmet title="All-Foods">
      <CommonSection title="All Foods" />

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6" xs="12">
              <div className="search__widget d-flex align-items-center justify-content-between ">
                <input
                  type="text"
                  placeholder="I'm looking for...."
                  onChange={onSearch}
                />
                <span>
                  <i className="ri-search-line"></i>
                </span>
              </div>
            </Col>
            <Col lg="6" md="6" sm="6" xs="12" className="mb-5">
              <div className="sorting__widget text-end">
                <select className="w-50">
                  <option>Default</option>
                  <option value="ascending">Alphabetically, A-Z</option>
                  <option value="descending">Alphabetically, Z-A</option>
                  <option value="high-price">High Price</option>
                  <option value="low-price">Low Price</option>
                </select>
              </div>
            </Col>

            {allProductsOrigin.map((item) => (
              <Col lg="3" md="4" sm="6" xs="6" key={item.id} className="mb-4">
                <ProductCard item={item} />
              </Col>
            ))}

            {/* <div>
              <ReactPaginate
                pageCount={pageCount}
                onPageChange={changePage}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                containerClassName=" paginationBttns "
              />
            </div> */}
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default AllFoods;
