import { axiosJWT } from "./UserService";

// export const createProduct = async (data) => {
//   const res = await axios.post(`${process.env.REACT_APP_API_URL}/product/create`, data)
//   return res.data
// // }
// http://localhost:3001/api/order/get-order-details/639724669c6dda4fa11edcde
export const createOrder = async (data, access_token) => {
  console.log("mua");
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/order/create/${data.user}?token=${access_token}`,
    data
  );
  return res.data;
};

export const getOrderByUserId = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-by-user/${id}?token=${access_token}`
  );
  return res.data;
};
export const getOrderByUserIdDelivered = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-by-user-delivered/${id}?token=${access_token}`
  );
  return res.data;
};
export const getOrderByStore1 = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-by-store1/${id}`
  );
  return res.data;
};
export const getOrderByStore2 = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-by-store2/${id}`
  );
  return res.data;
};
export const getOrderByStore3 = async (id) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-order-by-store3/${id}`
  );
  return res.data;
};

export const getDetailsOrder = async (id, access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-details-order/${id}?token=${access_token}`
  );
  return res.data;
};

export const cancelOrder = async (id, access_token, orderItems, userId) => {
  const data = { orderItems, orderId: id };
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/order/cancel-order/${userId}?token=${access_token}`,
    { data }
  );
  return res.data;
};

export const getAllOrder = async (access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/order/get-all-order?token=${access_token}`
  );
  return res.data;
};
export const updateStateOrder = async (id) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/order/update/${id}`
  );
  return res.data;
};
export const updateStateDeliveryOrder = async (id) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/order/update-delivery/${id}`
  );
  return res.data;
};
