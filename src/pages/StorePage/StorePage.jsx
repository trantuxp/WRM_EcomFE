import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import { getItem } from "../../utils";
import {
  AppstoreOutlined,
  ShoppingCartOutlined,
  FileOutlined,
  StarOutlined,
} from "@ant-design/icons";
import HeaderComponent from "../../components/Header/Header";
import AdminUser from "../../components/AdminUser/AdminUser";
import AdminProduct from "../../components/AdminProduct/AdminProduct";
import OrderAdmin from "../../components/OrderAdmin/OrderAdmin";
import * as ProductService from "../../services/ProductService";
import * as UserService from "../../services/UserService";
import StorePost from "../../components/StorePost/StorePost";

// import CustomizedContent from "./components/CustomizedContent";
import { useSelector } from "react-redux";
import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import EvaluateStore from "../../components/EvaluateStore/EvaluateStore";

const StorePage = () => {
  const user = useSelector((state) => state?.user);

  const items = [
    getItem("Post", "posts", <FileOutlined />),
    getItem("Product", "products", <AppstoreOutlined />),
    getItem("Order", "orders", <ShoppingCartOutlined />),
    getItem("Evaluate", "Evaluate", <StarOutlined />),
  ];

  const [keySelected, setKeySelected] = useState("");
  // const getAllOrder = async () => {
  //   const res = await OrderService.getAllOrder(user?.access_token);
  //   return { data: res?.data, key: "orders" };
  // };

  const getAllProducts = async () => {
    const res = await ProductService.getAllProduct();
    console.log("res1", res);
    return { data: res?.data, key: "products" };
  };

  // const queries = useQueries({
  //   queries: [
  //     { queryKey: ["products"], queryFn: getAllProducts, staleTime: 1000 * 60 },
  //     { queryKey: ["users"], queryFn: getAllUsers, staleTime: 1000 * 60 },
  //     { queryKey: ["orders"], queryFn: getAllOrder, staleTime: 1000 * 60 },
  //   ],
  // });
  // const memoCount = useMemo(() => {
  //   const result = {};
  //   try {
  //     if (queries) {
  //       queries.forEach((query) => {
  //         result[query?.data?.key] = query?.data?.data?.length;
  //       });
  //     }
  //     return result;
  //   } catch (error) {
  //     return result;
  //   }
  // }, [queries]);
  const COLORS = {
    users: ["#e66465", "#9198e5"],
    products: ["#a8c0ff", "#3f2b96"],
    orders: ["#11998e", "#38ef7d"],
  };

  const renderPage = (key) => {
    switch (key) {
      case "posts":
        return <StorePost />;
      case "products":
        return <AdminProduct />;
      case "orders":
        return <OrderAdmin />;
      case "Evaluate":
        return <EvaluateStore />;
      default:
        return <></>;
    }
  };

  const handleOnCLick = ({ key }) => {
    setKeySelected(key);
  };
  // console.log("memoCount", memoCount);
  return (
    <>
      <HeaderComponent isHiddenSearch isHiddenCart />
      <div style={{ display: "flex", overflowX: "hidden", marginTop: "100px" }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: "1px 1px 2px #ccc",
            height: "100vh",
          }}
          items={items}
          onClick={handleOnCLick}
        />
        <div style={{ flex: 1, padding: "15px 0 15px 15px" }}>
          {/* <Loading
            isLoading={
              memoCount &&
              Object.keys(memoCount) &&
              Object.keys(memoCount).length !== 3
            }
          > */}
          {/* {!keySelected && (
              <CustomizedContent
                data={memoCount}
                colors={COLORS}
                setKeySelected={setKeySelected}
              />
            )} */}
          {/* </Loading> */}
          {renderPage(keySelected)}
        </div>
      </div>
    </>
  );
};

export default StorePage;
