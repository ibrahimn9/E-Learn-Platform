import React, { useState, useEffect, useRef } from "react";
import images from "../constants/images";
import { IoSearchOutline } from "react-icons/io5";
import { RxReset } from "react-icons/rx";
import { FaChevronLeft } from "react-icons/fa";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { useStateContext } from "../context/StateContext";
import useClickOutside from "../hooks/useClickOutside";

import admin from "../services/admin";
import module from "../services/module";
import _class from "../services/class";
import cohort from "../services/cohort";

const StudentTable = ({ students }) => {
  const { refetchStudents, setRefetchStudents } = useStateContext();

  //fetch classes
  const [classes, setClasses] = useState([]);

  const fetchClasses = async () => {
    const res = await _class.getAll();
    setClasses(res.data.data);
  };

  useEffect(() => {
    fetchClasses();
  }, []);

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

  //delete student
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );
    if (confirmDelete) {
      try {
        const res = await admin.deleteStudentById(id);
        handleSuccessPopup(res.data.message);
        setRefetchStudents(!refetchStudents);
      } catch (error) {
        handleErrorPopup("Error deleting teacher:", error);
      }
    }
  };

  // edit student
  const [showModal, setShowModal] = useState(false);
  const [edittedStudent, setEdittedStudent] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const handleEditStudentClick = (student) => {
    setShowModal(true);
    setEdittedStudent(student);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditStudentSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const response = await admin.editStudent(edittedStudent.id, {
        fullName: edittedStudent.fullname,
        email: edittedStudent.email,
        groupeNumber: edittedStudent.groupNumber,
      });
      if (response.status >= 200 && response.status < 300) {
        setSuccessMsg(response.data.message);
        setRefetchStudents(!refetchStudents);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      }
    }
  };

  //fetch cohort
  const [cohorts, setCohorts] = useState([]);

  const fetchCohort = async () => {
    const selectedClasses = filters._class;
    if (selectedClasses.length) {
      const promises = selectedClasses.map(async (cls) => {
        const specialty = cls.speciality;
        const res = await cohort.getAll(
          "",
          cls.name,
          specialty ? specialty : ""
        );
        return res.data;
      });

      const responseData = await Promise.all(promises);

      setCohorts(responseData[0].data);
    } else {
      const res = await cohort.getAll("", "", "");
      setCohorts(res.data.data);
    }
  };

  //filter

  // //implement filters
  const [statusToggle, setStatusToggle] = useState(false);
  const [classToggle, setClassToggle] = useState(false);
  const [groupToggle, setGroupToggle] = useState(false);

  const statusRef = useRef();
  useClickOutside(statusRef, () => {
    setStatusToggle(false);
  });
  const classRef = useRef();
  useClickOutside(classRef, () => {
    setClassToggle(false);
  });
  const groupRef = useRef();
  useClickOutside(groupRef, () => {
    setGroupToggle(false);
  });
  const [filters, setFilters] = useState({
    status: "",
    _class: [],
    cohorts: [],
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredStudents = students.filter((student) => {
    const matchSearch =
      !searchQuery ||
      student.fullname.toLowerCase().includes(searchQuery.toLowerCase());

    const studentCohort = cohorts.find(
      (cohort) => cohort.id === student.idCohorte
    );
    const matchClass =
      filters._class.length === 0 ||
      filters._class.some(
        (cls) =>
          cls.name === studentCohort?.name &&
          cls.speciality === studentCohort.speciality
      );

    const matchCohort =
      filters.cohorts.length === 0 ||
      filters.cohorts.some((cohort) => cohort.id === student.idCohorte);

    return matchSearch && matchClass && matchCohort;
  });

  //listing
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 7;

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    fetchCohort();
  }, [filters._class]);

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
          <button className="p-2 border-r border-[#D5D5D5] h-[35px]">
            <img src={images.filterIcon} alt="filter" />
          </button>
          <div className="relative" ref={statusRef}>
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

          {/* Year filter */}
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
                        filters._class?.some((obj) => obj.id === _class.id)
                          ? setFilters({
                              ...filters,
                              _class: filters._class.filter(
                                (obj) => obj.id !== _class.id
                              ),
                            })
                          : setFilters({
                              ...filters,
                              _class: filters._class.concat(_class),
                            });
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                    >
                      {filters._class?.some((obj) => obj.id === _class.id) ? (
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

          {/* Type filter */}
          <div className="relative" ref={groupRef}>
            <button
              onClick={() => setGroupToggle(!groupToggle)}
              className="h-[35px] w-[160px] px-4 py-1 border-l border-r border-[#D5D5D5] font-medium outline-none cursor-pointer flex items-center justify-between"
            >
              Group
              {!groupToggle ? (
                <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
              ) : (
                <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
              )}
            </button>
            {groupToggle && (
              <div
                className="absolute w-[100%] bg-white rounded-lg z-[150] top-[115%] left-0 overflow-y-auto"
                style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
              >
                <div className="max-h-[200px] min-h-[180px] overflow-y-auto pt-1">
                  {cohorts.map((cohort, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        filters.cohorts?.some((obj) => obj.id === cohort.id)
                          ? setFilters({
                              ...filters,
                              cohorts: filters.cohorts.filter(
                                (obj) => obj.id !== cohort.id
                              ),
                            })
                          : setFilters({
                              ...filters,
                              cohorts: filters.cohorts.concat(cohort),
                            });
                      }}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                    >
                      {filters.cohorts?.some((obj) => obj.id === cohort.id) ? (
                        <img src={images.check} alt="check" />
                      ) : (
                        <img src={images.notcheck} alt="notcheck" />
                      )}
                      <div>
                        {cohort.name}/{cohort.groupeNumber}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button
            className="text-[#B34168] bg-white font-medium flex items-center gap-2 px-4"
            onClick={() => setFilters({ status: "", _class: [], cohorts: [] })}
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
            placeholder="Search student name"
            value={searchQuery}
            onChange={handleSearchChange}
            className="outline-none"
          />
        </div>
      </div>

      {/* Student table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] table-fixed border-collapse border border-transparent shadow-md rounded-md overflow-hidden bg-white">
          <thead>
            <tr>
              <th className="w-1/4 p-2">Student Name</th>
              <th className="w-1/4 p-2">Email Address</th>
              <th className="w-1/4 p-2">Status</th>
              <th className="w-1/4 p-2">Year</th>
              <th className="w-1/4 p-2">Group</th>
              <th className="w-1/4 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows */}

            {currentStudents?.map((student, index) => (
              <tr key={index}>
                <td className="p-4">{student.fullname}</td>
                <td className="p-4">{student.email}</td>
                <td className="p-4">Active</td>
                <td className="p-4">1CS</td>
                <td className="p-4">
                  {
                    cohorts?.find((cohort) => cohort.id === student.idCohorte)
                      ?.groupeNumber
                  }
                </td>
                <td className="p-4 flex justify-center">
                  <div className="border border-[#D5D5D5] rounded-lg flex gap-2 items-center justify-center w-[70px] h-[28px] text-center">
                    <button onClick={() => handleEditStudentClick(student)}>
                      <img
                        src={images.editIcon}
                        className="w-[16px] aspect-square"
                        alt="edit-btn"
                      />
                    </button>
                    <div className="bg-[#D5D5D5] h-[28px] w-[1px]" />
                    <button onClick={() => handleDeleteClick(student.id)}>
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
          disabled={indexOfLastStudent >= students.length}
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
              Edit Student
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
            <form onSubmit={handleEditStudentSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Edit the full name
                </label>
                <input
                  type="text"
                  id="name"
                  value={edittedStudent.fullname}
                  onChange={(e) =>
                    setEdittedStudent({
                      ...edittedStudent,
                      fullname: e.target.value,
                    })
                  }
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Edit the email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={edittedStudent.email}
                  onChange={(e) =>
                    setEdittedStudent({
                      ...edittedStudent,
                      email: e.target.value,
                    })
                  }
                  placeholder="Enter name"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="mb-8">
                <label
                  htmlFor="name"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Edit the Group number
                </label>
                <input
                  type="text"
                  id="group"
                  value={edittedStudent.groupNumber}
                  onChange={(e) =>
                    setEdittedStudent({
                      ...edittedStudent,
                      groupNumber: e.target.value,
                    })
                  }
                  placeholder="Enter group number"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentTable;
