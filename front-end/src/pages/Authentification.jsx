import React, { useState, useMemo, useEffect } from "react";
import images from "../constants/images";
import Lottie from "react-lottie";
import animationData from "../constants/emailSent.json";
import { FaArrowLeft } from "react-icons/fa6";
import auth from "../services/auth";
import { useStateContext } from "../context/StateContext";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Authentification = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const navigate = useNavigate();

  const [currPage, setCurrPage] = useState("signin");

  const { userData, setUserData } = useStateContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState();
  const [emailPwd, setEmailPwd] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg();
    try {
      const response = await auth.signIn({ email, password });
      if (response.status >= 200 && response.status < 300) {
        if (response.data.message === "Email Verification Was sent To user")
          setCurrPage("emailsent");
        else {
          Cookies.set("access_token", response.data.token, { expires: 7 });
          navigate(`/${response.data.role}/${response.data.userData.id}`);
          setUserData(response.data);
        }
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      }
    }
  };

  const handleResendEmail = async (e) => {
    setErrorMsg();
    try {
      const response = await auth.resendEmail({ email });
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      }
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setErrorMsg();
      const response = await auth.forgetPassword({ email: emailPwd });
      if (response.status >= 200 && response.status < 300)
        setCurrPage("emailPwdPage");
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      }
    }
  };

  const signinPage = (
    <div className="h-screen w-full auth-bg flex justify-center items-center">
      <div className="h-auto w-[95%] md:w-[70%] lg:w-[42%] flex flex-col items-center mt-[-100px]">
        <img src={images.logo} alt="logo" width={"120px"} />
        {errorMsg && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-10 w-[80%]"
            role="alert"
          >
            <span className="block sm:inline text-sm">{errorMsg}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className={`${errorMsg ? "mt-2" : "mt-14"} w-[80%]`}
        >
          <div>
            <p>School email</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Eg:you@esi-sba.dz"
              className="px-4 py-3 mt-1 rounded-md shadow-sm border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div className="mt-8">
            <p>Password</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 mt-1 rounded-md shadow-sm border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <p
            onClick={() => setCurrPage("resetpassword")}
            className="mt-4 text-primary font-semibold cursor-pointer text-sm ml-1"
          >
            Forgot password
          </p>
          <button
            type="submit"
            className="py-3 w-full rounded-md bg-blueState text-white font-semibold mt-6 hover:opacity-[0.8] transition-[0.3s]"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );

  const emailSentPage = (
    <div className="h-screen w-full auth-bg flex justify-center items-center">
      <div className="h-auto w-[95%] md:w-[70%] lg:w-[42%] flex flex-col items-center mt-[-100px]">
        {errorMsg && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-10 w-[80%]"
            role="alert"
          >
            <span className="block sm:inline text-sm">{errorMsg}</span>
          </div>
        )}
        <div className="max-w-[180px]">
          <Lottie options={defaultOptions} />
        </div>
        <h3 className="text-[36px] font-semibold mt-8">Check your email</h3>
        <p className="text-darkGray2 mt-2">We sent a verification link to</p>
        <p className="text-darkGray2">{email}</p>
        <p className="text-darkGray2 mt-8 ">
          Didn’t receive the email?{" "}
          <a
            className="text-blueState font-semibold cursor-pointer"
            onClick={() => handleResendEmail()}
          >
            Click to resend
          </a>
        </p>
      </div>
    </div>
  );

  const emailPwdPage = (
    <div className="h-screen w-full auth-bg flex justify-center items-center">
      <div className="h-auto w-[95%] md:w-[70%] lg:w-[42%] flex flex-col items-center mt-[-100px]">
        <div className="max-w-[180px]">
          <Lottie options={defaultOptions} />
        </div>
        <h3 className="text-[36px] font-semibold mt-8">Check your email</h3>
        <p className="text-darkGray2 mt-2">We sent a password reset link to</p>
        <p className="text-darkGray2">{emailPwd}</p>
        <p className="text-darkGray2 mt-8 ">
          Didn’t receive the email?{" "}
          <button
            onClick={(e) => handleResetPassword(e)}
            className="text-blueState font-semibold cursor-pointer"
          >
            Click to resend
          </button>
        </p>
        <button
          onClick={() => setCurrPage("signin")}
          className="flex items-center gap-2 text-darkGray2 font-medium cursor-pointer mt-8"
        >
          <FaArrowLeft className="mt-1" /> <p>back to login</p>
        </button>
      </div>
    </div>
  );

  const resetPasswordPage = (
    <div className="h-screen w-full auth-bg flex justify-center items-center">
      <div className="h-auto w-[95%] md:w-[70%] lg:w-[42%] flex flex-col items-center">
        <h3 className="text-[36px] font-semibold mt-8 text-center">
          Forgot password?
        </h3>
        <p className="text-darkGray2 mt-1 text-center">
          No worries! Just enter your email address and we'll help you reset it
        </p>
        {errorMsg && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-10 w-[80%]"
            role="alert"
          >
            <span className="block sm:inline text-sm">{errorMsg}</span>
          </div>
        )}
        <form
          onSubmit={handleResetPassword}
          className={`${errorMsg ? "mt-2" : "mt-10"} w-[80%]`}
        >
          <div>
            <p className="ml-2">Email</p>
            <input
              type="email"
              value={emailPwd}
              onChange={(e) => setEmailPwd(e.target.value)}
              placeholder="Enter your email"
              className="px-4 py-3 mt-1 rounded-md shadow-sm border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <button
            type="submit"
            className="py-3 w-full rounded-md bg-blueState text-white font-semibold mt-6 hover:opacity-[0.8] transition-[0.3s]"
          >
            Reset password
          </button>
        </form>
        <button
          onClick={() => setCurrPage("signin")}
          className="flex items-center gap-2 text-darkGray2 font-medium cursor-pointer mt-8"
        >
          <FaArrowLeft className="mt-1" /> <p>back to login</p>
        </button>
      </div>
    </div>
  );

  switch (currPage) {
    case "signin":
      return signinPage;
    case "emailsent":
      return emailSentPage;
    case "emailPwdPage":
      return emailPwdPage;
    case "resetpassword":
      return resetPasswordPage;
    default:
      return signinPage;
  }
};

export default Authentification;
