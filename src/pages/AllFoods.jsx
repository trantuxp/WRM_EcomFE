import React, { useState, useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";

import { Container, Row, Col } from "reactstrap";

import products from "../assets/fake-data/products";
import ProductCard from "../components/UI/product-card/ProductCard";
import ReactPaginate from "react-paginate";
import { Pagination } from "antd";
import { useDebounce } from "../hooks/useDebounce";
import * as ProductService from "../services/ProductService";
import * as SearchService from "../services/SearchService";
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
  const searchDebounce = useDebounce(searchTerm, 500);
  // const [limit, setLimit] = useState();
  const user = useSelector((state) => state?.user);

  const dispatch = useDispatch();
  const [selectedValue, setSelectedValue] = useState("");
  const [selectedValueType, setSelectedValueType] = useState("");

  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
    console.log("select", selectedValue);
  };

  const handleChangeType = (event) => {
    setSelectedValueType(event.target.value);
    console.log("selectType", selectedValueType);
  };

  const fetchProductAll = async (type, sort, searchTerm, page, limit) => {
    const res = await ProductService.getAllProduct(
      type,
      sort,
      searchTerm,
      page,
      limit
    );

    if (res?.status === "OK") {
      setAllProducts(res?.data);
      setAllProductsOrigin(res?.data);
      console.log("res?.totalPage", res?.totalPage);
      setPanigate({ ...panigate, total: res?.total });
    }
  };

  useEffect(() => {
    // if (selectedValue !== "Type") {
    fetchProductAll(
      selectedValueType,
      selectedValue,
      searchDebounce,
      panigate.page,
      panigate.limit
    );
    // } else {
    //   fetchProductType(selectedValue, panigate.page, panigate.limit);
    // }
  }, [
    searchDebounce,
    panigate.page,
    panigate.limit,
    selectedValue,
    selectedValueType,
  ]);

  const onSearch = () => {
    console.log("searchTerm", searchTerm);
    dispatch(searchProduct(searchTerm));
    const id = user?.id;
    const content = searchTerm;
    SearchService.createSearch({ id, content });
    // fetchProductAll();
    // console.log("search", e.target.value);
  };
  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize });
    console.log("...panigate, page: current - 1, limit: pageSize", {
      ...panigate,
      page: current - 1,
      limit: pageSize,
    });
  };
  return (
    <div style={{ marginTop: "100px" }}>
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      console.log("setsearchTerm", searchTerm);
                    }}
                    value={searchTerm}
                    name="search"
                    style={{ width: "100%" }}
                  />
                  <span onClick={onSearch}>
                    <i className="ri-search-line"></i>
                  </span>
                </div>
              </Col>
              <Col lg="3" md="6" sm="6" xs="6" className="mb-5">
                <div className="sorting__widget text-end">
                  <select
                    className="w-50"
                    value={selectedValueType}
                    onChange={handleChangeType}
                  >
                    <option value="">Default</option>
                    <option value="Đồ ăn">Đồ ăn</option>
                    <option value="Đồ uống">Đồ uống</option>
                    <option value="Đồ chay">Đồ chay</option>
                    <option value="Bánh kem">Bánh kem</option>
                  </select>
                </div>
              </Col>
              <Col lg="3" md="6" sm="6" xs="6" className="mb-5">
                <div className="sorting__widget text-end">
                  <select
                    className="w-50"
                    value={selectedValue}
                    onChange={handleChange}
                  >
                    <option value="">Default</option>
                    <option value="1">Ascending Price </option>
                    <option value="-1">Descending Price</option>
                  </select>
                </div>
              </Col>

              {allProductsOrigin.map((item) => (
                <Col
                  lg="3"
                  md="4"
                  sm="6"
                  xs="6"
                  key={item._id}
                  className="mb-4"
                >
                  <ProductCard item={item} />
                </Col>
              ))}
              <Pagination
                defaultCurrent={panigate.page + 1}
                total={panigate?.total}
                onChange={onChange}
                style={{ textAlign: "center", marginTop: "10px" }}
              />
              <div>
                {/* <ReactPaginate
                pageCount={panigate?.total}
                onPageChange={panigate.page + 1}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                containerClassName=" paginationBttns "
              /> */}
              </div>
            </Row>
          </Container>
        </section>
      </Helmet>
    </div>
  );
};

export default AllFoods;
