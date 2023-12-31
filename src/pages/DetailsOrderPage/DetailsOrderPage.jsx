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

import { useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import * as OrderService from "../../services/OrderService";
import { useQuery } from "@tanstack/react-query";
import { orderContant } from "../../contant";
import { convertPrice } from "../../utils";
import { useMemo } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import Rating from "../../components/Rating/Rating";
import InputComponent from "../../components/InputComponent/InputComponent";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
const DetailsOrderPage = () => {
  const [isOpenModalRating, setIsOpenModalRating] = useState(false);

  const params = useParams();
  const user = useSelector((state) => state.user);
  const { id } = params;

  const fetchDetailsOrder = async () => {
    const res = await OrderService.getDetailsOrder(id, user?.token);
    return res.data;
  };

  const queryOrder = useQuery({
    queryKey: ["orders-details"],
    queryFn: fetchDetailsOrder,
  });
  const { isPending, data } = queryOrder;

  const priceMemo = useMemo(() => {
    const result = data?.orderItems?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [data]);

  const HandleRating = () => {
    setIsOpenModalRating(true);
  };
  return (
    <Loading isLoading={isPending}>
      <div style={{ width: "100%", minHeight: "100vh", background: "#f5f5fa" }}>
        <div style={{ width: "1270px", margin: "0 auto", height: "1270px" }}>
          <h2 style={{ padding: "10px 10px 10px 0" }}>Chi tiết đơn hàng</h2>
          <WrapperHeaderUser>
            <WrapperInfoUser>
              <WrapperLabel>Địa chỉ người nhận</WrapperLabel>
              <WrapperContentInfo>
                <div className="name-info">
                  {data?.shippingAddress?.fullName}
                </div>
                <div className="address-info">
                  <span>Địa chỉ: </span>{" "}
                  {`${data?.shippingAddress?.address} ${data?.shippingAddress?.city}`}
                </div>
                <div className="phone-info">
                  <span>Điện thoại: </span> {data?.shippingAddress?.phone}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Hình thức giao hàng</WrapperLabel>
              <WrapperContentInfo>
                <div className="delivery-info">
                  <span className="name-delivery">FAST </span>Giao hàng tiết
                  kiệm
                </div>
                <div className="delivery-fee">
                  <span>Phí giao hàng: </span> {data?.shippingPrice}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
            <WrapperInfoUser>
              <WrapperLabel>Hình thức thanh toán</WrapperLabel>
              <WrapperContentInfo>
                <div className="payment-info">
                  {orderContant.payment[data?.paymentMethod]}
                </div>
                <div className="status-payment">
                  {data?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}
                </div>
              </WrapperContentInfo>
            </WrapperInfoUser>
          </WrapperHeaderUser>
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
              <div style={{ flex: 5, display: "flex" }}>Sản phẩm</div>
              <WrapperItemLabel>Giá</WrapperItemLabel>
              <WrapperItemLabel>Số lượng</WrapperItemLabel>
              <WrapperItemLabel>Giảm giá</WrapperItemLabel>
              <WrapperItemLabel>Đánh giá</WrapperItemLabel>
            </div>
            {data?.orderItems?.map((order, key) => {
              return (
                <WrapperProduct key={order?._id}>
                  <WrapperNameProduct>
                    <img
                      src={order?.image}
                      style={{
                        width: "70px",
                        height: "70px",
                        objectFit: "cover",
                        border: "1px solid rgb(238, 238, 238)",
                        padding: "2px",
                      }}
                    />

                    {order?.name}
                  </WrapperNameProduct>
                  <WrapperItem>{convertPrice(order?.price)}</WrapperItem>
                  <WrapperItem>{order?.amount}</WrapperItem>
                  <WrapperItem>
                    {order?.discount
                      ? convertPrice((priceMemo * order?.discount) / 100)
                      : "0 VND"}
                  </WrapperItem>
                  <WrapperItem
                    onClick={() => {
                      HandleRating();
                    }}
                  >
                    Đánh giá
                  </WrapperItem>
                </WrapperProduct>
              );
            })}
            {isOpenModalRating && (
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
                    style={{ display: "flex", flex: 1, paddingLeft: "20px" }}
                  >
                    Nội dung Đánh giá:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 4,
                      alignItems: "flex-start",
                    }}
                  >
                    <InputComponent></InputComponent>
                  </div>
                  <div
                    style={{ display: "flex", flex: 1, paddingLeft: "20px" }}
                  >
                    Đánh giá sản phẩm:
                  </div>
                  <div
                    style={{
                      display: "flex",
                      flex: 2,
                      alignItems: "flex-start",
                    }}
                  >
                    <Rating></Rating>
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
                  >
                    <ButtonComponent
                      // onClick={() => handleAddOrder()}
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
            <div style={{ backgroundColor: "white", padding: "10px" }}>
              <WrapperAllPrice>
                <WrapperItemLabel>
                  Tạm tính:&nbsp;
                  <WrapperItem>{convertPrice(priceMemo)}</WrapperItem>
                </WrapperItemLabel>
              </WrapperAllPrice>
              <WrapperAllPrice>
                <WrapperItemLabel>
                  Phí vận chuyển:&nbsp;
                  <WrapperItem>{convertPrice(data?.shippingPrice)}</WrapperItem>
                </WrapperItemLabel>
              </WrapperAllPrice>
              <WrapperAllPrice>
                <WrapperItemLabel>
                  Tổng cộng:&nbsp;
                  <WrapperItem>{convertPrice(data?.totalPrice)}</WrapperItem>
                </WrapperItemLabel>
              </WrapperAllPrice>
            </div>
          </WrapperStyleContent>
        </div>
      </div>
    </Loading>
  );
};

export default DetailsOrderPage;
