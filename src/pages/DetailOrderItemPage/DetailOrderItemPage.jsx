import React, { useState } from "react";
import {
  WrapperAllPrice,
  WrapperContentInfo,
  WrapperHeaderUser,
  WrapperInfoUser,
  WrapperItem,
  WrapperItemLabel,
  WrapperLabel,
  WrapperNameProduct,
  WrapperProduct,
  WrapperStyleContent,
} from "./style";
import { useSelector } from "react-redux";

import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import * as OrderService from "../../services/OrderService";
import * as EvaluateService from "../../services/EvaluateService";
import { useQuery } from "@tanstack/react-query";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";
import { useMemo } from "react";

import Loading from "../../components/LoadingComponent/Loading";
import Rating from "../../components/Rating/Rating";
import InputComponent from "../../components/InputComponent/InputComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import StarRatingUI from "../../components/StarRatingUI/StarRatingUI";
const DetailOrderItemPage = () => {
  const [contentE, setContentE] = useState("");
  const [rating, setRating] = useState("");
  const [data, setData] = useState([]);
  const location = useLocation();

  const params = useParams();
  const user = useSelector((state) => state.user);
  const { id } = params;
  const { state } = location;
  {
    /* {id}
      {state?._id} */
  }
  const fetchGetEvaluateByItem = async () => {
    const idOrder = id;
    const idItem = state.product;
    console.log("idOrder", idOrder, idItem);

    const res = await EvaluateService.getEvaluateByOrderItem(idOrder, idItem);
    console.log("res.data", res.data);
    setData(res.data[0]);
  };

  useEffect(() => {
    fetchGetEvaluateByItem();
  }, [data]);
  const createEvaluate = async (idItem, idUser, idOrder, content, star) => {
    console.log(
      "idItem, idUser, idOrder, content, star",
      idItem,
      idUser,
      idOrder,
      content,
      star
    );
    const res = await EvaluateService.createEvaluate({
      idItem,
      idUser,
      idOrder,
      content,
      star,
    });
    return res.data;
  };
  const handleRatingChange = (selectedRating) => {
    setRating(selectedRating);
    console.log(`Selected Rating: ${selectedRating}`);
  };
  const handleAddEvaluate = async (rating, contentE) => {
    console.log(` Selected Rating: ${rating}`);
    console.log(` contentE: ${contentE}`);
    await createEvaluate(state.product, user.id, id, contentE, rating);
    window.location.reload();
  };

  return (
    <div style={{ width: "100%", background: "#f5f5fa", marginTop: "100px" }}>
      <div style={{ width: "1270px", margin: "0 auto", height: "1270px" }}>
        <h4 style={{ padding: "10px 10px 10px 0" }}>Order item details</h4>
        <WrapperStyleContent>
          <div
            style={{
              padding: "10px 15px",
              flex: 1,
              display: "flex",
              backgroundColor: "white",
              alignItems: "center",
              borderRadius: "4px",
              justifyContent: "space-between",
            }}
          >
            <div style={{ flex: 5, display: "flex" }}>Product</div>
            <WrapperItemLabel>Price</WrapperItemLabel>
            <WrapperItemLabel>Amount</WrapperItemLabel>
            <WrapperItemLabel>Discount</WrapperItemLabel>
          </div>

          <div>
            <WrapperProduct key={state?._id}>
              <WrapperNameProduct>
                <img
                  src={state?.image}
                  style={{
                    width: "70px",
                    height: "70px",
                    objectFit: "cover",
                    border: "1px solid rgb(238, 238, 238)",
                    padding: "2px",
                  }}
                />

                {state?.name}
              </WrapperNameProduct>
              <WrapperItem>{convertPrice(state?.price)}</WrapperItem>
              <WrapperItem>{state?.amount}</WrapperItem>
              <WrapperItem style={{ color: "black" }}>
                {state?.discount
                  ? convertPrice((state?.price * state?.discount) / 100)
                  : "0 VND"}
              </WrapperItem>
              {/* <WrapperItem
                onClick={() => {
                  // HandleRating(id, state);
                }}
              >
                Evaluate
              </WrapperItem> */}
            </WrapperProduct>
          </div>
          {data && (
            <div
              style={{
                backgroundColor: "white",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: "white",
                  padding: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    paddingLeft: "20px",
                  }}
                >
                  Content rated:
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 4,
                    alignItems: "flex-start",
                  }}
                >
                  {data?.content}
                </div>
                <div style={{ display: "flex", flex: 1, paddingLeft: "20px" }}>
                  Product reviews:
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 2,
                    alignItems: "flex-start",
                  }}
                >
                  {console.log("Number(data?.star)", Number(data?.star))}
                  <StarRatingUI
                    rating={data?.star}
                    fontSize="2em"
                  ></StarRatingUI>
                  {/* <Rating initialRating={Number(data?.star)}></Rating> */}
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: "white",
                  padding: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{ display: "flex", flex: 1, paddingLeft: "20px" }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    flex: 4,
                    alignItems: "flex-start",
                  }}
                ></div>
                <div
                  style={{ display: "flex", flex: 1, paddingLeft: "20px" }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    flex: 2,
                    justifyContent: "flex-end",
                    paddingRight: "10px",
                  }}
                ></div>
              </div>
            </div>
          )}
          {!data && (
            <div
              style={{
                backgroundColor: "white",
                marginTop: "5px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: "white",
                  padding: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    paddingLeft: "20px",
                  }}
                >
                  Content rated:
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 4,
                    alignItems: "flex-start",
                  }}
                >
                  <InputComponent
                    placeholder={"Content Evaluate"}
                    name="content"
                    onChange={(e) => setContentE(e.target.value)}
                  ></InputComponent>
                  {/* {queryEvaluate.content} */}
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    paddingLeft: "20px",
                  }}
                >
                  Product reviews:
                </div>
                <div
                  style={{
                    display: "flex",
                    flex: 2,
                    alignItems: "flex-start",
                  }}
                >
                  <Rating onRatingChange={handleRatingChange}></Rating>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  backgroundColor: "white",
                  padding: "10px",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    paddingLeft: "20px",
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    flex: 4,
                    alignItems: "flex-start",
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    flex: 1,
                    paddingLeft: "20px",
                  }}
                ></div>
                <div
                  style={{
                    display: "flex",
                    flex: 2,
                    justifyContent: "flex-end",
                    paddingRight: "10px",
                  }}
                >
                  <ButtonComponent
                    onClick={() => handleAddEvaluate(rating, contentE)}
                    size={40}
                    styleButton={{
                      background: "rgb(255, 57, 69)",
                      height: "50%",
                      width: "50%",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    textbutton={"Submit"}
                    styleTextButton={{
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  ></ButtonComponent>
                </div>
              </div>
            </div>
          )}
        </WrapperStyleContent>
      </div>
    </div>
  );
};

export default DetailOrderItemPage;
