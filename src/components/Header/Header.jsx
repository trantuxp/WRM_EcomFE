import React, { useRef, useEffect, useState } from "react";

import { Container } from "reactstrap";
import logo from "../../assets/images/res-logo.png";
import { NavLink, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { cartUiActions } from "../../store/shopping-cart/cartUiSlice";
import { Badge, Button, Col, Popover } from "antd";
import {
  WrapperContentPopup,
  WrapperHeader,
  WrapperHeaderAccout,
  WrapperTextHeader,
  WrapperTextHeaderSmall,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import * as UserService from "../../services/UserService";
import { resetUser } from "../../store/shopping-cart/userSlide";
import { resetAllOrder } from "../../store/shopping-cart/orderSlide";
import { useNavigate } from "react-router-dom";

import "../../styles/header.css";

const nav__links = [
  {
    display: "Home",
    path: "/home",
  },
  {
    display: "Foods",
    path: "/foods",
  },
  {
    display: "Cart",
    path: "/cart",
  },
  {
    display: "Contact",
    path: "/contact",
  },
];

const Header = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const order = useSelector((state) => state.order);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const toggleCart = () => {
    dispatch(cartUiActions.toggle());
  };

  useEffect(() => {
    setLoading(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setLoading(false);
  }, [user?.name, user?.avatar]);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("header__shrink");
      } else {
        headerRef.current.classList.remove("header__shrink");
      }
    });

    return () => window.removeEventListener("scroll");
  }, []);

  const handleLogout = async () => {
    setLoading(true);
    await UserService.logoutUser();
    dispatch(resetUser());
    localStorage.setItem("access_token", "");
    localStorage.setItem("refresh_token", "");
    localStorage.setItem("myid", "");
    dispatch(resetAllOrder());
    setLoading(false);
    navigate("/");
  };
  const content = (
    <div>
      <WrapperContentPopup onClick={() => handleClickNavigate("profile")}>
        User information
      </WrapperContentPopup>
      {user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate("admin")}>
          System management
        </WrapperContentPopup>
      )}
      {!user?.isStore && !user?.isAdmin && (
        <WrapperContentPopup
          onClick={() => handleClickNavigate(`signup-store`)}
        >
          Register for Sales
        </WrapperContentPopup>
      )}
      {!user?.isStore && !user?.isAdmin && (
        <WrapperContentPopup onClick={() => handleClickNavigate(`myorder`)}>
          My order
        </WrapperContentPopup>
      )}
      {!!user?.isStore && (
        <WrapperContentPopup onClick={() => handleClickNavigate(`store`)}>
          Store manager
        </WrapperContentPopup>
      )}

      <WrapperContentPopup onClick={() => handleClickNavigate()}>
        Log out
      </WrapperContentPopup>
    </div>
  );

  const handleClickNavigate = (type) => {
    // console.log("isstore", user.isStore);
    if (type === "profile") {
      navigate("/profile-user");
    } else if (type === "admin") {
      navigate("/system/admin");
    } else if (type === "signup-store") {
      navigate("/signup-store");
    } else if (type === "store") {
      navigate("/store/admin");
    } else if (type === "myorder") {
      navigate("/myorder");
    } else {
      handleLogout();
      // console.log("dang xuat");
    }
    setIsOpenPopup(false);
  };

  return (
    <header
      className="header"
      ref={headerRef}
      style={{
        background: !isHiddenCart ? "#fff" : "rgb(185 212 250)",
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          <div className="logo">
            <Link to={`/`}>
              <img src={logo} alt="logo" />
              <h5>Culinary Oasis</h5>
            </Link>
          </div>

          {/* ======= menu ======= */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            {!isHiddenCart && (
              <div className="menu d-flex align-items-center gap-5">
                {nav__links.map((item, index) => (
                  <NavLink
                    to={item.path}
                    key={index}
                    className={(navClass) =>
                      navClass.isActive ? "active__menu" : ""
                    }
                  >
                    {item.display}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          {/* ======== nav right icons ========= */}
          <div className="nav__right d-flex align-items-center gap-4">
            {!isHiddenCart && (
              <span className="cart__icon" onClick={toggleCart}>
                <i className="ri-shopping-basket-line"></i>
                <span className="cart__badge">{order?.orderItems?.length}</span>
              </span>
            )}

            {!!userAvatar && (
              <img
                src={userAvatar}
                alt="avatar"
                style={{
                  height: "40px",
                  width: "40px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginBottom: "10px",
                }}
              />
            )}
            {user?.access_token ? (
              <>
                <Popover content={content} trigger="click" open={isOpenPopup}>
                  <div
                    style={{
                      cursor: "pointer",
                      maxWidth: 100,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      lineHeight: "1em",
                    }}
                    onClick={() => setIsOpenPopup((prev) => !prev)}
                  >
                    {userName?.length ? userName : user?.email}
                  </div>
                </Popover>
              </>
            ) : (
              <span className="user">
                <Link to="/login">
                  <i className="ri-user-line"></i>
                </Link>
              </span>
            )}

            <span className="mobile__menu" onClick={toggleMenu}>
              <i className="ri-menu-line"></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
