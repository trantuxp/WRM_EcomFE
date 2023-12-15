import axios from "axios";

export const signupStore = async (id, data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/store/create/${id}`,
    data
  );
  // console.log("data", res.data);

  return res.data;
};
export const getDetailsStore = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/store/store-detail/${id}`
  );
  // console.log("data", res.data);

  return res.data;
};
