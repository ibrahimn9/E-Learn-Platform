import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import auth from "../services/auth";
import { useStateContext } from "../context/StateContext";

const Landing = () => {
  const navigate = useNavigate();
  const token = Cookies.get("access_token");

  const { setUserData } = useStateContext();
  const sendToken = async () => {
    try {
      const response = await auth.verifyToken({ token });
      if (response.status >= 200 && response.status < 300)
        setUserData(response.data);
      navigate(`/${response.data.role}/${response.data.userData.id}`);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  useEffect(() => {
    if (token) {
      sendToken();
    }
  }, []);

  return <div className="text-red-500">Landing</div>;
};

export default Landing;
