import React, { useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import images from "../constants/images";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { userData } = useStateContext();

  return (
    <nav className="bg-white shadow-md bg-opacity-98 sticky top-0 z-10">
      <div className=" mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Left side */}
          <div className="flex items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                onClick={() => navigate(`/admin/${userData.userData.id}`)}
                className="h-10 w-auto cursor-pointer"
                src={images.logo}
                alt="Logo"
              />
            </div>
          </div>
          {/* Right side */}
          <div className="flex items-center">
            {/* Navbar Links */}

            {/* User profile */}
            <IoMdNotificationsOutline className="ml-4 text-[25px] text-[#404040] cursor-pointer" />
            <div className="ml-4 relative flex-shrink-0">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-sm rounded-full focus:outline-none focus:shadow-outline"
                id="user-menu"
                aria-label="User menu"
                aria-haspopup="true"
              >
                <div className="h-10 w-10 rounded-full bg-gray4 flex justify-center items-center">
                  {userData.userData?.fullname
                    ? userData.userData?.fullname[0].toUpperCase()
                    : userData.userData?.fullName[0].toUpperCase()}
                  {userData.userData?.fullname
                    ? userData.userData?.fullname.split(" ")[1][0].toUpperCase()
                    : userData.userData?.fullName
                        .split(" ")[1][0]
                        .toUpperCase()}
                </div>
                <div className="px-4 py-2 text-sm text-gray-700 text-left">
                  <p className="font-semibold">{userData.userData?.fullName}</p>
                  <p className="text-xs text-gray-500 capitalize">
                    {userData?.role}
                  </p>
                </div>
              </button>
              {/* User Dropdown */}
              {isOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div
                    className="py-1"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu"
                  >
                    <div className="px-4 py-2 text-sm text-gray-700">
                      <p className="font-semibold">
                        {userData.userData?.fullName}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {userData?.role}
                      </p>
                    </div>
                    {/* Other dropdown items */}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
