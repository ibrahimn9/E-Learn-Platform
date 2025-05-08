import React, { useState, useEffect, useRef } from "react";
import images from "../constants/images";
import { IoSearchOutline } from "react-icons/io5";
import { RxReset } from "react-icons/rx";
import Cookies from "js-cookie";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useStateContext } from "../context/StateContext";
import useClickOutside from "../hooks/useClickOutside";

import admin from "../services/admin";
import module from "../services/module";
import users from "../services/users";

const TeacherTable = ({ teachers }) => {
  const { refetchTeachers, setRefetchTeachers } = useStateContext();

  //fetch modules

  const [modules, setModules] = useState([]);

  const fetchModules = async () => {
    const res = await module.getAll();
    setModules(res.data.map((module) => module.name));
  };

  useEffect(() => {
    fetchModules();
  }, []);

  //fetch editors

  const [editors, setEditors] = useState([]);

  const fetchEditors = async () => {
    const res = await users.getAll("editor");
    setEditors(res);
  };

  //filter

  const [filtersToggle, setFiltersToggle] = useState(true);

  // //implement filters
  const [statusToggle, setStatusToggle] = useState(false);
  const [moduleToggle, setModuleToggle] = useState(false);
  const [typeToggle, setTypeToggle] = useState(false);

  const statusRef = useRef();
  useClickOutside(statusRef, () => {
    setStatusToggle(false);
  });
  const moduleRef = useRef();
  useClickOutside(moduleRef, () => {
    setModuleToggle(false);
  });

  const typeRef = useRef();
  useClickOutside(typeRef, () => {
    setTypeToggle(false);
  });

  // //filter functionnalities
  const [filters, setFilters] = useState({
    status: "",
    modules: [],
    is_editor: "",
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const [searchModule, setSearchModule] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filtredModules = modules.filter((module) => {
    return (
      !searchModule || module.toLowerCase().includes(searchModule.toLowerCase())
    );
  });

  const filteredTeachers = teachers.filter((teacher) => {
    const matchSearch =
      !searchQuery ||
      teacher.fullName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchFilters = () => {
      const matchModules = () => {
        const teacherModules = teacher.modules.map(
          (module) => module.module_name
        );
        return (
          !filters.modules.length ||
          filters.modules.some((item) => teacherModules.includes(item))
        );
      };
      const matchEditor = () => {
        const filter = filters.is_editor === "editor";
        return !filters.is_editor || isTeacherEditor(teacher) === filter;
      };

      const matchActive = () => {
        return (
          filters.status === "" ||
          (filters.status === "active" && teacher.isVerified === 1) ||
          (filters.status === "active" && teacher.isVerified === 0)
        );
      };
      return matchModules() && matchEditor() && matchActive();
    };

    return matchSearch && matchFilters();
  });

  //listing
  const [currentPage, setCurrentPage] = useState(1);
  const teachersPerPage = 7;

  const indexOfLastTeacher = currentPage * teachersPerPage;
  const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage;
  const currentTeachers = filteredTeachers.slice(
    indexOfFirstTeacher,
    indexOfLastTeacher
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
      "Are you sure you want to delete this teacher?"
    );
    if (confirmDelete) {
      try {
        const res = await admin.deleteTeacherById(id);
        handleSuccessPopup(res.data.message);
        setRefetchTeachers(!refetchTeachers);
      } catch (error) {
        handleErrorPopup("Error deleting teacher:", error);
      }
    }
  };

  // Teacher type
  function isTeacherEditor(teacher) {
    if (!teacher.modules || teacher.modules.length === 0) {
      return false;
    }

    return teacher.modules.some((module) => module.is_editor);
  }

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
      {/* Filter options */}
      <div className="flex justify-between items-center space-x-4 my-4 min-w-[600px]">
        <div className="flex items-center bg-[#F9F9FB] border border-[#D5D5D5] rounded-lg whitespace-nowrap">
          {/* Status filter */}
          <button
            onClick={() => setFiltersToggle(!filtersToggle)}
            className="p-2 border-r border-[#D5D5D5] h-[35px]"
          >
            <img src={images.filterIcon} alt="filter" />
          </button>
          <div
            className={filtersToggle ? "relative" : "hidden"}
            ref={statusRef}
          >
            <button
              onClick={() => setStatusToggle(!statusToggle)}
              className="h-[35px] w-[160px] px-4 py-1 border-[#D5D5D5] font-medium outline-none cursor-pointer flex items-center justify-between"
            >
              Status
              {!statusToggle ? (
                <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
              ) : (
                <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
              )}
            </button>
            {statusToggle && (
              <div
                className="absolute w-[100%] bg-white rounded-lg z-[150] top-[115%] left-0 overflow-y-auto"
                style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="p-1">
                  <div
                    onClick={() => {
                      filters.status === "active"
                        ? setFilters({ ...filters, status: "" })
                        : setFilters({ ...filters, status: "active" });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                  >
                    {filters.status === "active" ? (
                      <img src={images.check} alt="check" />
                    ) : (
                      <img src={images.notcheck} alt="notcheck" />
                    )}
                    <div>Active</div>
                  </div>
                  <div
                    onClick={() => {
                      filters.status === "inactive"
                        ? setFilters({ ...filters, status: "" })
                        : setFilters({ ...filters, status: "inactive" });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                  >
                    {filters.status === "inactive" ? (
                      <img src={images.check} alt="check" />
                    ) : (
                      <img src={images.notcheck} alt="notcheck" />
                    )}
                    <div>Inactive</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Module filter */}
          <div
            className={filtersToggle ? "relative" : "hidden"}
            ref={moduleRef}
          >
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
                        filters.modules?.includes(module)
                          ? setFilters({
                              ...filters,
                              modules: filters.modules.filter(
                                (mo) => mo !== module
                              ),
                            })
                          : setFilters({
                              ...filters,
                              modules: filters.modules.concat(module),
                            });
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                    >
                      {filters.modules?.includes(module) ? (
                        <img src={images.check} alt="check" />
                      ) : (
                        <img src={images.notcheck} alt="notcheck" />
                      )}
                      <div>{module.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Type filter */}
          <div className={filtersToggle ? "relative" : "hidden"} ref={typeRef}>
            <button
              onClick={() => setTypeToggle(!typeToggle)}
              className="h-[35px] w-[160px] px-4 py-1 border-x border-[#D5D5D5] font-medium outline-none cursor-pointer flex items-center justify-between"
            >
              Type
              {!typeToggle ? (
                <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
              ) : (
                <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
              )}
            </button>
            {typeToggle && (
              <div
                className="absolute w-[100%] bg-white rounded-lg z-[150] top-[115%] left-0 overflow-y-auto"
                style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="p-1">
                  <div
                    onClick={() => {
                      filters.is_editor === "editor"
                        ? setFilters({ ...filters, is_editor: "" })
                        : setFilters({ ...filters, is_editor: "editor" });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                  >
                    {filters.is_editor === "editor" ? (
                      <img src={images.check} alt="check" />
                    ) : (
                      <img src={images.notcheck} alt="notcheck" />
                    )}
                    <div>Editor</div>
                  </div>
                  <div
                    onClick={() => {
                      filters.is_editor === "noneditor"
                        ? setFilters({ ...filters, is_editor: "" })
                        : setFilters({ ...filters, is_editor: "noneditor" });
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                  >
                    {filters.is_editor === "noneditor" ? (
                      <img src={images.check} alt="check" />
                    ) : (
                      <img src={images.notcheck} alt="notcheck" />
                    )}
                    <div>Non editor</div>
                  </div>
                </div>
              </div>
            )}
          </div>
          {filtersToggle && (
            <button
              className="text-[#B34168] bg-white font-medium flex items-center gap-2 px-4"
              onClick={() =>
                setFilters({ status: "", modules: [], is_editor: "" })
              }
            >
              <RxReset />
              Reset Filters
            </button>
          )}
        </div>

        {/* Search bar */}
        <div className="flex items-center bg-white gap-2 border border-[#D5D5D5] px-3 py-2 h-[35px] rounded-md">
          <IoSearchOutline className="text-[#979797] text-xl" />
          <input
            type="text"
            placeholder="Search teacher name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="outline-none"
          />
        </div>
      </div>

      {/* Teacher table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed border-collapse border border-transparent shadow-md rounded-md overflow-hidden bg-white">
          <thead>
            <tr>
              <th className="w-1/4 p-2">Teacher Name</th>
              <th className="w-1/4 p-2">Email Address</th>
              <th className="w-1/4 p-2">Status</th>
              <th className="w-1/4 p-2">Module</th>
              <th className="w-1/4 p-2">Type</th>
              <th className="w-1/4 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows */}
            {currentTeachers?.map((teacher, index) => (
              <tr key={index}>
                <td className="p-4">{teacher.fullName}</td>
                <td className="p-4">{teacher.email}</td>
                <td className="p-4">
                  {teacher.isVerified === 1 ? "Active" : "Inactive"}
                </td>
                <td className="p-4">
                  {teacher.modules.length
                    ? teacher.modules.map((module, index) => (
                        <span
                          key={index}
                          className={`${module.is_editor && "font-medium"}`}
                        >
                          {index + 1 === teacher.modules.length
                            ? module.module_name.toUpperCase()
                            : `${module.module_name.toUpperCase()}, `}
                        </span>
                      ))
                    : "null"}
                </td>
                <td className="p-4">
                  {isTeacherEditor(teacher) ? "Editor" : "Non editor"}
                </td>
                <td className="p-4 flex justify-center">
                  <button
                    onClick={() => handleDeleteClick(teacher.id)}
                    className="border border-[#D5D5D5] rounded-lg flex items-center justify-center p-2 text-center"
                  >
                    <img
                      src={images.deleteIcon}
                      className="w-[16px] aspect-square"
                      alt="delete-btn"
                    />
                  </button>
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
          disabled={indexOfLastTeacher >= teachers.length}
          className="flex items-center gap-2 px-4 py-2 bg-[#FAFBFD] border border-[#D5D5D5]  text-gray rounded-md font-semibold hover:opacity-[0.8]"
        >
          Next List
          <FaChevronRight />
        </button>
      </div>
    </div>
  );
};

export default TeacherTable;
