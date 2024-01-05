import axios from "axios";

export const createSearch = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/search/create`,
    data
  );
  // console.log("data", res.data);

  return res.data;
};
export const getSearchByUser = async (id) => {
  const res = await axios.get(
    `${process.env.REACT_APP_API_URL}/search/get-search-by-user/${id}`
  );
  // console.log("data", res.data);

  return res.data;
};
