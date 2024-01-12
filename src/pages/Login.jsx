import React, { useRef, useState, useEffect } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import * as UserService from "../services/UserService";
import { useMutationHooks } from "../hooks/useMutationHook";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "../store/shopping-cart/userSlide";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const loginNameRef = useRef();
  const loginPasswordRef = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [carts, setCarts] = useState([]);

  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const navigate = useNavigate();

  const mutation = useMutationHooks((data) => UserService.loginUser(data));
  const { data, isPending, isSuccess } = mutation;
  // console.log("mutation", mutation);

  useEffect(() => {
    if (isSuccess) {
      localStorage.setItem("access_token", JSON.stringify(data?.access_token));
      localStorage.setItem(
        "refresh_token",
        JSON.stringify(data?.refresh_token)
      );
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
      if (location?.state) {
        navigate(location?.state);
        window.location.reload();
      } else {
        // window.location.reload();
        if (data?.status !== "ERR") {
          navigate("/");
          window.location.reload();
        }
      }
    }
  }, [isSuccess]);

  const handleGetDetailsUser = async (id, token) => {
    const storage = localStorage.getItem("refresh_token");
    const refreshToken = JSON.parse(storage);

    const res = await UserService.getDetailsUser(id, token);
    console.log("res", res);
    localStorage.setItem("myid", res.data._id);
    // console.log(localStorage.getItem("myid"));

    dispatch(updateUser({ ...res.data, access_token: token }));
  };

  const submitHandler = () => {
    mutation.mutate({
      email,
      password,
    });
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <Helmet title="Login">
        <CommonSection title="Login" />
        <section>
          <Container>
            <Row>
              <Col lg="6" md="6" sm="12" className="m-auto text-center">
                <div className="form mb-5">
                  <div className="form__group">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      ref={loginNameRef}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="form__group">
                    <input
                      type="password"
                      placeholder="Password"
                      required
                      ref={loginPasswordRef}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    {data?.status === "ERR" && (
                      <span style={{ color: "red" }}>{data?.message}</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="addTOCart__btn"
                    onClick={submitHandler}
                  >
                    Login
                  </button>
                </div>
                <Link to="/register">
                  Don't have an account? Create an account
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      </Helmet>
    </div>
  );
};

export default Login;
