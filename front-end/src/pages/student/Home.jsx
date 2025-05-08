import React, { useEffect, useState } from "react";
import { TeacherNav, StudentSideBar } from "../../components";
import { useStateContext } from "../../context/StateContext";
import images from "../../constants/images";
import student from "../../services/student";
import cohort from "../../services/cohort";
import { useParams, useNavigate } from "react-router-dom";

const Home = () => {
  const { userData } = useStateContext();
  console.log(userData)
  const { id } = useParams();

  const navigate = useNavigate();

  // fetch modules

  const [modules, setModules] = useState([]);

  const fetchModules = async () => {
    const res = await student.getModulesByStudentId(id);

    const sortedModules = res.data.sort((a, b) => {
      if (a.semester === "S1" && b.semester === "S2") {
        return -1;
      }
      if (a.semester === "S2" && b.semester === "S1") {
        return 1;
      }
      return 0;
    });
    setModules(sortedModules);
  };

  useEffect(() => {
    fetchModules();
  }, []);

  return (
    <div className="h-auto pb-8 bg-[#EFF5FF]">
      <StudentSideBar />
      <div className="relative sm:ml-[200px] md:ml-[260px]">
        <TeacherNav />
        <div className="px-2 md:px-6">
          <div className="flex gap-2 mt-6">
            <div className="basis-[70%] flex-grow">
              <h1 className="text-2xl font-bold text-gray mb-4">My Courses</h1>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-2">
                {modules.map((module, index) => (
                  <div
                    key={index}
                    onClick={() =>
                      navigate(`/student/${id}/module/${module.id}`)
                    }
                    className="cursor-pointer p-4 bg-white rounded-md shadow-md"
                  >
                    <img src={images.mooc} className="w-full" alt="mooc" />
                    <p className="pt-4 pb-2 font-medium text-primary text-center">
                      {module.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="hidden lg:block basis-[28%]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
