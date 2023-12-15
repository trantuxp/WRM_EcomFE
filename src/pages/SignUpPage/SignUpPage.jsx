import React, { useState } from "react";
import ButtonComponent from "../../components/ButtonComponent/ButtonComponent";
import InputForm from "../../components/InputForm/InputForm";
import {
  WrapperContainerLeft,
  WrapperContainerRight,
  WrapperTextLight,
  WrapperUploadFile,
} from "./style";
import imageLogo from "../../assets/images/logo-login.png";

import { Image, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeFilled, EyeInvisibleFilled } from "@ant-design/icons";
import * as StoreService from "../../services/StoreService";
import { useMutationHooks } from "../../hooks/useMutationHook";
import Loading from "../../components/LoadingComponent/Loading";
import { useDispatch, useSelector } from "react-redux";
import * as message from "../../components/Message/Message";
import { useEffect } from "react";
import { updateUser } from "../../store/shopping-cart/userSlide";
import { getBase64 } from "../../utils";

const SignUpPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [nameStore, setnameStore] = useState("");
  const [addressStore, setaddressStore] = useState("");
  const [avatarStore, setavatarStore] = useState("");

  const user = useSelector((state) => state.user);

  const mutation = useMutationHooks((data) =>
    StoreService.signupStore(user?.id, data)
  );
  const { data, isPending, isSuccess, isError } = mutation;

  useEffect(() => {
    if (isSuccess) {
      message.success();
      handleNavigateSignIn();
    } else if (isError) {
      message.error();
    }
  }, [isSuccess, isError]);

  const handleOnchangeEmail = (value) => {
    setnameStore(value);
  };
  const handleOnchangePassword = (value) => {
    setaddressStore(value);
  };

  const handleNavigateSignIn = () => {
    navigate("/store/admin");
  };
  const handleSignUp = () => {
    mutation.mutate({
      nameStore,
      addressStore,
      avatarStore,
    });
    dispatch(updateUser({ ...data, isStore: true }));
  };

  const handleOnchangeAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setavatarStore(file.preview);
  };
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0, 0, 0, 0.53)",
        height: "100vh",
      }}
    >
      <div
        style={{
          width: "800px",
          height: "445px",
          borderRadius: "6px",
          background: "#fff",
          display: "flex",
        }}
      >
        <WrapperContainerLeft>
          <h1>Xin chào</h1>
          <p>Đăng ký bán hàng </p>
          <InputForm
            style={{ marginBottom: "10px" }}
            placeholder="name"
            value={nameStore}
            onChange={handleOnchangeEmail}
          />
          <div style={{ position: "relative" }}>
            <span
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            ></span>
            <InputForm
              placeholder="address"
              style={{ marginBottom: "10px" }}
              value={addressStore}
              onChange={handleOnchangePassword}
            />
          </div>
          <div style={{ position: "relative" }}>
            <span
              style={{
                zIndex: 10,
                position: "absolute",
                top: "4px",
                right: "8px",
              }}
            ></span>
            <WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
              <Button>Select File</Button>
              {avatarStore && (
                <img
                  src={avatarStore}
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginLeft: "10px",
                  }}
                  alt="avatar"
                />
              )}
            </WrapperUploadFile>
            {/* <InputForm
              placeholder="index.png"
              value={avatarStore}
              onChange={handleOnchangeConfirmPassword}
            /> */}
          </div>
          {data?.status === "ERR" && (
            <span style={{ color: "red" }}>{data?.message}</span>
          )}
          <Loading isLoading={isPending}>
            <ButtonComponent
              disabled={!nameStore.length || !addressStore.length}
              onClick={handleSignUp}
              size={40}
              styleButton={{
                background: "rgb(255, 57, 69)",
                height: "48px",
                width: "100%",
                border: "none",
                borderRadius: "4px",
                margin: "26px 0 10px",
              }}
              textbutton={"Đăng ký"}
              styleTextButton={{
                color: "#fff",
                fontSize: "15px",
                fontWeight: "700",
              }}
            ></ButtonComponent>
          </Loading>
        </WrapperContainerLeft>
        <WrapperContainerRight>
          <Image
            src={imageLogo}
            preview={false}
            alt="iamge-logo"
            height="203px"
            width="203px"
          />
          <h4>Kinh doanh đem</h4>
          <h4> lại lợi nhuận</h4>
        </WrapperContainerRight>
      </div>
    </div>
  );
};

export default SignUpPage;
