import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logomess.png";
import logo1 from "./chatbot (1).png";
// import "./index.js";
import "./index.css";
const ChatbotButton = () => {
  const [position, setPosition] = useState({ bottom: 10, right: 10 });
  const [isOpen, setIsOpen] = useState(false);
  const handelClick = () => {
    setIsOpen(true);
  };
  const handelClickClose = () => {
    setIsOpen(false);
  };
  useEffect(() => {
    const handleScroll = () => {
      const { scrollY, scrollX } = window;
      setPosition({ bottom: 10, right: 10 });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <button
        onclick={() => handelClick()}
        style={{
          position: "fixed",
          bottom: position.bottom,
          right: position.right,
          padding: "10px",
          backgroundColor: "#ffffff",
          color: "#ffffff",
          border: "none",
          borderRadius: "50%",
          cursor: "pointer",
          width: "4%",
        }}
      >
        <img src={logo} style={{ width: "100%" }} />
      </button>
      {!isOpen && (
        <button
          onclick={handelClickClose}
          style={{
            position: "fixed",
            bottom: position.bottom,
            right: position.right,
            padding: "10px",
            backgroundColor: "#ffffff",
            color: "#ffffff",
            border: "none",
            borderRadius: "50%",
            cursor: "pointer",
            width: "4%",
          }}
        >
          <img src={logo} style={{ width: "100%" }} />
        </button>
      )}
      {isOpen && (
        <div
          id="test"
          style={{
            position: "fixed",
            top: "12rem",
            right: "1rem",
          }}
        >
          <div class="child" id="chatbot">
            <div class="header1">
              <div class="h-child">
                <img src={logo1} id="avatar" />
                <div>
                  <span class="name">Chatbot</span>
                  <span style={{ color: "lawngreen" }}>online</span>
                </div>
              </div>
              <div>
                <button class="refBtn">
                  <i class="fa fa-refresh" onclick="initChat()"></i>
                </button>
              </div>
            </div>

            <div id="chat-box"></div>
            <div class="footer1"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotButton;
