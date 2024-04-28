import React, { useState, useEffect, useRef } from "react";
import { AdminNav, ModuleTable } from "../../components";
import { IoSearchOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa6";
import images from "../../constants/images";
import cohort from "../../services/cohort";
import { useStateContext } from "../../context/StateContext";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import users from "../../services/users";
import admin from "../../services/admin";
import _class from "../../services/class";
import useClickOutside from "../../hooks/useClickOutside";
import module from "../../services/module";

const CreateModules = () => {
  const { refetchModules, setRefetchModules } = useStateContext();

  // fetch teachers

  const [allTeachers, setAllTeachers] = useState([]);

  const fetchTeachers = async () => {
    const res = await users.getAll("teacher");
    setAllTeachers(res.data);
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  //fetch classes
  const [allClasses, setAllClasses] = useState([]);

  const fetchClasses = async () => {
    const res = await _class.getAll();
    setAllClasses(res.data.data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // filter teachers
  const [searchTeacher, setSearchTeacher] = useState("");

  const filtredTeachers = allTeachers.filter((teacher) => {
    return (
      !searchTeacher ||
      teacher.fullName.toLowerCase().includes(searchTeacher.toLowerCase())
    );
  });

  // filter editor
  const [searchEditor, setSearchEditor] = useState("");

  const filtredEditors = allTeachers.filter((teacher) => {
    return (
      !searchEditor ||
      teacher.fullName.toLowerCase().includes(searchEditor.toLowerCase())
    );
  });

  // add module
  const [showModal, setShowModal] = useState(false);

  const handleAddModuleClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [name, setName] = useState("");
  const [semester, setSemester] = useState([]);
  const [description, setDescription] = useState("");
  const [editor, setEditor] = useState("");
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const handleCreateModule = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const response = await module.createModule({
        name,
        semester,
        description,
        editor,
        classes,
        teachers,
      });
      if (response.status >= 200 && response.status < 300) {
        setSuccessMsg(response.data.message);
        setRefetchModules(!refetchModules);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      }
    }
  };

  //add teachers
  const [teachersToggle, setTeachersToggle] = useState(false);
  const [classToggle, setClassToggle] = useState(false);
  const [editorToggle, setEditorToggle] = useState(false);

  const teachersRef = useRef();
  useClickOutside(teachersRef, () => {
    setTeachersToggle(false);
  });

  const editorRef = useRef();
  useClickOutside(editorRef, () => {
    setEditorToggle(false);
  });

  const classRef = useRef();
  useClickOutside(classRef, () => {
    setClassToggle(false);
  });

  return (
    <div className="min-h-screen bg-[#EFF5FF] overflow-hidden">
      <AdminNav />
      <div className="max-w-7xl mx-auto mt-10 px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-16">
          Module Management
        </h1>
        <div className="mx-auto max-w-xl flex items-center justify-center gap-6 mb-8">
          <button
            onClick={handleAddModuleClick}
            className="flex items-center gap-2 px-4 py-2 bg-blueState border border-blueState  text-white rounded-md font-semibold hover:opacity-[0.8]"
          >
            <FaPlus />
            Add module
          </button>
        </div>
        <ModuleTable allTeachers={allTeachers} classes={allClasses} />
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-20">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[40%]">
            <h2 className="text-2xl font-bold text-primary mb-4">Add Module</h2>
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
                htmlFor="module"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the Module name
              </label>
              <input
                type="text"
                id="module"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter module name"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="des"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the description
              </label>
              <input
                type="text"
                id="des"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter description"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <select
              name="semester"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full px-4 py-2  border flex justify-between items-center mb-4 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
            >
              <option value="">Semester</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
            </select>
            <div className="relative" ref={editorRef}>
              <button
                onClick={() => setEditorToggle(!editorToggle)}
                className="w-full px-4 py-2  border flex justify-between items-center mb-4 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              >
                Editor
                {!editorToggle ? (
                  <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
                ) : (
                  <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
                )}
              </button>
              {editorToggle && (
                <div
                  className="absolute w-[100%] bg-white rounded-lg z-[150] top-[115%] left-0 overflow-y-auto"
                  style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
                >
                  <div className="p-2">
                    <div className="flex rounded-md border border-[#D5D5D5] px-2 items-center gap-1 cursor-text text-sm overflow-hidden">
                      <div className="w-5">
                        <IoSearchOutline className="text-[#979797] text-xl" />
                      </div>
                      <input
                        placeholder="search teacher"
                        value={searchEditor}
                        onChange={(e) => setSearchEditor(e.target.value)}
                        className="h-10 outline-none border-none placeholder:capitalize max-w-[80%]"
                        autoFocus={editorRef}
                      />
                    </div>
                  </div>
                  <div className="max-h-[160px] min-h-[160px] overflow-y-auto pt-1">
                    {filtredEditors.map((teacher, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          editor === teacher.id
                            ? setEditor("")
                            : setEditor(teacher.id);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                      >
                        {editor === teacher.id ? (
                          <img src={images.check} alt="check" />
                        ) : (
                          <img src={images.notcheck} alt="notcheck" />
                        )}
                        <div>
                          {teacher.id} - {teacher.fullName.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={teachersRef}>
              <button
                onClick={() => setTeachersToggle(!teachersToggle)}
                className="w-full px-4 py-2  border flex justify-between items-center mb-4 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              >
                Teachers
                {!teachersToggle ? (
                  <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
                ) : (
                  <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
                )}
              </button>
              {teachersToggle && (
                <div
                  className="absolute w-[100%] bg-white rounded-lg z-[150] top-[115%] left-0 overflow-y-auto"
                  style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
                >
                  <div className="p-2">
                    <div className="flex rounded-md border border-[#D5D5D5] px-2 items-center gap-1 cursor-text text-sm overflow-hidden">
                      <div className="w-5">
                        <IoSearchOutline className="text-[#979797] text-xl" />
                      </div>
                      <input
                        placeholder="search teacher"
                        value={searchTeacher}
                        onChange={(e) => setSearchTeacher(e.target.value)}
                        className="h-10 outline-none border-none placeholder:capitalize max-w-[80%]"
                        autoFocus={teachersToggle}
                      />
                    </div>
                  </div>
                  <div className="max-h-[160px] min-h-[160px] overflow-y-auto pt-1">
                    {filtredTeachers.map((teacher, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          teachers?.includes(teacher.id)
                            ? setTeachers(
                                teachers.filter(
                                  (teacherID) => teacherID !== teacher.id
                                )
                              )
                            : setTeachers(teachers.concat(teacher.id));
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                      >
                        {teachers?.includes(teacher.id) ? (
                          <img src={images.check} alt="check" />
                        ) : (
                          <img src={images.notcheck} alt="notcheck" />
                        )}
                        <div>
                          {teacher.id} - {teacher.fullName.toUpperCase()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={classRef}>
              <button
                onClick={() => setClassToggle(!classToggle)}
                className="w-full px-4 py-2  border flex justify-between items-center mb-8 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              >
                Classes
                {!classToggle ? (
                  <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
                ) : (
                  <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
                )}
              </button>
              {classToggle && (
                <div
                  className="absolute w-[100%] bg-white rounded-lg z-[150] top-[115%] left-0 overflow-y-auto"
                  style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
                >
                  <div className="max-h-[160px] min-h-[160px] overflow-y-auto pt-1">
                    {allClasses
                      .sort((a, b) => a.id - b.id)
                      ?.map((_class, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            classes.includes(_class.id)
                              ? setClasses(
                                  classes.filter((cls) => cls !== _class.id)
                                )
                              : setClasses(classes.concat(_class.id));
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                        >
                          {classes.includes(_class.id) ? (
                            <img src={images.check} alt="check" />
                          ) : (
                            <img src={images.notcheck} alt="notcheck" />
                          )}
                          <div>
                            {_class.speciality === null
                              ? _class.name
                              : `${_class.name}/${_class.speciality}`}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleCreateModule}
                disabled={
                  !name ||
                  !description ||
                  !classes.length > 0 ||
                  !teachers.length > 0 ||
                  !semester ||
                  !editor
                }
                className={`px-4 py-2 ${
                  !name ||
                  !description ||
                  !classes.length > 0 ||
                  !teachers.length > 0 ||
                  !semester ||
                  !editor
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

export default CreateModules;
