import React, { useState, useEffect } from "react";
import { TeacherSideBar, TeacherNav } from "../../components";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import images from "../../constants/images";
import { useStateContext } from "../../context/StateContext";
import teacher from "../../services/teacher";
import { useParams } from "react-router-dom";
import mooc from "../../services/mooc";

const CreateQuiz = () => {


  const { setSelectedItem } = useStateContext();

  useEffect(() => {
    setSelectedItem(2);
  }, []);

  const { userData } = useStateContext();
  const { refetchTModules, setRefetchTModules } = useStateContext();
  const { id } = useParams();


  const [modules, setModules] = useState([]);

  // fetch modules
  const fetchModules = async () => {
    try {
      const res = await teacher.getMyModules(id);
      const modulesData = await Promise.all(
        res.data.map(async (module) => {
          const moocsRes = await mooc.getMoocsByModule(module.id);
          module.moocs = moocsRes.data.data;
          return module;
        })
      );
      setModules(modulesData);
    } catch (error) {
      console.error("Error fetching modules and moocs:", error);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [refetchTModules]);







  return (
    <div>
      <TeacherSideBar />
      <div className="relative sm:ml-[200px] md:ml-[260px]">
        <TeacherNav />
        <div className="px-2 md:px-6">
             
        </div>
      </div>
    </div>
  )
}

export default CreateQuiz