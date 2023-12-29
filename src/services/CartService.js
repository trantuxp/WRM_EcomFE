import axios from "axios";
import { axiosJWT } from "./UserService";

export const getCartByUser = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/cart/get-all-by-user/${id}`
  );
  // console.log("data", res.data);

  return res.data;
};
export const UpdateCart = async (id, amount, idUser) => {
  console.log("id, amount)", id, amount, idUser);
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/cart/update/${id}?amount=${amount}&iduser=${idUser}`
  );
  // console.log("data", res.data);

  return res.data;
};
export const deleteCart = async (id, idUser) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/cart/delete/${id}?iduser=${idUser}`
  );
  return res.data;
};

export const createCart = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/cart/create`,
    data
  );
  return res.data;
};
