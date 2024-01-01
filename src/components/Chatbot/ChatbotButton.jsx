import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logomess.png";
const ChatbotButton = () => {
  const [position, setPosition] = useState({ bottom: 10, right: 10 });

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
    <button
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
        width: "5%",
      }}
    >
      <img src={logo} style={{ width: "100%" }} />
    </button>
  );
};

export default ChatbotButton;
