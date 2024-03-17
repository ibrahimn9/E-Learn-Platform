import React, { useState } from "react";
import auth from "../services/auth";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const searchParams = new URLSearchParams(window.location.search);
  const token = searchParams.get("token");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match");
    } else {
      try {
        const response = await auth.resetPassword(token, {
          newPassword: password,
        });
        if (response.status >= 200 && response.status < 300) {
          setSuccessMsg(response.data.message);
        }
      } catch (error) {
        if (error.response) {
          setErrorMsg(error.response.data.message);
        }
      }
    }
  };

  return (
    <div className="h-screen w-full auth-bg flex justify-center items-center">
      <div className="h-auto w-[95%] md:w-[70%] lg:w-[42%] flex flex-col items-center mt-[-100px]">
        <h3 className="text-[36px] font-semibold mt-8 text-center">
          Rest Password
        </h3>
        {errorMsg && (
          <div
            class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative mt-10 w-[80%]"
            role="alert"
          >
            <span class="block sm:inline text-sm">{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded relative mt-10 w-[80%]"
            role="alert"
          >
            <span className="block sm:inline text-sm">{successMsg}</span>
          </div>
        )}
        <form
          onSubmit={handleResetPassword}
          className={`${errorMsg || successMsg ? "mt-6" : "mt-12"} w-[80%]`}
        >
          <div>
            <p className="ml-2">Passowrd</p>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 mt-1 rounded-md shadow-sm border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <div className="mt-8">
            <p className="ml-2">Confirm Password</p>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="px-4 py-3 mt-1 rounded-md shadow-sm border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-full"
            />
          </div>
          <button
            type="submit"
            className="py-3 w-full rounded-md bg-blueState text-white font-semibold mt-8 hover:opacity-[0.8] transition-[0.3s]"
          >
            Reset password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
