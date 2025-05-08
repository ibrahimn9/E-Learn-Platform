import React, { useState, useEffect } from "react";
import images from "../constants/images";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { ImRadioUnchecked } from "react-icons/im";
import { ImRadioChecked2 } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../context/StateContext";

const CourseSideBar = ({ modules }) => {
  const navigate = useNavigate();
  const { userData } = useStateContext();

  const [visibleDocuments, setVisibleDocuments] = useState({});

  const toggleDocumentVisibility = (chapterId) => {
    setVisibleDocuments((prevState) => ({
      ...prevState,
      [chapterId]: !prevState[chapterId],
    }));
  };

  useEffect(() => {
    if (modules) {
      const firstElementId = modules[0]?.chapters[0]?.id;
      setVisibleDocuments((prevState) => ({
        ...prevState,
        [firstElementId]: true,
      }));
    }
  }, [modules]);

  return (
    <div className="hidden sm:flex fixed left-0 top-0 h-screen  z-[100] bg-white p-4 sm:w-[200px] md:w-[260px] border-r border-gray4 flex flex-col items-center">
      <img
        src={images.logo}
        onClick={() => navigate(`/${userData.role}/${userData.userData?.id}`)}
        className="h-[50px] w-auto cursor-pointer"
        alt="logo"
      />
      <div className="mt-[5vh] overflow-y-auto w-full">
        {modules?.map((module, index) => (
          <div key={index} className="mt-5">
            <p className="text-primary text-lg font-medium">{module?.name}</p>
            {module?.chapters?.map((chapter, index) => (
              <div key={index} className="mt-2 ml-3">
                <div
                  onClick={() => toggleDocumentVisibility(chapter.id)}
                  className="flex items-center gap-2 text-primary cursor-pointer"
                >
                  {visibleDocuments[chapter.id] ? (
                    <FaChevronDown />
                  ) : (
                    <FaChevronRight />
                  )}
                  <p className="">{chapter.title}</p>
                </div>
                {visibleDocuments[chapter.id] &&
                  chapter.documents.map((doc, index) => (
                    <div key={index} className="mt-1 ml-6">
                      <div className="flex items-center gap-2 mb-1 cursor-pointer">
                        <ImRadioUnchecked className="text-gray" />
                        <a
                          href={`http://localhost:3000/${doc.file}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <p className="text-gray">{doc.title}</p>
                        </a>
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseSideBar;
