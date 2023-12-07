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

// const Routers = () => {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         {/* <Route path="/home" element={<Home />} /> */}
//         <Route path="/foods" element={<AllFoods />} />
//         <Route path="/foods/:id" element={<FoodDetails />} />
//         <Route path="/cart" element={<Cart />} />
//         <Route path="/checkout" element={<Checkout />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/register" element={<Register />} />
//         <Route path="/contact" element={<Contact />} />
//       </Routes>
//     </Router>
//   );
// };

export default routes;
