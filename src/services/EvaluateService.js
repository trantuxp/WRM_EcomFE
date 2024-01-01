import axios from "axios";
import { axiosJWT } from "./UserService";

export const getAllEvaluate = async (idStore) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/evaluate/get-all-by-store/${idStore}`
  );

  return res.data;
};
export const createEvaluate = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/evaluate/create`,
    data
  );
  return res.data;
};

export const createReplyEvaluate = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/reply/create/`,
    data
  );

  return res.data;
};
export const getReplyEvaluate = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/reply/get-by-evaluate/${id}`
  );

  return res.data;
};
export const updateReplyEvaluate = async (id, content) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/reply/update/${id}`,
    { content: content }
  );

  return res.data;
};
