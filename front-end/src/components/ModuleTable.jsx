import React, { useState, useEffect, useRef } from "react";
import images from "../constants/images";
import { IoSearchOutline } from "react-icons/io5";
import { RxReset } from "react-icons/rx";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import cohort from "../services/cohort";
import _class from "../services/class";
import { useStateContext } from "../context/StateContext";
import useClickOutside from "../hooks/useClickOutside";
import module from "../services/module";
import users from "../services/users";

const ModuleTable = ({ allTeachers, classes }) => {
  const { refetchModules, setRefetchModules } = useStateContext();
  //fetch modules

  const [modules, setModules] = useState([]);

  const fetchModules = async () => {
    const res = await module.getAll();
    setModules(res.data);
  };

  useEffect(() => {
    fetchModules();
  }, [refetchModules]);

  //fetch editors

  const [editors, setEditors] = useState([]);

  const fetchEditors = async () => {
    const res = await users.getAll("editor");
    setEditors(res);
  };

  useEffect(() => {
    fetchEditors();
  }, []);

  // filter

  // //implement filters

  const [moduleToggle, setModuleToggle] = useState(false);
  const [classToggle, setClassToggle] = useState(false);
  const [editorsToggle, setEditorsToggle] = useState(false);
  const [teachersToggle, setTeachersToggle] = useState(false);
  const [editorToggle, setEditorToggle] = useState(false);
  const [teacherToggle, setTeacherToggle] = useState(false);

  const moduleRef = useRef();
  useClickOutside(moduleRef, () => {
    setModuleToggle(false);
  });

  const classRef = useRef();
  useClickOutside(classRef, () => {
    setClassToggle(false);
  });

  const editorsRef = useRef();
  useClickOutside(editorsRef, () => {
    setEditorsToggle(false);
  });

  const teachersRef = useRef();
  useClickOutside(teachersRef, () => {
    setTeachersToggle(false);
  });

  const editorRef = useRef();
  useClickOutside(editorRef, () => {
    setEditorToggle(false);
  });

  const teacherRef = useRef();
  useClickOutside(teacherRef, () => {
    setTeacherToggle(false);
  });

  // //filter functionnalities

  const [filters, setFilters] = useState({
    _class: [],
    modules: [],
    editors: [],
    teachers: [],
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    if (name === "className") {
      setFilters((prevFilters) => ({
        groupNumber: "",
        specialty: "",
        [name]: value,
      }));
    } else {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [name]: value,
      }));
    }
  };

  // filter modules
  const [searchModule, setSearchModule] = useState("");

  const filtredModules = modules.filter((module) => {
    return (
      !searchModule ||
      module.name.toLowerCase().includes(searchModule.toLowerCase())
    );
  });

  // filter teachers
  const [searchTeacher, setSearchTeacher] = useState("");

  const filtredTeachers = allTeachers.filter((teacher) => {
    return (
      !searchTeacher ||
      teacher.fullName.toLowerCase().includes(searchTeacher.toLowerCase())
    );
  });

  // filter editors

  const [searchEditor, setSearchEditor] = useState("");

  const filtredEditors = editors.filter((editor) => {
    return (
      !searchEditor ||
      editor.fullName.toLowerCase().includes(searchEditor.toLowerCase())
    );
  });

  const [searchEditorEd, setSearchEditorEd] = useState("");

  const filtredEditorEd = allTeachers.filter((editor) => {
    return (
      !searchEditorEd ||
      editor.fullName.toLowerCase().includes(searchEditorEd.toLowerCase())
    );
  });

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredModules = modules.filter((module) => {
    const matchSearch =
      !searchQuery ||
      module.name.toUpperCase().includes(searchQuery.toUpperCase());

    const matchFilters = () => {
      const matchClass =
        !filters._class.length || filters._class.includes(module.classId);

      const matchModules =
        !filters.modules.length > 0 ||
        filters.modules.some((m) => m === module.id);

      const matchTeachers =
        !filters.teachers.length ||
        filters.teachers.some((id) => module.teachers.includes(id));

      const matchEditors =
        !filters.editors.length ||
        filters.editors.some((id) => module.idEditor === id);

      return matchModules && matchTeachers && matchEditors && matchClass;
    };

    return matchSearch && matchFilters();
  });

  //listing
  const [currentPage, setCurrentPage] = useState(1);
  const modulesPerPage = 7;

  const indexOfLastModule = currentPage * modulesPerPage;
  const indexOfFirstModule = indexOfLastModule - modulesPerPage;
  const currentModules = filteredModules.slice(
    indexOfFirstModule,
    indexOfLastModule
  );

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
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

  //delete teacher
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this module?"
    );
    if (confirmDelete) {
      try {
        const res = await module.deleteModule(id);
        handleSuccessPopup(res.data.message);
        setRefetchModules(!refetchModules);
      } catch (error) {
        handleErrorPopup("Error deleting teacher:", error);
      }
    }
  };

  // edit module
  const [showModal, setShowModal] = useState(false);
  const [edittedModule, setEdittedModule] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const handleEditModuleClick = (module) => {
    setShowModal(true);
    setEdittedModule(module);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditModuleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const response = await module.editModule(edittedModule.id, {
        name: edittedModule.name,
        semester: edittedModule.semester,
        editor: edittedModule.idEditor,
        teachers: edittedModule.teachers,
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

  const uniqueItems = (array) =>
    Array.from(new Set(array.map((item) => item.id))).map((id) =>
      array.find((item) => item.id === id)
    );

  return (
    <div className="">
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
      <div className="flex justify-between items-center space-x-4 my-4 min-w-[600px]">
        <div className="flex items-center bg-[#F9F9FB] border border-[#D5D5D5] rounded-lg whitespace-nowrap">
          <button className="p-2 border-r border-[#D5D5D5] h-[35px]">
            <img src={images.filterIcon} alt="filter" />
          </button>

          {/* Class filter */}
          <div className="relative" ref={classRef}>
            <button
              onClick={() => setClassToggle(!classToggle)}
              className="h-[35px] w-[160px] px-4 py-1 border-l border-[#D5D5D5] font-medium outline-none cursor-pointer flex items-center justify-between"
            >
              Class
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
                <div className="max-h-[200px] min-h-[180px] overflow-y-auto pt-1">
                  {classes.map((_class, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        filters._class?.includes(_class.id)
                          ? setFilters({
                              ...filters,
                              _class: filters._class.filter(
                                (objId) => objId !== _class.id
                              ),
                            })
                          : setFilters({
                              ...filters,
                              _class: filters._class.concat(_class.id),
                            });
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                    >
                      {filters._class?.includes(_class.id) ? (
                        <img src={images.check} alt="check" />
                      ) : (
                        <img src={images.notcheck} alt="notcheck" />
                      )}
                      <div>
                        {_class.speciality
                          ? `${_class.name}/${_class.speciality}`
                          : _class.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Module filter */}
          <div className="relative" ref={moduleRef}>
            <button
              onClick={() => setModuleToggle(!moduleToggle)}
              className="h-[35px] w-[160px] px-4 py-1 border-l border-[#D5D5D5] font-medium outline-none cursor-pointer flex items-center justify-between"
            >
              Module
              {!moduleToggle ? (
                <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
              ) : (
                <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
              )}
            </button>
            {moduleToggle && (
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
                      placeholder="search module"
                      value={searchModule}
                      onChange={(e) => setSearchModule(e.target.value)}
                      className="h-10 outline-none border-none placeholder:capitalize max-w-[80%]"
                      autoFocus={moduleToggle}
                    />
                  </div>
                </div>
                <div className="max-h-[200px] min-h-[180px] overflow-y-auto pt-1">
                  {filtredModules.map((module, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        filters.modules?.includes(module.id)
                          ? setFilters({
                              ...filters,
                              modules: filters.modules.filter(
                                (mo) => mo !== module.id
                              ),
                            })
                          : setFilters({
                              ...filters,
                              modules: filters.modules.concat(module.id),
                            });
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                    >
                      {filters.modules?.includes(module.id) ? (
                        <img src={images.check} alt="check" />
                      ) : (
                        <img src={images.notcheck} alt="notcheck" />
                      )}
                      <div>{module.name.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* editors filter */}
          <div className="relative" ref={editorsRef}>
            <button
              onClick={() => setEditorsToggle(!editorsToggle)}
              className="h-[35px] w-[160px] px-4 py-1 border-l border-[#D5D5D5] font-medium outline-none cursor-pointer flex items-center justify-between"
            >
              Editors
              {!editorsToggle ? (
                <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
              ) : (
                <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
              )}
            </button>
            {editorsToggle && (
              <div
                className="absolute bg-white rounded-lg z-[150] top-[115%] left-0 overflow-y-auto"
                style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="p-2">
                  <div className="flex rounded-md border border-[#D5D5D5] px-2 items-center gap-1 cursor-text text-sm overflow-hidden">
                    <div className="w-5">
                      <IoSearchOutline className="text-[#979797] text-xl" />
                    </div>
                    <input
                      placeholder="search editor"
                      className="h-10 outline-none border-none placeholder:capitalize max-w-[80%]"
                      value={searchEditor}
                      onChange={(e) => setSearchEditor(e.target.value)}
                      autoFocus={editorsToggle}
                    />
                  </div>
                </div>
                <div className="max-h-[200px] min-h-[180px] overflow-y-auto pt-1">
                  {uniqueItems(filtredEditors).map((editor, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        filters.editors?.includes(editor.id)
                          ? setFilters({
                              ...filters,
                              editors: filters.editors.filter(
                                (editorID) => editorID !== editor.id
                              ),
                            })
                          : setFilters({
                              ...filters,
                              editors: filters.editors.concat(editor.id),
                            });
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5 overflow-x-hidden"
                    >
                      {filters.editors?.includes(editor.id) ? (
                        <img src={images.check} alt="check" />
                      ) : (
                        <img src={images.notcheck} alt="notcheck" />
                      )}
                      <div className="">{editor.fullName.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Teachers filter */}
          <div className="relative" ref={teachersRef}>
            <button
              onClick={() => setTeachersToggle(!teachersToggle)}
              className="h-[35px] w-[160px] px-4 py-1 border-x border-[#D5D5D5] font-medium outline-none cursor-pointer flex items-center justify-between"
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
                className="absolute w-auto bg-white rounded-lg z-[150] top-[115%] left-0 overflow-y-auto"
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
                        filters.teachers?.includes(teacher.id)
                          ? setFilters({
                              ...filters,
                              teachers: filters.teachers.filter(
                                (teacherID) => teacherID !== teacher.id
                              ),
                            })
                          : setFilters({
                              ...filters,
                              teachers: filters.teachers.concat(teacher.id),
                            });
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5 overflow-x-hidden"
                    >
                      {filters.teachers?.includes(teacher.id) ? (
                        <img src={images.check} alt="check" />
                      ) : (
                        <img src={images.notcheck} alt="notcheck" />
                      )}
                      <div className="">{teacher.fullName.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            className="text-[#B34168] bg-white font-medium flex items-center gap-2 px-4"
            onClick={() =>
              setFilters({ _class: [], modules: [], editors: [], teachers: [] })
            }
          >
            <RxReset />
            Reset Filters
          </button>
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-white gap-2 border border-[#D5D5D5] px-3 py-2 h-[35px] rounded-md">
          <IoSearchOutline className="text-[#979797] text-xl" />
          <input
            type="text"
            placeholder="Search module"
            value={searchQuery}
            onChange={handleSearchChange}
            className="outline-none"
          />
        </div>
      </div>
      {/* Module table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed border-collapse border border-transparent shadow-md rounded-md overflow-hidden bg-white">
          <thead>
            <tr>
              <th className="w-1/4 p-2">Module Name</th>
              <th className="w-1/4 p-2">Class</th>
              <th className="w-1/4 p-2">Editor</th>
              <th className="w-1/4 p-2">Teachers</th>
              <th className="w-1/4 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows */}
            {currentModules?.map((module, index) => (
              <tr key={index}>
                <td className="p-4">{module.name.toUpperCase()}</td>
                <td className="p-4">
                  {classes.find((_class) => _class.id === module.classId)?.name}
                </td>
                <td className="p-4">
                  {
                    allTeachers.find(
                      (teacher) => teacher.id === module.idEditor
                    )?.fullName
                  }
                </td>
                <td className="p-4">
                  {allTeachers.filter((teacher) =>
                    module.teachers.includes(teacher.id)
                  ).length
                    ? allTeachers
                        .filter((teacher) =>
                          module.teachers.includes(teacher.id)
                        )
                        ?.map((teacher) => teacher.fullName)
                        .join(", ")
                    : "null"}
                </td>
                <td className="p-4 flex justify-center items-center">
                  <div className="border border-[#D5D5D5] rounded-lg flex gap-2 items-center justify-center w-[70px] h-[28px] text-center">
                    <button onClick={() => handleEditModuleClick(module)}>
                      <img
                        src={images.editIcon}
                        className="w-[16px] aspect-square"
                        alt="edit-btn"
                      />
                    </button>
                    <div className="bg-[#D5D5D5] h-[28px] w-[1px]" />
                    <button onClick={() => handleDeleteClick(module.id)}>
                      <img
                        src={images.deleteIcon}
                        className="w-[16px] aspect-square"
                        alt="delete-btn"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mx-auto mt-6 max-w-xl flex items-center justify-center gap-6 mb-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="flex items-center gap-2 px-4 py-2 bg-[#FAFBFD] border border-[#D5D5D5]  text-gray rounded-md font-semibold hover:opacity-[0.8]"
        >
          <FaChevronLeft />
          Previous List
        </button>
        <button
          onClick={nextPage}
          disabled={indexOfLastModule >= modules.length}
          className="flex items-center gap-2 px-4 py-2 bg-[#FAFBFD] border border-[#D5D5D5]  text-gray rounded-md font-semibold hover:opacity-[0.8]"
        >
          Next List
          <FaChevronRight />
        </button>
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-20">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[40%]">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Edit Module
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
                htmlFor="name"
                className="text-[#606060] font-medium block mb-1"
              >
                Edit the module name
              </label>
              <input
                type="text"
                id="name"
                value={edittedModule.name}
                onChange={(e) =>
                  setEdittedModule({
                    ...edittedModule,
                    name: e.target.value,
                  })
                }
                placeholder="Edit module name"
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
                value={edittedModule.description}
                onChange={(e) =>
                  setEdittedModule({
                    ...edittedModule,
                    description: e.target.value,
                  })
                }
                placeholder="Enter description"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <select
              name="semester"
              value={edittedModule.semester}
              onChange={(e) =>
                setEdittedModule({
                  ...edittedModule,
                  semester: e.target.value,
                })
              }
              className="w-full px-4 py-2  border flex justify-between items-center mb-4 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
            >
              <option value="">Semester</option>
              <option value="S1">S1</option>
              <option value="S2">S2</option>
            </select>
            <div className="relative" ref={teacherRef}>
              <button
                onClick={() => setTeacherToggle(!teacherToggle)}
                className="w-full px-4 py-2  border flex justify-between items-center mb-4 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              >
                Teachers
                {!teacherToggle ? (
                  <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
                ) : (
                  <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
                )}
              </button>
              {teacherToggle && (
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
                        autoFocus={teacherToggle}
                      />
                    </div>
                  </div>
                  <div className="max-h-[160px] min-h-[160px] overflow-y-auto pt-1">
                    {filtredTeachers.map((teacher, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          edittedModule.teachers?.includes(teacher.id)
                            ? setEdittedModule({
                                ...edittedModule,
                                teachers: edittedModule.teachers.filter(
                                  (teacherId) => teacherId !== teacher.id
                                ),
                              })
                            : setEdittedModule({
                                ...edittedModule,
                                teachers: edittedModule.teachers.concat(
                                  teacher.id
                                ),
                              });
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                      >
                        {edittedModule.teachers?.includes(teacher.id) ? (
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
            <div className="relative" ref={editorRef}>
              <button
                onClick={() => setEditorToggle(!editorToggle)}
                className="w-full px-4 py-2  border flex justify-between items-center mb-8 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
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
                        value={searchEditorEd}
                        onChange={(e) => setSearchEditorEd(e.target.value)}
                        className="h-10 outline-none border-none placeholder:capitalize max-w-[80%]"
                        autoFocus={editorRef}
                      />
                    </div>
                  </div>
                  <div className="max-h-[120px] min-h-[100px] overflow-y-auto pt-1">
                    {filtredEditorEd.map((teacher, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          edittedModule.idEditor === teacher.id
                            ? setEdittedModule({
                                ...edittedModule,
                                idEditor: "",
                              })
                            : setEdittedModule({
                                ...edittedModule,
                                idEditor: teacher.id,
                              });
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                      >
                        {edittedModule.idEditor === teacher.id ? (
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
            <div className="flex items-center justify-between">
              <button
                onClick={handleEditModuleSubmit}
                className="px-4 py-2 bg-blueState text-white rounded-md font-semibold hover:opacity-80"
              >
                Edit
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

export default ModuleTable;
