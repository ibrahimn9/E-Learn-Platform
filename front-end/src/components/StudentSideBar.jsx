import React, { useState } from "react";
import images from "../constants/images";

import { BiSolidDashboard } from "react-icons/bi";
import { IoDocumentText } from "react-icons/io5";
import { MdVideoLibrary } from "react-icons/md";
import { BsFolderSymlinkFill } from "react-icons/bs";
import { MdWorkHistory } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi2";
import { IoLogOut } from "react-icons/io5";

import { useStateContext } from "../context/StateContext";
import { IoClose } from "react-icons/io5";

import { useNavigate } from "react-router-dom";

import Cookies from "js-cookie";

const StudentSideBar = () => {
  const { selectedItem, setSelectedItem } = useStateContext();
  const { userData } = useStateContext();

  const logOut = () => {
    Cookies.set("access_token", "");
    navigate(`/auth`);
  };

  const sideBarItems = [
    {
      name: "Homepage",
      icon: <BiSolidDashboard />,
      route: `/student/${userData.userData?.id}`,
    },
    { name: "Assignments", icon: <MdWorkHistory /> },
  ];

  const navigate = useNavigate();
  return (
    <div className="hidden sm:flex fixed left-0 top-0 h-screen z-[100] bg-white p-4 sm:w-[200px] md:w-[260px] border-r border-gray4 flex flex-col items-center">
      <img
        src={images.logo}
        className="h-[50px] w-auto cursor-pointer"
        alt="logo"
      />
      <div className="mt-[10vh] w-full">
        {sideBarItems.map((item, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedItem(index);
              navigate(item.route);
            }}
            className={`py-2 sm:px-6 md:px-[25%] flex items-center rounded-md gap-3 text-md cursor-pointer transition-colors duration-300 font-medium  ${
              selectedItem === index ? "bg-blueState text-white" : "text-gray4"
            } mb-5 hover:bg-blueState hover:text-white`}
          >
            <div>{item.icon}</div>
            <p className="">{item.name}</p>
          </div>
        ))}
      </div>
      <div
        onClick={() => logOut()}
        className="py-2 mt-[30vh] flex items-center justify-center rounded-md gap-3 text-md cursor-pointer font-medium text-gray4"
      >
        <div>
          <IoLogOut />
        </div>
        <p>Logout</p>
      </div>
    </div>
  );
};

export default StudentSideBar;
