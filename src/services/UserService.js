import axios from "axios";

export const axiosJWT = axios.create();

export const loginUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-in`,
    data
  );
  return res.data;
};

export const signupUser = async (data) => {
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/sign-up`,
    data
  );
  // console.log("data", res.data);

  return res.data;
};

export const getDetailsUser = async (id, access_token) => {
  // console.log("id, access_token", id, access_token);
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/user/get-details/${id}?token=${access_token}`
  );
  // console.log("res", res.data);

  return res.data;
};

export const deleteUser = async (id, access_token, data) => {
  const res = await axiosJWT.delete(
    `${process.env.REACT_APP_API_URL}/user/delete-user/${id}?token=${access_token}`
  );
  return res.data;
};

export const getAllUser = async (access_token) => {
  const res = await axiosJWT.get(
    `${process.env.REACT_APP_API_URL}/user/getAll?token=${access_token}`
  );
  return res.data;
};
export const refreshToken = async (refreshToken) => {
  // console.log("refreshToken", refreshToken);
  const res = await axios.post(
    `${process.env.REACT_APP_API_URL}/user/refresh-token`,
    {},
    {
      headers: {
        token: `${refreshToken}`,
      },
    }
  );
  return res.data;
};

export const logoutUser = async () => {
  const res = await axios.post(`${process.env.REACT_APP_API_URL}/user/log-out`);
  return res.data;
};

export const updateUser = async (id, data, access_token) => {
  const res = await axiosJWT.put(
    `${process.env.REACT_APP_API_URL}/user/update-user/${id}?token=${access_token}`,
    data
  );
  return res.data;
};

export const deleteManyUser = async (data, access_token) => {
  const res = await axiosJWT.post(
    `${process.env.REACT_APP_API_URL}/user/delete-many?token=${access_token}`,
    data
  );
  return res.data;
};
