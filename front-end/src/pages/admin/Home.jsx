import React from "react";

import Dashboard from "./Dashboard";
import images from "../../constants/images";
import { useNavigate } from "react-router-dom";
import { AdminNav } from "../../components";
import { useStateContext } from "../../context/StateContext";

const Home = () => {
  const navigate = useNavigate();
  const { userData } = useStateContext();
  return (
    <div className="h-auto bg-[#EFF5FF]">
      <AdminNav />
      <Dashboard />
      <div className="max-w-7xl mx-auto mt-10 px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-4">
          Manage Users & Cohorts
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full pt-6 border-t-[2px] border-gray5">
          <div
            onClick={() => navigate(`/admin/${userData.userData.id}/manage-teachers`)}
            className="bg-white rounded-md px-6 py-4 border border-[#D8D8D8] flex gap-6 items-center cursor-pointer"
          >
            <img src={images.addIcon} alt="addIcon" />
            <div>
              <p className="text-blueState font-semibold text-lg">
                Add and manage teachers
              </p>
              <p className="text-primary text-sm">
                Add by yourself or import from CSV
              </p>
            </div>
          </div>
          <div
            onClick={() => navigate(`/admin/${userData.userData.id}/manage-students`)}
            className="bg-white rounded-md px-6 py-4 border border-[#D8D8D8] flex gap-6 items-center cursor-pointer"
          >
            <img src={images.addIcon} alt="addIcon" />
            <div>
              <p className="text-blueState font-semibold text-lg">
                Add and manage students
              </p>
              <p className="text-primary text-sm">
                Add by yourself or import from CSV
              </p>
            </div>
          </div>
          <div
            onClick={() => navigate(`/admin/${userData.userData.id}/manage-cohorts`)}
            className="bg-white rounded-md px-6 py-4 border border-[#D8D8D8] flex gap-6 items-center cursor-pointer"
          >
            <img src={images.addIcon} alt="addIcon" />
            <div>
              <p className="text-blueState font-semibold text-lg">
                Create cohort
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
