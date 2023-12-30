import React, { useEffect } from "react";

import CommonSection from "../components/UI/common-section/CommonSection";
import Helmet from "../components/Helmet/Helmet";
import "../styles/cart-page.css";
import { useSelector, useDispatch } from "react-redux";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CustomCheckbox,
  WrapperCountOrder,
  WrapperInfo,
  WrapperItemOrder,
  WrapperLeft,
  WrapperListOrder,
  WrapperRight,
  WrapperStyleHeader,
  WrapperStyleHeaderDilivery,
  WrapperTotal,
} from "../styles/cart";
import {
  decreaseAmount,
  increaseAmount,
  removeOrderProduct,
  resetAllOrder,
  addOrderProduct,
  selectedOrder,
} from "../store/shopping-cart/orderSlide";
import { Checkbox, Form } from "antd";
import { useNavigate } from "react-router-dom";

import * as CartService from "../services/CartService";
import { useMutationHooks } from "../hooks/useMutationHook";
import { useState } from "react";
import StepComponent from "../components/StepComponent/StepComponent";
import ModalComponent from "../components/ModalComponent/ModalComponent";
import InputComponent from "../components/InputComponent/InputComponent";
import * as UserService from "../services/UserService";
import Loading from "../components/LoadingComponent/Loading";
import * as message from "../components/Message/Message";
import { updateUser } from "../store/shopping-cart/userSlide";

const Cart = () => {
  const cartProducts1 = useSelector((state) => state.order);
  const [carts1, setCarts1] = useState([]);
  const dispatch = useDispatch();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const [listChecked, setListChecked] = useState([]);
  const idUser = localStorage.getItem("myid");
  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const priceMemo = useMemo(() => {
    const result = cartProducts1?.orderItemsSlected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [cartProducts1]);
  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSlected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
    }, 0);
    if (Number(result)) {
      return result;
    }
    return 0;
  }, [order]);
  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo >= 200000 && priceMemo < 500000) {
      return 10000;
    } else if (priceMemo >= 500000 || order?.orderItemsSlected?.length === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return (
      Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);
  const handleOnchangeCheckAll = (e) => {
    console.log("listCheckedFather", listChecked);

    if (e.target.checked) {
      const newListChecked = [];
      order?.orderItems?.forEach((item) => {
        newListChecked.push(item?.product);
        console.log("item?.product", item?.product);
      });
      setListChecked(newListChecked);
    } else {
      setListChecked([]);
    }
  };
  useEffect(() => {
    dispatch(selectedOrder({ listChecked }));
  }, [listChecked]);
  const deleteItem = (idProduct) => {
    dispatch(removeOrderProduct({ idProduct }));
    CartService.deleteCart(idProduct, idUser);
  };
  const incrementItem = (idProduct, amount, countInstock) => {
    const newAmount = amount + 1;

    if (newAmount <= countInstock) {
      CartService.UpdateCart(idProduct, newAmount, idUser);
      dispatch(increaseAmount({ idProduct }));
    }
    // mutation.mutate({
    //   id: idProduct,
    //   amount: newAmount,
    // });
  };

  const decreaseItem = (idProduct, amount) => {
    if (amount > 1) {
      dispatch(decreaseAmount({ idProduct }));
      const newAmount = amount - 1;
      CartService.UpdateCart(idProduct, newAmount, idUser);
    } else {
      // dispatch(removeOrderProduct({ idProduct }));
    }
  };
  const onChange = (e) => {
    if (listChecked.includes(e.target.value)) {
      const newListChecked = listChecked.filter(
        (item) => item !== e.target.value
      );
      setListChecked(newListChecked);
    } else {
      setListChecked([...listChecked, e.target.value]);
    }
  };
  const itemsDelivery = [
    {
      title: "20.000 VND",
      description: "Dưới 200.000 VND",
    },
    {
      title: "10.000 VND",
      description: "Từ 200.000 VND đến dưới 500.000 VND",
    },
    {
      title: "Free ship",
      description: "Trên 500.000 VND",
    },
  ];
  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);
  const handleAddCard = () => {
    if (!order?.orderItemsSlected?.length) {
      message.error("Vui lòng chọn sản phẩm");
    } else if (!user?.phone || !user.address || !user.name || !user.city) {
      setIsOpenModalUpdateInfo(true);
    } else {
      navigate("/payment");
    }
  };

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = UserService.updateUser(id, { ...rests }, token);
    return res;
  });

  const { isPending, data } = mutationUpdate;
  const handleCancleUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  };
  const handleUpdateInforUser = () => {
    const { name, address, city, phone } = stateUserDetails;
    if (name && address && city && phone) {
      mutationUpdate.mutate(
        { id: user?.id, token: user?.access_token, ...stateUserDetails },
        {
          onSuccess: () => {
            dispatch(updateUser({ name, address, city, phone }));
            setIsOpenModalUpdateInfo(false);
          },
        }
      );
    }
  };
  const handleOnchangeDetails = (e) => {
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value,
    });
  };
  return (
    <Helmet title="Cart">
      <CommonSection title="Your Cart" />
      <section>
        <Container>
          <Row>
            <Col lg="12">
              <WrapperInfo>
                <div>
                  <span>Địa chỉ: </span>
                  <span style={{ fontWeight: "bold" }}>
                    {`${user?.address} ${user?.city}`}{" "}
                  </span>
                  <span
                    onClick={handleChangeAddress}
                    style={{ color: "#9255FD", cursor: "pointer" }}
                  >
                    Thay đổi
                  </span>
                </div>
              </WrapperInfo>
              <WrapperStyleHeaderDilivery>
                <StepComponent
                  items={itemsDelivery}
                  current={
                    diliveryPriceMemo === 10000
                      ? 2
                      : diliveryPriceMemo === 20000
                      ? 1
                      : order.orderItemsSlected.length === 0
                      ? 0
                      : 3
                  }
                />
              </WrapperStyleHeaderDilivery>
              {cartProducts1?.orderItems?.length === 0 ? (
                <h5 className="text-center">Your cart is empty</h5>
              ) : (
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>
                        <CustomCheckbox
                          onChange={handleOnchangeCheckAll}
                          checked={
                            listChecked?.length === order?.orderItems?.length
                          }
                        ></CustomCheckbox>
                      </th>
                      <th>Image</th>
                      <th>Product Title</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Action</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartProducts1?.orderItems?.map((item) => (
                      // <Tr
                      //   item={item}
                      //   key={item.id}
                      //   listChecked={listChecked}
                      //   setListChecked={updatelistCheckedState}
                      // />

                      <tr>
                        <td className="text-center ">
                          <CustomCheckbox
                            onChange={onChange}
                            value={item?.product}
                            checked={listChecked.includes(item?.product)}
                          ></CustomCheckbox>
                        </td>
                        <td className="text-center cart__img-box">
                          <img src={item.image} alt="" />
                        </td>
                        <td className="text-center">{item.name}</td>
                        <td className="text-center">{item.price} VND</td>
                        <td className="text-center">{item.amount}px</td>
                        <td className="text-center cart__item-del">
                          <div className=" d-flex align-items-center justify-content-between text-center  increase__decrease-btn">
                            <span
                              className="increase__btn"
                              onClick={() =>
                                incrementItem(
                                  item.product,
                                  item.amount,
                                  item.countInstock
                                )
                              }
                            >
                              <i className="ri-add-line"></i>
                            </span>
                            <span className="quantity">{item.amount}</span>
                            <span
                              className="decrease__btn"
                              onClick={() =>
                                decreaseItem(item.product, item.amount)
                              }
                            >
                              <i className="ri-subtract-line "></i>
                            </span>
                          </div>
                        </td>
                        <td className="text-center cart__item-del">
                          <i
                            className="ri-delete-bin-line"
                            onClick={() => deleteItem(item.product)}
                          ></i>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="mt-4">
                <h6>
                  Subtotal:
                  <span className="cart__subtotal"> {priceMemo || 0} VND</span>
                </h6>
                <p>Taxes and shipping will calculate at checkout</p>
                <div className="cart__page-btn">
                  <button className="addTOCart__btn me-4">
                    <Link to="/foods">Continue Shopping</Link>
                  </button>
                  <button
                    className="addTOCart__btn"
                    onClick={() => handleAddCard()}
                  >
                    Proceed to checkout
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      <ModalComponent
        title="Cập nhật thông tin giao hàng"
        open={isOpenModalUpdateInfo}
        onCancel={handleCancleUpdate}
        onOk={handleUpdateInforUser}
      >
        <Loading isLoading={isPending}>
          <Form
            name="basic"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            // onFinish={onUpdateUser}
            autoComplete="on"
            form={form}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <InputComponent
                value={stateUserDetails["name"]}
                onChange={handleOnchangeDetails}
                name="name"
              />
            </Form.Item>
            <Form.Item
              label="City"
              name="city"
              rules={[{ required: true, message: "Please input your city!" }]}
            >
              <InputComponent
                value={stateUserDetails["city"]}
                onChange={handleOnchangeDetails}
                name="city"
              />
            </Form.Item>
            <Form.Item
              label="Phone"
              name="phone"
              rules={[{ required: true, message: "Please input your  phone!" }]}
            >
              <InputComponent
                value={stateUserDetails.phone}
                onChange={handleOnchangeDetails}
                name="phone"
              />
            </Form.Item>

            <Form.Item
              label="Adress"
              name="address"
              rules={[
                { required: true, message: "Please input your  address!" },
              ]}
            >
              <InputComponent
                value={stateUserDetails.address}
                onChange={handleOnchangeDetails}
                name="address"
              />
            </Form.Item>
          </Form>
        </Loading>
      </ModalComponent>
    </Helmet>
  );
};

// const Tr = (props, { setListChecked, listChecked }) => {
//   const { product: idProduct, image, name, price, amount } = props.item;
//   console.log("listCheckedChild", listChecked);
//   const idUser = localStorage.getItem("myid");
//   const order = useSelector((state) => state.order);

//   const dispatch = useDispatch();

//   // return (

//   // );
// };

export default Cart;
