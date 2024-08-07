import React, { useState, useEffect } from "react";
import images from "../../constants/images";
import { PercentageCircle, BarChart } from "../../components";
import axios from "axios";

const Dashboard = ({ users }) => {
  const [counts, setCounts] = useState({
    documentsCount: 0,
    resourcesCount: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      const response = await axios.get(
        "http://localhost:3000/api/v1/teacher/document/counts"
      );
      setCounts(response.data);
    };

    fetchCounts();
  }, []);

  return (
    <div className="bg-[#EFF5FF] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard Title */}
        <h1 className="text-3xl font-bold text-primary mb-8">Dashboard</h1>

        {/* States */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Students */}
          <div className="bg-white max-h-[130px] p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray mb-4">
                Total Students
              </h2>
              <p className="text-3xl font-bold">
                {users?.filter((user) => user.role === "student").length}
              </p>
            </div>
            <img
              src={images.studentIcon}
              className="w-[60px] h-[60px]"
              alt="total_student"
            />
          </div>

          {/* Total Teachers */}
          <div className="bg-white max-h-[130px] p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray mb-4">
                Total Teachers
              </h2>
              <p className="text-3xl font-bold">
                {users?.filter((user) => user.role === "teacher").length}
              </p>
            </div>
            <img
              src={images.teacherIcon}
              className="w-[60px] h-[60px]"
              alt="total_student"
            />
          </div>

          {/* Total Courses */}
          <div className="bg-white max-h-[130px] p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray mb-4">
                Total Documents
              </h2>
              <p className="text-3xl font-bold">{counts.documentsCount}</p>
            </div>
            <img
              src={images.courseIcon}
              className="w-[60px] h-[60px]"
              alt="total_student"
            />
          </div>

          <div className="bg-white max-h-[130px] p-6 rounded-lg shadow-md flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray mb-4">
                Total Resources
              </h2>
              <p className="text-3xl font-bold">{counts.resourcesCount}</p>
            </div>
            <img
              src={images.courseIcon}
              className="w-[60px] h-[60px]"
              alt="total_student"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 w-full mt-8">
          <BarChart users={users} />
          <div className="bg-white p-4 rounded-lg shadow-md h-[300px] sm:h-auto relative">
            <p className="text-primary font-semibold">Active Users</p>
            <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
              <PercentageCircle
                circleSize={120}
                percent={
                  (users.filter((user) => user.isVerified === 1).length * 100) /
                  users.length
                }
                duration={1000}
                offset={100}
                fontColor="rgba(0,0,0,.5)"
                circleColor="#2E86FB"
                circleInnerColor="#DEEBFF"
                circleThickness={140}
              />
            </div>
            <div className="absolute top-[80%] left-1/2 translate-x-[-50%] flex w-full justify-around ">
              <div>
                <div>
                  <span className="w-[8px] h-[8px] bg-[#2E86FB] rounded-full inline-block mr-1" />{" "}
                  <span className="text-gray font-medium">Active</span>
                </div>
                <p className="text-gray font-medium text-center">
                  {(
                    (users.filter((user) => user.isVerified === 1).length *
                      100) /
                    users.length
                  ).toFixed(2)}{" "}
                  %
                </p>
              </div>
              <div>
                <div>
                  <span className="w-[8px] h-[8px] bg-[#DEEBFF] rounded-full inline-block mr-1" />{" "}
                  <span className="text-gray font-medium">Inactive</span>
                </div>
                <p className="text-gray font-medium text-center">
                  {(
                    (users.filter((user) => user.isVerified === 0).length *
                      100) /
                    users.length
                  ).toFixed(2)}{" "}
                  % 
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
