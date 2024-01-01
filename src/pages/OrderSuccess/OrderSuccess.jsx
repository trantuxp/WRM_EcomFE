import React from "react";
import {
  Lable,
  WrapperInfo,
  WrapperContainer,
  WrapperValue,
  WrapperCountOrder,
  WrapperItemOrder,
  WrapperItemOrderInfo,
} from "./style";
import Loading from "../../components/LoadingComponent/Loading";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";

const OrderSucess = () => {
  const location = useLocation();
  const { state } = location;
  return (
    <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
      <Loading isLoading={false}>
        <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
          <h3>Order placed successfully</h3>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <WrapperContainer>
              <WrapperInfo>
                <div>
                  <Lable>Delivery method</Lable>
                  <WrapperValue>
                    <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                      {orderContant.delivery[state?.delivery]}
                    </span>{" "}
                    Economical delivery
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperInfo>
                <div>
                  <Lable>Payment methods</Lable>

                  <WrapperValue>
                    {orderContant.payment[state?.payment]}
                  </WrapperValue>
                </div>
              </WrapperInfo>
              <WrapperItemOrderInfo>
                {state.orders?.map((order) => {
                  return (
                    <WrapperItemOrder key={order?.name}>
                      <div
                        style={{
                          width: "500px",
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <img
                          src={order.image}
                          style={{
                            width: "77px",
                            height: "79px",
                            objectFit: "cover",
                            marginRight: "20px",
                          }}
                        />
                        <div
                          style={{
                            width: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {order?.name}
                        </div>
                      </div>
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            Amount: {order?.amount}
                          </span>
                        </span>
                        <span>
                          <span style={{ fontSize: "13px", color: "#242424" }}>
                            Unit Price: {convertPrice(order?.price)}
                          </span>
                        </span>
                      </div>
                      <span>
                        <span style={{ fontSize: "13px", color: "#242424" }}>
                          Price: {convertPrice(order?.price * order?.amount)}
                        </span>
                      </span>
                    </WrapperItemOrder>
                  );
                })}
                <div>
                  <span
                    style={{
                      fontSize: "16px",
                      color: "red",
                      display: "flex",
                      flexDirection: "row", // Assuming you have a row direction
                      justifyContent: "flex-end",
                    }}
                  >
                    Total payment: {convertPrice(state?.totalPriceMemo)}
                  </span>
                </div>
              </WrapperItemOrderInfo>
            </WrapperContainer>
          </div>
        </div>
      </Loading>
    </div>
  );
};

export default OrderSucess;
