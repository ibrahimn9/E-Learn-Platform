import React, { useState, useEffect } from "react";
import { TeacherSideBar, TeacherNav } from "../../components";
import { FaChevronRight, FaChevronDown } from "react-icons/fa";
import images from "../../constants/images";
import { useStateContext } from "../../context/StateContext";
import teacher from "../../services/teacher";
import { useParams, useNavigate } from "react-router-dom";
import assignment from "../../services/assignment";

const Assignment = () => {
  const { setSelectedItem } = useStateContext();
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedItem(4);
  }, []);

  const { userData } = useStateContext();
  const { refetchTModules, setRefetchTModules } = useStateContext();
  const { id } = useParams();

  const [modules, setModules] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    name: "",
    description: "",
    timeEnd: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const fetchModules = async () => {
    try {
      const res = await teacher.getMyModules(id);
      const modulesData = await Promise.all(
        res.data.map(async (module) => {
          const assignmentRes = await assignment.getAll(id, module.id);
          module.assignments = assignmentRes.data.data;
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAssignment((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleAddAssignmentClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewAssignment({ name: "", description: "", timeEnd: "" });
    setSelectedFile(null);
    setErrorMsg("");
    setSuccessMsg("");
  };

  const handleSubmitAssignment = async (e, moduleId) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("moduleId", moduleId);
      formData.append("name", newAssignment.name);
      formData.append("description", newAssignment.description);
      formData.append("timeEnd", newAssignment.timeEnd);
      formData.append("file", selectedFile);

      await assignment.create(formData);
      setSuccessMsg("Assignment Created Successfully");
      setShowModal(false);
      setRefetchTModules(!refetchTModules); // Refetch modules to update the assignments list
    } catch (error) {
      console.error("Error creating assignment:", error);
      setErrorMsg("Error creating assignment");
    }
  };

  return (
    <div className="relative min-h-screen pb-10 bg-[#EFF5FF] w-full overflow-hidden">
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
                {module.assignments.map((assignment, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-md shadow-md flex flex-col justify-between"
                  >
                    <p className="pt-2 font-medium text-xl">
                      {assignment.name}
                    </p>
                    <div className="py-2">
                      <div className="">
                        <p className="text-gray text-sm">
                          {assignment.description}
                        </p>
                        <p className="text-gray text-sm">
                          Deadline:
                          {new Date(assignment.timeEnd).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <a
                        href={assignment.uploadedLink}
                        target="_blank"
                        className="basis-[45%] flex justify-center items-center text-sm py-2 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]"
                      >
                        Consult
                      </a>
                      <button
                        onClick={() => navigate(`${assignment.id}`)}
                        className="basis-[45%] flex justify-center items-center text-sm py-2 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]"
                      >
                        Student Answers
                      </button>
                    </div>
                  </div>
                ))}
                {userData.userData.id === module.idEditor && (
                  <div className="relative py-4 px-6 sm:px-2 md:px-10 min-h-[200px] bg-white border border-dashed border-gray4 rounded-md flex flex-col items-center">
                    <p className="font-medium text-center z-10">
                      Create new Assignment
                    </p>
                    <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-30%] cursor-pointer">
                      <img
                        src={images.addElps}
                        onClick={handleAddAssignmentClick}
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
              Add Assignment
            </h2>
            {errorMsg && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative my-2 w-full"
                role="alert"
              >
                <span className="block sm:inline text-sm">{errorMsg}</span>
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
            <form
              className="flex flex-col items-center"
              onSubmit={(e) => handleSubmitAssignment(e, modules[0].id)}
            >
              <div className="mb-4 w-full">
                <label
                  htmlFor="assignmentName"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Enter the Assignment Name
                </label>
                <input
                  type="text"
                  id="assignmentName"
                  name="name"
                  value={newAssignment.name}
                  onChange={handleInputChange}
                  placeholder="Enter Assignment Name"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="assignmentDescription"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Enter the Assignment Description
                </label>
                <textarea
                  id="assignmentDescription"
                  name="description"
                  value={newAssignment.description}
                  onChange={handleInputChange}
                  placeholder="Enter Assignment Description"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                ></textarea>
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="assignmentEndTime"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Enter the Assignment End Time
                </label>
                <input
                  type="datetime-local"
                  id="assignmentEndTime"
                  name="timeEnd"
                  value={newAssignment.timeEnd}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="mb-4 w-full">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="flex items-center justify-between w-full">
                <button
                  type="submit"
                  disabled={
                    !newAssignment.name ||
                    !newAssignment.description ||
                    !newAssignment.timeEnd ||
                    !selectedFile
                  }
                  className={`px-4 py-2 ${
                    !newAssignment.name ||
                    !newAssignment.description ||
                    !newAssignment.timeEnd ||
                    !selectedFile
                      ? "opacity-50"
                      : "opacity-100"
                  } bg-blueState text-white rounded-md font-semibold`}
                >
                  Submit
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

export default Assignment;
