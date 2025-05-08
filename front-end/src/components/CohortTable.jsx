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

const CohortTable = ({ allTeachers }) => {
  const { refetchCohorts, setRefetchCohorts } = useStateContext();

  // fetch cohorts
  const [cohorts, setCohorts] = useState([]);
  const [classes, setClasses] = useState([]);

  const fetchData = async () => {
    const res = await cohort.getAll();
    setCohorts(res.data.data);
    const res1 = await _class.getAll();
    const classLevels = [...new Set(res1.data.data.map((cls) => cls.name))];
    setClasses(classLevels);
  };

  // //filter functionnalities

  const [filters, setFilters] = useState({
    groupNumber: "",
    className: "",
    specialty: "",
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

  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredCohorts = cohorts.filter((cohort) => {
    const matchSearch = !searchQuery || cohort.groupeNumber == searchQuery;

    const matchFilters = () => {
      const matchClassName =
        cohort.name === filters.className || filters.className === "";
      const matchCohort =
        cohort.id == filters.groupNumber || filters.groupNumber === "";
      const matchSpecialty =
        cohort.speciality === filters.specialty || filters.specialty === "";

      return matchClassName && matchCohort && matchSpecialty;
    };

    return matchSearch && matchFilters();
  });

  //listing
  const [currentPage, setCurrentPage] = useState(1);
  const cohortsPerPage = 7;

  const indexOfLastCohort = currentPage * cohortsPerPage;
  const indexOfFirstCohort = indexOfLastCohort - cohortsPerPage;
  const currentCohorts = filteredCohorts.slice(
    indexOfFirstCohort,
    indexOfLastCohort
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

  useEffect(() => {
    fetchData();
  }, [refetchCohorts]);

  //delete teacher
  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this cohort?"
    );
    if (confirmDelete) {
      try {
        const res = await cohort.deleteCohort(id);
        handleSuccessPopup(res.data.message);
        setRefetchCohorts(!refetchCohorts);
      } catch (error) {
        handleErrorPopup("Error deleting teacher:", error);
      }
    }
  };

  // edit cohort
  const [showModal, setShowModal] = useState(false);
  const [edittedCohort, setEdittedCohort] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const handleEditCohortClick = (cohort) => {
    setShowModal(true);
    setEdittedCohort(cohort);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleEditCohortSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const response = await cohort.editCohort(edittedCohort.id, {
        teachers: edittedCohort.teachers,
        groupNumber: edittedCohort.groupeNumber,
      });
      if (response.status >= 200 && response.status < 300) {
        setSuccessMsg(response.data.message);
        setRefetchCohorts(!refetchCohorts);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      }
    }
  };

  // filter teachers
  const [searchTeacher, setSearchTeacher] = useState("");

  const filtredTeachers = allTeachers.filter((teacher) => {
    return (
      !searchTeacher ||
      teacher.fullName.toLowerCase().includes(searchTeacher.toLowerCase())
    );
  });

  const [teachersToggle, setTeachersToggle] = useState(false);

  const teachersRef = useRef();
  useClickOutside(teachersRef, () => {
    setTeachersToggle(false);
  });

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
      <div className="flex justify-between items-center space-x-4 my-4 overflow-x-auto min-w-[600px]">
        <div className="flex items-center bg-[#F9F9FB] border border-[#D5D5D5] rounded-lg whitespace-nowrap">
          {/* Status filter */}
          <button className="p-2 border-r border-[#D5D5D5] h-[35px]">
            <img src={images.filterIcon} alt="filter" />
          </button>
          <select
            name="className"
            value={filters.className}
            onChange={handleFilterChange}
            className="h-[35px] w-[160px] px-4 py-1 border-[#D5D5D5] font-medium outline-none cursor-pointer"
          >
            <option value="">Class name</option>
            {classes?.map((cl, index) => (
              <option value={cl} key={index}>{cl}</option>
            ))}
          </select>

          {/* Module filter */}
          <select
            name="groupNumber"
            value={filters.groupNumber}
            onChange={handleFilterChange}
            className="h-[35px] w-[160px] px-4 py-1 border-l border-[#D5D5D5] font-medium outline-none cursor-pointer"
          >
            <option value="">Group number</option>
            {cohorts
              .filter(
                (cohort) =>
                  cohort.name === filters.className || filters.className === ""
              )
              .map((cohort, index) => (
                <option value={cohort.id} key={index}>
                  {cohort.speciality
                    ? `${cohort.name}/${cohort.speciality}/${cohort.groupeNumber}`
                    : `${cohort.name}/${cohort.groupeNumber}`}
                </option>
              ))}
          </select>

          {/* Type filter */}
          <select
            name="specialty"
            value={filters.specialty}
            onChange={handleFilterChange}
            className="h-[35px] w-[160px] px-4 py-1 border-l border-r border-[#D5D5D5] font-medium outline-none cursor-pointer"
          >
            <option value="">Specialty</option>
            {(filters.className === "2CS" || filters.className === "3CS") && (
              <>
                <option value="SIW">SIW</option>
                <option value="ISI">ISI</option>
                <option value="IASD">IASD</option>
              </>
            )}
            {/* Add module options here */}
          </select>
          <button
            className="text-[#B34168] bg-white font-medium flex items-center gap-2 px-4"
            onClick={() =>
              setFilters({
                groupNumber: "",
                className: "",
                specialty: "",
              })
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
            placeholder="Search cohort"
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
              <th className="w-1/4 p-2">Class name</th>
              <th className="w-1/4 p-2">Cohort ID</th>
              <th className="w-1/4 p-2">Group number</th>
              <th className="w-1/4 p-2">Teachers</th>
              <th className="w-1/4 p-2">Specialty</th>
              <th className="w-1/4 p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Table rows */}
            {/* Replace the static data with dynamic data */}
            {currentCohorts.map((cohort, index) => (
              <tr key={index}>
                <td className="p-4">{cohort.name}</td>
                <td className="p-4">{cohort.id}</td>
                <td className="p-4">{cohort.groupeNumber}</td>
                <td className="p-4">
                  {cohort.teachers.length ? cohort.teachers.join(", ") : "null"}
                </td>
                <td className="p-4">
                  {cohort.speciality ? cohort.speciality : "null"}
                </td>
                <td className="p-4 flex justify-center">
                  <div className="border border-[#D5D5D5] rounded-lg flex gap-2 items-center justify-center w-[70px] h-[28px] text-center">
                    <button onClick={() => handleEditCohortClick(cohort)}>
                      <img
                        src={images.editIcon}
                        className="w-[16px] aspect-square"
                        alt="edit-btn"
                      />
                    </button>
                    <div className="bg-[#D5D5D5] h-[28px] w-[1px]" />
                    <button onClick={() => handleDeleteClick(cohort.id)}>
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
          disabled={indexOfLastCohort >= cohorts.length}
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
              Edit Cohort
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
            <form onSubmit={handleEditCohortSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Edit the group number
                </label>
                <input
                  type="text"
                  id="groupNumber"
                  value={edittedCohort.groupeNumber}
                  onChange={(e) =>
                    setEdittedCohort({
                      ...edittedCohort,
                      groupeNumber: e.target.value,
                    })
                  }
                  placeholder="Edit group number"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="relative" ref={teachersRef}>
                <button
                  onClick={() => setTeachersToggle(!teachersToggle)}
                  className="w-full px-4 py-2  border flex justify-between items-center mb-8 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
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
                            edittedCohort.teachers?.includes(teacher.id)
                              ? setEdittedCohort({
                                  ...edittedCohort,
                                  teachers: edittedCohort.teachers.filter(
                                    (teacherId) => teacherId !== teacher.id
                                  ),
                                })
                              : setEdittedCohort({
                                  ...edittedCohort,
                                  teachers: edittedCohort.teachers.concat(
                                    teacher.id
                                  ),
                                });
                          }}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                        >
                          {edittedCohort.teachers?.includes(teacher.id) ? (
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

export default CohortTable;
