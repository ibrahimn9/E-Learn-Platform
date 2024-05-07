import React, { useState, useEffect } from "react";
import { TeacherSideBar, TeacherNav } from "../../components";
import { useStateContext } from "../../context/StateContext";
import teacher from "../../services/teacher";
import resource from "../../services/resource";
import { useParams } from "react-router-dom";

import { RiPlayList2Fill } from "react-icons/ri";
import { FaYoutube } from "react-icons/fa";
import { BiSolidUserRectangle } from "react-icons/bi";
import { FaLink } from "react-icons/fa";
import images from "../../constants/images";

const Resource = () => {
  const { setSelectedItem } = useStateContext();
  const { userData } = useStateContext();

  const [selectedType, setSelectedType] = useState();

  const types = [
    { name: "ytVd", icon: <FaYoutube /> },
    { name: "ytPl", icon: <RiPlayList2Fill /> },
    { name: "ytCh", icon: <BiSolidUserRectangle /> },
    { name: "ot", icon: <FaLink /> },
  ];

  useEffect(() => {
    setSelectedItem(3);
  }, []);

  const { id } = useParams();

  const { refetchTModules, setRefetchTModules } = useStateContext();

  const [modules, setModules] = useState([]);

  // fetch modules
  const fetchModules = async () => {
    try {
      const res = await teacher.getMyModules(id);
      const modulesData = await Promise.all(
        res.data.map(async (module) => {
          const resourcesRes = await resource.getResourcesByModule(module.id);
          module.resources = resourcesRes.data.data;
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

  // add resource

  const [showModal, setShowModal] = useState(false);

  const [idModule, setIdModule] = useState("");

  const handleAddResourceClick = (id) => {
    setShowModal(true);
    setIdModule(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [type, setType] = useState("");

  const handleAddResource = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const response = await resource.createResource({
        idModule,
        description,
        link,
        type,
      });
      if (response.status >= 200 && response.status < 300) {
        setSuccessMsg(response.data.message);
        setRefetchTModules(!refetchTModules);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.msg);
      }
    }
  };


  return (
    <div className="relative min-h-screen pb-10 bg-[#EFF5FF] w-full overflow-hidden">
      <TeacherSideBar />
      <div className="relative sm:ml-[200px] md:ml-[260px]">
        <TeacherNav />
        <div className="px-2 md:px-6">
          {modules?.map((module, index) => (
            <div key={index} className="mt-6 mb-[100px]">
              <h1 className="text-2xl font-bold text-primary mb-4">
                {module.name}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-2">
                {module.resources.map((resource, index) => (
                  <div key={index} className="relative">
                    <div className="absolute flex justify-center items-center w-[50px] h-[50px] rounded-full bg-primary text-white text-[25px] left-[95%] top-0 translate-x-[-50%] translate-y-[-50%]">
                      {types.find((type) => type.name === resource.type)?.icon}
                    </div>
                    <div className="bg-blueState rounded-t-md p-4 h-1/2 w-full">
                      <a href={resource.link} target="_blank">
                        <p className="text-white underline cursor-pointer max-w-[85%] break-words">
                          {resource.link}
                        </p>
                      </a>
                    </div>
                    <div className="bg-white rounded-b-md p-4 h-1/2 w-full">
                      <p>{resource.description}</p>
                    </div>
                  </div>
                ))}

                {userData.userData?.id === module.idEditor && (
                  <div className="relative py-4 px-6 sm:px-2 md:px-10 min-h-[280px] bg-white border border-dashed border-gray4 rounded-md flex flex-col items-center">
                    <p className="font-medium">Add New Resource</p>
                    <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] cursor-pointer">
                      <img
                        src={images.addElps}
                        onClick={() => handleAddResourceClick(module.id)}
                        alt="add-chapter"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-[100]">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[40%]">
            <h2 className="text-2xl font-bold text-primary mb-4">Add Resource</h2>
            {errorMsg && (
              <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative my-2 w-full"
                role="alert"
              >
                <span class="block sm:inline text-sm">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div
                className="bg-green-100 w-full border border-green-400 text-green-700 px-4 py-2 rounded relative my-2"
                role="alert"
              >
                <span className="block sm:inline text-sm">{successMsg}</span>
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the Resource description
              </label>
              <input
                type="text"
                id="title"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="link"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the link
              </label>
              <input
                type="text"
                id="link"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Enter link"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <select
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-4 py-2  border flex justify-between items-center mb-8 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
            >
              <option value="">Type</option>
              <option value="ytCh">Youtube Channel</option>
              <option value="ytPl">Youtube Playlist</option>
              <option value="ytVd">Youtube Video</option>
              <option value="ot">Others</option>
            </select>
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => handleAddResource(e)}
                disabled={!description || !link || !type}
                className={`px-4 py-2 ${
                  !description || !link || !type ? "opacity-50" : "opacity-100"
                } bg-blueState text-white rounded-md font-semibold`}
              >
                Add
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md font-semibold hover:opacity-80"
                onClick={handleCloseModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Resource;
