import React, { useState, useEffect } from "react";
import { CourseSideBar, TeacherNav } from "../../components";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import images from "../../constants/images";
import { useStateContext } from "../../context/StateContext";
import teacher from "../../services/teacher";
import { useParams } from "react-router-dom";

const CourseManagement = () => {
  const { userData } = useStateContext();
  const { refetchTModules, setRefetchTModules } = useStateContext();
  const { id } = useParams();

  const [modules, setModules] = useState([]);

  // fetch modules
  const fetchModules = async () => {
    const res = await teacher.getMyModules(id);
    setModules(res.data);
  };

  useEffect(() => {
    fetchModules();
  }, [refetchTModules]);

  // add chapter

  const [showModal, setShowModal] = useState(false);

  const [moduleId, setModuleId] = useState("");

  const handleAddChapterClick = (id) => {
    setShowModal(true);
    setModuleId(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleAddChapter = async (e, id) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const res = await teacher.insertChapter(id, {
        title,
        description,
      });
      if (res.status >= 200 && res.status < 300) {
        setSuccessMsg(res.data.message);
        setRefetchTModules(!refetchTModules);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      }
    }
  };

  // add document

  const [showBox, setShowBox] = useState(false);
  const [newDoc, setNewDoc] = useState({});
  const [errorMsg1, setErrorMsg1] = useState();
  const [successMsg1, setSuccessMsg1] = useState();
  const [chapterId, setChapterId] = useState();

  const handleEditClick = (id) => {
    setShowBox(true);
    setChapterId(id);
  };

  const handleCloseEdit = () => {
    setShowBox(false);
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setErrorMsg1();
    setSuccessMsg1();
    try {
      const formData = new FormData();
      formData.append("file", newDoc.file); // Append the file here
      formData.append("title", newDoc.title); // Append other form data if needed
      formData.append("description", newDoc.description);
      formData.append("type", newDoc.type);
      const response = await teacher.insertDocument(chapterId, formData);
      if (response.status >= 200 && response.status < 300) {
        setSuccessMsg1(response.data.message);
        setRefetchTModules(!refetchTModules);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg1(error.response.data.msg);
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
      "Are you sure you want to delete this chapter?"
    );
    if (confirmDelete) {
      try {
        const res = await teacher.deleteChapter(id);
        handleSuccessPopup(res.data.message);
        setRefetchTModules(!refetchTModules);
      } catch (error) {
        handleErrorPopup("Error deleting teacher:", error);
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
      <CourseSideBar modules={modules} />
      <div className="relative sm:ml-[200px] md:ml-[260px]">
        <TeacherNav />
        <div className="px-2 md:px-6">
          {modules.map((module, ix) => (
            <div key={ix} className="mt-6 mb-[100px]">
              <h1 className="text-2xl font-bold text-primary mb-4 break-words">
                {module.name}
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-2">
                {module.chapters.map((chapter, index) => (
                  <div
                    key={index}
                    className="py-4 px-6 sm:px-2 md:px-10 bg-white rounded-md"
                  >
                    <p className="font-medium">{chapter.title}</p>

                    <div className="mb-8 mt-4 ml-2 min-h-[120px]">
                      {chapter.documents.map((doc, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-primary text-md cursor-pointer"
                        >
                          <FaChevronRight />
                          <a
                            href={`http://localhost:3000/${doc.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <p>{doc.title}</p>
                          </a>
                        </div>
                      ))}
                    </div>
                    {userData.userData?.id === module.idEditor && (
                      <div className="flex justify-between items-center">
                        <button
                          onClick={() => handleEditClick(chapter.id)}
                          className="basis-[45%] text-sm py-2 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]"
                        >
                          Insert
                        </button>
                        <button
                          onClick={() => handleDeleteClick(chapter.id)}
                          className="basis-[45%] text-sm py-2 border border-[#B34168]  text-[#B34168] rounded-md font-medium hover:opacity-[0.8]"
                        >
                          Delete chapter
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {userData.userData.id === module.idEditor && (
                  <div className="relative py-4 px-6 sm:px-2 md:px-10 min-h-[280px] bg-white border border-dashed border-gray4 rounded-md flex flex-col items-center">
                    <p className="font-medium">Add New Chapter</p>
                    <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] cursor-pointer">
                      <img
                        src={images.addElps}
                        onClick={() => handleAddChapterClick(module.id)}
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
            <h2 className="text-2xl font-bold text-primary mb-4">
              Add Chapter
            </h2>
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
                Enter the chapter title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <div className="mb-8">
              <label
                htmlFor="description"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the chapter description
              </label>
              <input
                type="text"
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => handleAddChapter(e, moduleId)}
                disabled={!title || !description}
                className={`px-4 py-2 ${
                  !title || !description ? "opacity-50" : "opacity-100"
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
      {showBox && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-[100]">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[40%]">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Insert Document
            </h2>
            {errorMsg1 && (
              <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative my-2 w-full"
                role="alert"
              >
                <span class="block sm:inline text-sm">{errorMsg1}</span>
              </div>
            )}
            {successMsg1 && (
              <div
                className="bg-green-100 w-full border border-green-400 text-green-700 px-4 py-2 rounded relative my-2"
                role="alert"
              >
                <span className="block sm:inline text-sm">{successMsg1}</span>
              </div>
            )}
            <div className="mb-4">
              <label
                htmlFor="title"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the document title
              </label>
              <input
                type="text"
                id="title"
                value={newDoc.title}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, title: e.target.value })
                }
                placeholder="Enter title"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="description"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the document description
              </label>
              <input
                type="text"
                id="description"
                value={newDoc.description}
                onChange={(e) =>
                  setNewDoc({ ...newDoc, description: e.target.value })
                }
                placeholder="Enter description"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <select
              name="type"
              value={newDoc.type}
              onChange={(e) => setNewDoc({ ...newDoc, type: e.target.value })}
              className="w-full px-4 py-2  border flex justify-between items-center mb-4 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
            >
              <option value="">Type</option>
              <option value="COUR">COUR</option>
              <option value="TD">TD</option>
              <option value="TP">TP</option>
            </select>
            <label className="w-full px-4 py-2  border flex gap-2 items-center mb-4 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]">
              <img src={images.uploadIcon} alt="upload" />
              Import document file
              <input
                type="file"
                onChange={(e) =>
                  setNewDoc({ ...newDoc, file: e.target.files[0] })
                }
                className="hidden"
              />
            </label>

            <div className="flex items-center justify-between">
              <button
                onClick={(e) => handleEdit(e)}
                className="px-4 py-2 bg-blueState text-white rounded-md font-semibold hover:opacity-80"
              >
                Add
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md font-semibold hover:opacity-80"
                onClick={handleCloseEdit}
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

export default CourseManagement;
