import React, { useState, useEffect } from "react";
import assignment from "../services/assignment";
import submit from "../services/submission";

const AssignmentDetail = ({ assignments }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submission, setSubmission] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const [refetchAssign, setRefetchAssign] = useState(false);

  const handleConsultClick = (assignment) => {
    setSelectedAssignment(assignment);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedAssignment(null);
    setSubmission(null);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleFileChange = (e) => {
    setSubmission(e.target.files[0]);
  };

  const handleSubmitAssignment = async (e) => {
    e.preventDefault();
    if (!submission) {
      setErrorMsg("Please select a file to submit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", submission);

    try {
      const response = await submit.submit(formData, selectedAssignment.id);
      if (response.status >= 200 && response.status < 300) {
        setSuccessMsg("Submission added successfully!");
        setRefetchAssign(!refetchAssign);
      }
    } catch (error) {
      setErrorMsg(error.message);
      setSuccessMsg("");
    }
  };

  // fetch student assignments

  const [userAssign, setUserAssign] = useState([]);
  const fetchSass = async () => {
    const res = await submit.getStudentAssignments();
    setUserAssign(res.data.data);
  };



  useEffect(() => {
    fetchSass();
  }, [refetchAssign]);

  return (
    <div className="mt-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-2">
        {assignments.map((assignment, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-md shadow-md flex flex-col justify-between min-h-[160px]"
          >
            <p className="pt-2 font-medium text-xl">{assignment.name}</p>
            <div className="py-2">
              <div className=" flex justify-between items-center">
                <p className="text-gray text-sm">
                  Deadline:
                  {new Date(assignment.timeEnd).toLocaleDateString()}
                </p>
                {userAssign?.some((sr) => sr.assignmentId == assignment.id) ? (
                  <p className="text-gray text-sm">
                    Status: <span className="text-green-700">Completed</span>
                  </p>
                ) : (
                  <p className="text-gray text-sm">
                    Status: <span className="text-red-700">Incompleted</span>
                  </p>
                )}
              </div>
              <p className="text-gray text-sm mt-1">
                Your evaluation:{" "}
                {userAssign?.find((sr) => sr.assignmentId == assignment.id)
                  ?.status
                  ? userAssign?.find((sr) => sr.assignmentId == assignment.id)
                      ?.status
                  : "/"}
              </p>
            </div>
            <div className="flex justify-between items-center">
              {userAssign?.some((sr) => sr.assignmentId == assignment.id) ? (
                <a
                  className="basis-[100%] flex justify-center items-center text-sm py-2 border bg-blueState border-blueState text-white rounded-md font-medium hover:opacity-[0.8]"
                  href={
                    userAssign?.find((sr) => sr.assignmentId == assignment.id)
                      ?.submitLink
                  }
                  target="_blank"
                >
                  Consult
                </a>
              ) : (
                <button
                  className="basis-[100%] flex justify-center items-center text-sm py-2 border bg-blueState border-blueState text-white rounded-md font-medium hover:opacity-[0.8]"
                  onClick={() => handleConsultClick(assignment)}
                >
                  See Details
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedAssignment && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-[100]">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[40%]">
            <h2 className="text-2xl font-bold text-primary mb-4">
              {selectedAssignment.name}
            </h2>
            <p className="mb-2 text-red-600">
              Deadline: {"  "}
              {new Date(selectedAssignment.timeEnd).toLocaleString()}
            </p>
            <p className="mb-4">
              <strong className="text-primary">Activity instructions:</strong>{" "}
              <br />
              {selectedAssignment.description}
            </p>
            <div className="mb-4">
              <a
                href={selectedAssignment.uploadedLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline cursor-pointer"
              >
                Consult Assignment File
              </a>
            </div>
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
            <form onSubmit={handleSubmitAssignment}>
              <div className="mb-4">
                <label
                  htmlFor="submission"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Upload Your Work
                </label>
                <input
                  type="file"
                  id="submission"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className={`px-4 py-2 ${
                    !submission ? "opacity-50" : "opacity-100"
                  } bg-blueState text-white rounded-md font-semibold`}
                  disabled={!submission}
                >
                  Submit
                </button>
                <button
                  type="button"
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

export default AssignmentDetail;
