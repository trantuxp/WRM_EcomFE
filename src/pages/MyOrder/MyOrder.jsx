import React, { useEffect, useState } from "react";
import Loading from "../../components/LoadingComponent/Loading";
import { useQuery } from "@tanstack/react-query";
import * as OrderService from "../../services/OrderService";
import { useSelector } from "react-redux";
import { convertPrice } from "../../utils";
import {
  WrapperItemOrder,
  WrapperListOrder,
  WrapperHeaderItem,
  WrapperFooterItem,
  WrapperContainer,
  WrapperStatus,
} from "./style";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useMutationHooks } from "../../hooks/useMutationHook";
import * as message from "../../components/Message/Message";

const MyOrderPage = () => {
  // const location = useLocation();
  // const { state } = location;
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const fetchMyOrder = async () => {
    const res = await OrderService.getOrderByUserId(user?.id, user?.token);
    return res.data;
  };

  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: fetchMyOrder });
  const { isPending, data } = queryOrder;

  const handleDetailsOrder = (id) => {
    navigate(`/details-order/${id}`, {
      state: {
        token: user?.token,
      },
    });
  };

  const mutation = useMutationHooks((data) => {
    const { id, token, orderItems, userId } = data;
    const res = OrderService.cancelOrder(id, token, orderItems, userId);
    return res;
  });

  const handleCanceOrder = (order) => {
    mutation.mutate(
      {
        id: order._id,
        token: user?.token,
        orderItems: order?.orderItems,
        userId: user.id,
      },
      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const {
    isPending: isLoadingCancel,
    isSuccess: isSuccessCancel,
    isError: isErrorCancle,
    data: dataCancel,
  } = mutation;

  useEffect(() => {
    if (isSuccessCancel && dataCancel?.status === "OK") {
      message.success();
    } else if (isSuccessCancel && dataCancel?.status === "ERR") {
      message.error(dataCancel?.message);
    } else if (isErrorCancle) {
      message.error();
    }
  }, [isSuccessCancel]);

  const mutationConfirm = useMutationHooks((id) => {
    const res = OrderService.updateStateDeliveryOrder(id);
    return res;
  });

  const handleConfirmOrder = (id) => {
    mutationConfirm.mutate(
      id,

      {
        onSuccess: () => {
          queryOrder.refetch();
        },
      }
    );
  };
  const {
    isPending: isLoadingConfirm,
    isSuccess: isSuccessConfirm,
    isError: isErrorConfirm,
    data: dataConfirm,
  } = mutationConfirm;

  useEffect(() => {
    if (isSuccessConfirm && dataConfirm?.status === "OK") {
      message.success();
    } else if (isSuccessConfirm && dataConfirm?.status === "ERR") {
      message.error(dataConfirm?.message);
    } else if (isErrorConfirm) {
      message.error();
    }
  }, [isSuccessConfirm]);

  const renderProduct = (data) => {
    return data?.map((order) => {
      return (
        <WrapperHeaderItem key={order?._id}>
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
          <div
            style={{
              width: 260,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              marginLeft: "10px",
            }}
          >
            {order?.name}
          </div>
          <span
            style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
          >
            {convertPrice(order?.price)}
          </span>
        </WrapperHeaderItem>
      );
    });
  };

  return (
    <Loading isLoading={isPending || isLoadingCancel}>
      <WrapperContainer>
        <div
          style={{
            height: "100%",
            width: "1220px",
            margin: "0 auto",
            marginTop: "100px",
          }}
        >
          <WrapperListOrder>
            <div
              style={{
                padding: "10px",
                backgroundColor: "white",
              }}
            >
              <h5
                style={{
                  color: "red",
                }}
              >
                - My order{" "}
              </h5>
              <h5>
                <Link to={"/my-delivered-order"}>- My Delivered Order</Link>
              </h5>
            </div>
            {data?.map((order) => {
              return (
                <WrapperItemOrder key={order?._id}>
                  <WrapperStatus>
                    <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                      Status
                    </span>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        Delivery:{" "}
                      </span>
                      <span
                        style={{
                          color: "rgb(90, 32, 193)",
                          fontWeight: "bold",
                        }}
                      >{`${
                        order.isDelivered ? "Delivered" : "Not delivery"
                      }`}</span>
                    </div>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>Pay: </span>
                      <span
                        style={{
                          color: "rgb(90, 32, 193)",
                          fontWeight: "bold",
                        }}
                      >{`${order.isPaid ? "Paid" : "Unpaid"}`}</span>
                    </div>
                  </WrapperStatus>
                  {renderProduct(order?.orderItems)}
                  <WrapperFooterItem>
                    <div>
                      <span style={{ color: "rgb(255, 66, 78)" }}>
                        Total amount:{" "}
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          color: "rgb(56, 56, 61)",
                          fontWeight: 700,
                        }}
                      >
                        {convertPrice(order?.totalPrice)}
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <ButtonComponent
                        onClick={() => handleConfirmOrder(order._id)}
                        size={40}
                        styleButton={{
                          height: "36px",
                          border: "1px solid #9255FD",
                          borderRadius: "4px",
                        }}
                        textbutton={"Confirm delivered"}
                        styleTextButton={{ color: "#9255FD", fontSize: "14px" }}
                      ></ButtonComponent>
                      {/* <ButtonComponent
                        onClick={() => handleCanceOrder(order)}
                        size={40}
                        styleButton={{
                          height: "36px",
                          border: "1px solid #9255FD",
                          borderRadius: "4px",
                        }}
                        textbutton={"Cancel order"}
                        styleTextButton={{ color: "#9255FD", fontSize: "14px" }}
                      ></ButtonComponent> */}
                      <ButtonComponent
                        onClick={() => handleDetailsOrder(order?._id)}
                        size={40}
                        styleButton={{
                          height: "36px",
                          border: "1px solid #9255FD",
                          borderRadius: "4px",
                        }}
                        textbutton={"Details"}
                        styleTextButton={{ color: "#9255FD", fontSize: "14px" }}
                      ></ButtonComponent>
                    </div>
                  </WrapperFooterItem>
                </WrapperItemOrder>
              );
            })}
          </WrapperListOrder>
        </div>
      </WrapperContainer>
    </Loading>
  );
};

export default MyOrderPage;
