import React, { useEffect, useState } from "react";
import {
  TeacherNav,
  StudentSideBar,
  MoocDetail,
  ResourceDetail,
  QuizDetail,
} from "../../components";
import { useStateContext } from "../../context/StateContext";
import images from "../../constants/images";
import student from "../../services/student";
import cohort from "../../services/cohort";
import teacher from "../../services/teacher";
import { useParams } from "react-router-dom";
import { CourseSideBar, DocumentDetails } from "../../components";
import module from "../../services/module";
import mooc from "../../services/mooc";
import resource from "../../services/resource";
import quiz from "../../services/quiz";

const Module = () => {
  // fetch modules

  const [moduleData, setModuleData] = useState();

  const { id } = useParams();

  const fetchModule = async () => {
    const res = await module.getModuleById(id);
    let moduleData = res.data.data;

    const moocsRes = await mooc.getMoocsByModule(id);
    moduleData.moocs = moocsRes.data.data;

    const chaptersRes = await teacher.getChaptersByModuleId(id);
    moduleData.chapters = chaptersRes.data;

    const resourcesRes = await resource.getResourcesByModule(id);
    moduleData.resources = resourcesRes.data.data;

    const quizRes = await quiz.getQuizByModule(id)
    moduleData.quiz = quizRes.data

    setModuleData(moduleData);
  };

  const [selectedItem, setSelectedItem] = useState("Documents page");

  const items = ["Documents page", "MOOC", "Quiz", "Resources"];

  useEffect(() => {
    fetchModule();
  }, []);

  return (
    <div className="relative min-h-screen pb-10 bg-[#EFF5FF] w-full overflow-hidden">
      <CourseSideBar modules={[moduleData]} />
      <div className="relative sm:ml-[200px] md:ml-[260px]">
        <TeacherNav />
        <div className="px-2 md:px-6">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-primary mb-6">
              {moduleData?.name}
            </h1>
            <div className="flex justify-between lg:justify-around  border-gray4 border-b-[3px] w-full">
              {items.map((item) => (
                <div
                  onClick={() => setSelectedItem(item)}
                  className={`${
                    selectedItem === item
                      ? "text-blueState border-b-[4px] border-blueState pb-2 mb-[-3px]"
                      : "text-gray"
                  } cursor-pointer font-medium text-center`}
                >
                  {item}
                </div>
              ))}
            </div>
            {selectedItem === "Documents page" && (
              <DocumentDetails chapters={moduleData?.chapters} />
            )}
            {selectedItem === "MOOC" && (
              <MoocDetail moocs={moduleData?.moocs} />
            )}
            {selectedItem === "Resources" && (
              <ResourceDetail resources={moduleData?.resources} />
            )}
            {selectedItem === "Quiz" && (
              <QuizDetail quiz={moduleData.quiz} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Module;
