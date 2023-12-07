import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Carts from "./components/UI/cart/Carts";
import { useSelector } from "react-redux";
import routes from "./routes";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DefaultComponent from "./components/DefaultComponent/DefaultComponent";
import { Fragment } from "react";

function App() {
  const showCart = useSelector((state) => state.cartUi.cartIsVisible);
  return (
    <div>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.page;
            // const ischeckAuth = !route.isPrivated;
            console.log("route.isPrivated", route.isPrivated);
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
