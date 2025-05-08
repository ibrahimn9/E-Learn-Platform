import React, { useState, useEffect } from "react";
import { TeacherSideBar, TeacherNav } from "../../components";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import images from "../../constants/images";
import { useStateContext } from "../../context/StateContext";
import teacher from "../../services/teacher";
import { useParams } from "react-router-dom";
import mooc from "../../services/mooc";

const MoocManagement = () => {
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

  // add mooc

  const [showModal, setShowModal] = useState(false);

  const [idModule, setIdModule] = useState("");

  const handleAddMoocClick = (id) => {
    setShowModal(true);
    setIdModule(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [file, setFile] = useState();

  const handleAddMooc = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const formData = new FormData();
      formData.append("mooc", file); // Append the file here
      formData.append("videoTitle", videoTitle); // Append other form data if needed
      formData.append("videoDescription", videoDescription);
      formData.append("idModule", idModule);
      const response = await mooc.insertMooc(formData);
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

  //error handling
  const [errorText, setErrorText] = useState("");
  const [errorToggle, setErrorToggle] = useState(false);
  const handleErrorPopup = (text) => {
    setErrorText(text);
    setErrorToggle(true);
    setTimeout(() => {
      setErrorToggle(false);
    }, 3000);
  };

  //success handling
  const [successText, setSuccessText] = useState("");
  const [successToggle, setSuccessToggle] = useState(false);
  const handleSuccessPopup = (text) => {
    setSuccessText(text);
    setSuccessToggle(true);
    setTimeout(() => {
      setSuccessToggle(false);
    }, 3000);
  };

  // delete chapter
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this mooc?"
    );
    if (confirmDelete) {
      try {
        const res = await mooc.deleteMooc(id);
        handleSuccessPopup(res.data.message);
        setRefetchTModules(!refetchTModules);
      } catch (error) {
        handleErrorPopup("Error deleting mooc:", error);
      }
    }
  };

  return (
    <div className="relative min-h-screen pb-10 bg-[#EFF5FF] w-full overflow-hidden">
      {errorToggle && (
        <div className="px-4 py-1 bg-red-200 text-[#242B2E] absolute top-[50%] z-[90] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md shadow-md">
          <p>{errorText}</p>
        </div>
      )}
      {successToggle && (
        <div className="px-4 py-1 bg-green-200 text-[#242B2E] absolute top-[50%] z-[90] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md shadow-lg">
          <p>{successText}</p>
        </div>
      )}
      <TeacherSideBar />
      <div className="relative sm:ml-[200px] md:ml-[260px]">
        <TeacherNav />
        <div className="px-2 md:px-6">
          {modules.map((module, index) => (
            <div key={index} className="mt-6 mb-[100px]">
              <h1 className="text-2xl font-bold text-primary mb-4">
                {module.name}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-2">
                {module.moocs.map((mooc, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-md shadow-md flex flex-col justify-between"
                  >
                    <div className="relative">
                      <img src={images.mooc} className="w-full" alt="mooc" />
                      <img
                        src={images.playBtn}
                        alt="play"
                        className="cursor-pointer hover:opacity-[0.8] absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%]"
                      />
                    </div>
                    <p className="pt-2 font-medium">{mooc.title}</p>
                    <p className="text-gray4 pb-4 text-sm">
                      {mooc.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <a
                        href={`http://localhost:3000${mooc.link}`}
                        target="_blank"
                        className="basis-[45%] flex justify-center items-center text-sm py-2 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]"
                      >
                        View
                      </a>
                      {userData.userData?.id === module.idEditor && (
                        <button
                          onClick={() => handleDeleteClick(mooc.id)}
                          className="basis-[45%] text-sm py-2 border border-[#B34168] bg-[#B34168] text-white rounded-md font-medium hover:opacity-[0.8]"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {userData.userData.id === module.idEditor && (
                  <div className="relative py-4 px-6 sm:px-2 md:px-10 min-h-[280px] bg-white border border-dashed border-gray4 rounded-md flex flex-col items-center">
                    <p className="font-medium">Add New MOOC</p>
                    <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] cursor-pointer">
                      <img
                        src={images.addElps}
                        onClick={() => handleAddMoocClick(module.id)}
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
            <h2 className="text-2xl font-bold text-primary mb-4">Add Mooc</h2>
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
                Enter the Mooc title
              </label>
              <input
                type="text"
                id="title"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the Mooc description
              </label>
              <input
                type="text"
                id="description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <label className="w-full px-4 py-2  border flex gap-2 items-center mb-8 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]">
              <img src={images.uploadIcon} alt="upload" />
              Import vidoeo file
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="hidden"
                accept="video/*"
              />
            </label>
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => handleAddMooc(e)}
                disabled={!videoTitle || !videoDescription || !file}
                className={`px-4 py-2 ${
                  !videoTitle || !videoDescription || !file
                    ? "opacity-50"
                    : "opacity-100"
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

export default MoocManagement;
