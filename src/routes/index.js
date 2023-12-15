import Home from "../pages/Home";
import AllFoods from "../pages/AllFoods";
import FoodDetails from "../pages/FoodDetails";
import Cart from "../pages/Cart";
import Checkout from "../pages/Checkout";
import Contact from "../pages/Contact";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminPage from "../pages/AdminPage/AdminPage";
import ProfilePage from "../pages/Profile/ProfilePage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import StorePage from "../pages/StorePage/StorePage";
import DetailStorePage from "../pages/DetailStorePage/DetailStorePage";

export const routes = [
  {
    path: "/",
    page: Home,
    isShowHeader: true,
  },
  {
    path: "/home",
    page: Home,
    isShowHeader: true,
  },
  {
    path: "/foods",
    page: AllFoods,
    isShowHeader: true,
  },
  {
    path: "/foods/:id",
    page: FoodDetails,
    isShowHeader: true,
  },
  {
    path: "/cart",
    page: Cart,
    isShowHeader: true,
  },
  {
    path: "/checkout",
    page: Checkout,
    isShowHeader: true,
  },
  {
    path: "/login",
    page: Login,
    isShowHeader: true,
  },
  {
    path: "/register",
    page: Register,
    isShowHeader: true,
  },
  {
    path: "/contact",
    page: Contact,
    isShowHeader: true,
  },
  {
    path: "/profile-user",
    page: ProfilePage,
    isShowHeader: true,
  },
  {
    path: "/signup-store",
    page: SignUpPage,
    isShowHeader: true,
  },
  {
    path: "/system/admin",
    page: AdminPage,
    isShowHeader: false,
    isPrivated: true,
  },
  {
    path: "/store/:id",
    page: DetailStorePage,
    isShowHeader: true,
  },
  {
    path: "/store/admin",
    page: StorePage,
    isShowHeader: false,
    isPrivated: true,
  },
  // {
  //   path: "*",
  //   page: NotFoundPage,
  //   isShowHeader: false,
  // },
];

export default routes;
