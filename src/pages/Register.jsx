import React, { useRef, useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link } from "react-router-dom";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as UserService from "../services/UserService";
import { useMutationHooks } from "../hooks/useMutationHook";
import Loading from "../components/LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import * as message from "../components/Message/Message";
import { useEffect } from "react";

const Register = () => {
  const navigate = useNavigate();

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const user = useSelector((state) => state.user);

  const mutation = useMutationHooks((data) => UserService.signupUser(data));
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success();
      handleNavigateSignIn();
    } else if (isSuccess && data?.status === "ERR") {
      message.error("The email is already");
    } else {
    }
  }, [isSuccess, isError]);

  const handleOnchangeEmail = (value) => {
    setEmail(value);
  };
  const handleOnchangePassword = (value) => {
    setPassword(value);
  };

  const handleOnchangeConfirmPassword = (value) => {
    console.log("pa", confirmPassword);
    setConfirmPassword(value);
  };

  const handleNavigateSignIn = () => {
    navigate("/login");
  };
  const handleSignUp = () => {
    if (password == confirmPassword) {
      mutation.mutate({
        email,
        password,
        confirmPassword,
      });
      console.log("email", email, password);
    } else {
      message.error("Passwords do not match");
    }
  };

  return (
    <div style={{ marginTop: "100px" }}>
      <Helmet title="Signup">
        <CommonSection title="Signup" />
        <section>
          <Container>
            <Row>
              <Col lg="6" md="6" sm="12" className="m-auto text-center">
                <form className="form mb-5">
                  <div className="form__group">
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      onChange={(e) => handleOnchangeEmail(e.target.value)}
                    />
                  </div>
                  <div className="form__group">
                    <div style={{ position: "relative" }}>
                      <span
                        onClick={() => setIsShowPassword(!isShowPassword)}
                        style={{
                          zIndex: 10,
                          position: "absolute",
                          top: "4px",
                          right: "8px",
                        }}
                      >
                        {isShowPassword ? (
                          <EyeFilled />
                        ) : (
                          <EyeInvisibleFilled />
                        )}
                      </span>
                      <input
                        type={isShowPassword ? "text" : "password"}
                        placeholder="Password"
                        required
                        onChange={(e) => handleOnchangePassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="form__group">
                    <div style={{ position: "relative" }}>
                      <span
                        onClick={() =>
                          setIsShowConfirmPassword(!isShowConfirmPassword)
                        }
                        style={{
                          zIndex: 10,
                          position: "absolute",
                          top: "4px",
                          right: "8px",
                        }}
                      >
                        {isShowConfirmPassword ? (
                          <EyeFilled />
                        ) : (
                          <EyeInvisibleFilled />
                        )}
                      </span>
                      <input
                        type={isShowConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        required
                        onChange={(e) =>
                          handleOnchangeConfirmPassword(e.target.value)
                        }
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    className="addTOCart__btn"
                    onClick={() => handleSignUp()}
                  >
                    Sign Up
                  </button>
                </form>
                <Link to="/login">Already have an account? Login</Link>
              </Col>
            </Row>
          </Container>
        </section>
      </Helmet>
    </div>
  );
};

export default Register;
