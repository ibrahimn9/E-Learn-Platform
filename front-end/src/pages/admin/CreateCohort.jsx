import React, { useState, useEffect, useRef } from "react";
import { AdminNav, CohortTable } from "../../components";
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

const CreateCohort = () => {
  const { refetchCohorts, setRefetchCohorts } = useStateContext();

  // fetch teachers and classes
  const [allTeachers, setAllTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const fetchTeachers = async () => {
    const res = await users.getAll("teacher");
    setAllTeachers(res.data);
  };

  const fetchClasses = async () => {
    const res = await _class.getAll();
    setClasses(res.data.data);
    setSpecialties([
      ...new Set(
        res.data.data
          .filter((_class) => _class.speciality !== null)
          .sort((a, b) => a.id - b.id)
          .map((_class) => _class.speciality)
      ),
    ]);
  };

  const hasSpecialty = (className, classes) => {
    return classes?.some(
      (_class) => _class.name === className && _class.speciality !== null
    );
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

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

  // add cohort
  const [showModal, setShowModal] = useState(false);

  const handleAddCohortClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [groupNumber, setGroupNumber] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [className, setClassName] = useState("");
  const [specialty, setSpecialty] = useState("");

  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const handleCreateCohort = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const response = await cohort.createCohort({
        groupNumber,
        teachers,
        className,
        specialty,
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

  //add teachers
  const [teachersToggle, setTeachersToggle] = useState(false);
  const [classToggle, setClassToggle] = useState(false);
  const [specialtyToggle, setSpecialtyToggle] = useState(false);

  const teachersRef = useRef();
  useClickOutside(teachersRef, () => {
    setTeachersToggle(false);
  });

  const classRef = useRef();
  useClickOutside(classRef, () => {
    setClassToggle(false);
  });

  const specialtyRef = useRef();
  useClickOutside(specialtyRef, () => {
    setSpecialtyToggle(false);
  });

  return (
    <div className="h-auto min-h-screen bg-[#EFF5FF] overflow-hidden">
      <AdminNav />
      <div className="max-w-7xl mx-auto mt-10 px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-16">Create Cohort</h1>
        <div className="mx-auto max-w-xl flex items-center justify-center gap-6 mb-8">
          <button
            onClick={handleAddCohortClick}
            className="flex items-center gap-2 px-4 py-2 bg-blueState border border-blueState  text-white rounded-md font-semibold hover:opacity-[0.8]"
          >
            <FaPlus />
            Add cohort
          </button>
        </div>
        <CohortTable allTeachers={allTeachers} />
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-20">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[40%]">
            <h2 className="text-2xl font-bold text-primary mb-4">Add Cohort</h2>
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
                htmlFor="groupNumber"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the Group Number
              </label>
              <input
                type="text"
                id="groupNumber"
                value={groupNumber}
                onChange={(e) => setGroupNumber(e.target.value)}
                placeholder="Enter group number"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
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
                className="w-full px-4 py-2  border flex justify-between items-center mb-4 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              >
                {className === "" ? "Class name" : className}
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
                    {[
                      ...new Set(
                        classes
                          .sort((a, b) => a.id - b.id)
                          .map((_class) => _class.name)
                      ),
                    ]?.map((_class, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          if (className === _class) {
                            setClassName("");
                            setSpecialty("");
                          } else {
                            setClassName(_class);
                            setSpecialty("");
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                      >
                        {className === _class ? (
                          <img src={images.check} alt="check" />
                        ) : (
                          <img src={images.notcheck} alt="notcheck" />
                        )}
                        <div>{_class?.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={specialtyRef}>
              <button
                disabled={!hasSpecialty(className, classes)}
                onClick={() => setSpecialtyToggle(!specialtyToggle)}
                className="w-full px-4 py-2  border flex justify-between items-center mb-4 text-gray border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              >
                {specialty === "" ? "Specialty" : specialty}
                {!specialtyToggle ? (
                  <FaChevronDown className="text-gray-400 text-sm mt-[2px]" />
                ) : (
                  <FaChevronUp className="text-gray-400 text-sm mt-[2px]" />
                )}
              </button>
              {hasSpecialty(className, classes) && specialtyToggle && (
                <div
                  className="absolute w-[100%] bg-white rounded-lg z-[150] top-[115%] left-0 overflow-y-auto"
                  style={{ boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)" }}
                >
                  <div className="h-auto max-h-[160px] overflow-y-auto p-2">
                    {specialties.map((spec, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          specialty === spec
                            ? setSpecialty("")
                            : setSpecialty(spec);
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-[#242B2E] border-gray-300 cursor-pointer hover:bg-gray5"
                      >
                        {specialty === spec ? (
                          <img src={images.check} alt="check" />
                        ) : (
                          <img src={images.notcheck} alt="notcheck" />
                        )}
                        <div>{spec?.toUpperCase()}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={handleCreateCohort}
                disabled={
                  hasSpecialty(className, classes)
                    ? className === "" || specialty === "" || groupNumber === ""
                    : className === "" ||
                      groupNumber === ""
                }
                className={`px-4 py-2 ${
                  hasSpecialty(className, classes)
                    ? className === "" || specialty === "" || groupNumber === ""
                    : className === "" ||
                      groupNumber === ""
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

export default CreateCohort;
