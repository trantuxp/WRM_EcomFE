import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Carts from "./components/UI/cart/Carts";
import routes from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { Fragment, useState, useEffect, useMemo } from "react";

import { isJsonString } from "./utils";
import { jwtDecode } from "jwt-decode";
import * as UserService from "./services/UserService";
import { useDispatch, useSelector } from "react-redux";
import { resetUser, updateUser } from "./store/shopping-cart/userSlide";
import { useQuery } from "@tanstack/react-query";

import {
  decreaseAmount,
  increaseAmount,
  removeOrderProduct,
  resetAllOrder,
  addOrderProduct,
} from "./store/shopping-cart/orderSlide";

import * as CartService from "./services/CartService";
function App() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order);

  // console.log("process.env.REACT_APP_API_URL", process.env.REACT_APP_API_URL);
  // console.log("user.isAdmin", user.isAdmin);

  useEffect(() => {
    setIsLoading(true);

    const { storageData, decoded } = handleDecoded();
    console.log("storageData", storageData, "asdasd", decoded);
    if (decoded?.id) {
      localStorage.setItem("myid", decoded.id);
      handleGetDetailsUser(decoded?.id, storageData);
    }
    setIsLoading(false);
  }, []);

  const handleDecoded = () => {
    let storageData =
      user?.access_token || localStorage.getItem("access_token");
    let decoded = {};
    if (storageData && isJsonString(storageData) && !user?.access_token) {
      storageData = JSON.parse(storageData);
      decoded = jwtDecode(storageData);
    }
    return { decoded, storageData };
  };

  UserService.axiosJWT.interceptors.request.use(
    async (config) => {
      // Do something before request is sent

      const currentTime = new Date();
      const { decoded } = handleDecoded();
      let storageRefreshToken = localStorage.getItem("refresh_token");
      const refreshToken = JSON.parse(storageRefreshToken);
      const decodedRefreshToken = jwtDecode(refreshToken);
      if (decoded?.exp < currentTime.getTime() / 1000) {
        if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
          const data = await UserService.refreshToken(refreshToken);
          // console.log("co vo day ", data, "asdsa");

          config.headers["token"] = `${data?.access_token}`;
          // console.log("config.headers[token]", config.headers["token"]);
        } else {
          // console.log("co vo day nua ");

          dispatch(resetUser());
        }
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );

  const handleGetDetailsUser = async (id, token) => {
    let storageRefreshToken = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storageRefreshToken);
    const res = await UserService.getDetailsUser(id, token);
    // console.log("Res", res);

    if (!res.data) {
      console.log("log out ", user.access_token, "asda");
    } else {
      dispatch(
        updateUser({
          ...res?.data,
          access_token: token,
          refreshToken: refreshToken,
        })
      );
      // await UserService.logoutUser();
      // dispatch(resetUser());
      console.log("login");
    }
  };

  const fetchGetCart = async () => {
    if (localStorage.getItem("myid")) {
      const id = localStorage.getItem("myid");
      const res = await CartService.getCartByUser(id);
      return res;
    }
  };

  const { isPending: isPendingCart, data: cartByUser } = useQuery({
    queryKey: ["cart-by-user"],
    queryFn: fetchGetCart,
  });

  useEffect(
    () => {
      if (cartByUser) {
        console.log("cartByUser", cartByUser);
        cartByUser.map((cart) => {
          console.log("id", cart._id);
          const itemOrder = order?.orderItems?.find(
            (item) => item?.product === cart.product[0]?._id
          );
          if (!itemOrder) {
            console.log("cart._id", cart.product[0]?._id);
            dispatch(
              addOrderProduct({
                orderItem: {
                  name: cart?.product[0]?.name,
                  amount: cart?.amount,
                  image: cart?.product[0]?.image,
                  price: cart?.product[0]?.price,
                  product: cart?.idItem,
                  discount: cart?.product[0]?.discount,
                  countInstock: cart?.product[0]?.countInStock,
                  idStore: cart?.product[0]?.idStore,
                },
              })
            );
          }
        });
      }
    },
    [cartByUser],
    [localStorage.getItem("myid")]
  );

  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            // const ischeckAuth = !route.isPrivated;
            // console.log("route.isPrivated", route.isPrivated);
            const Layout =
              route.isShowHeader === true ? DefaultComponent : Fragment;
            return (
              <Route
                key={route.page}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
        </Routes>
      </Router>
    </div>
  );
}

export default App;
