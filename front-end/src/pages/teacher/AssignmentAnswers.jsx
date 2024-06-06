import React, { useState, useEffect } from "react";
import { TeacherSideBar, TeacherNav } from "../../components";
import { useStateContext } from "../../context/StateContext";
import submission from "../../services/submission";
import assignment from "../../services/assignment";
import { useParams } from "react-router-dom";

const AssignmentAnswers = () => {
  const { setSelectedItem } = useStateContext();
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState();
  const [status, setStatus] = useState(""); // State for status option

  useEffect(() => {
    setSelectedItem();
  }, []);

  const { idAssignment } = useParams();

  const fetchAnswers = async () => {
    const res = await submission.getSubmissions(idAssignment);
    setAnswers(res.data.data);
  };

  useEffect(() => {
    fetchAnswers();
  }, []);

  const handleAddNote = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setStatus(""); // Reset status when closing modal
  };

  const handleSubmitNote = async () => {
    try {
      const response = await assignment.evaluateSubmission(idAssignment, {
        studentId: selectedStudent.studentId,
        status,
      });
      console.log(response); // Handle success
      handleCloseModal();
    } catch (error) {
      console.error("Failed to add note:", error); // Handle error
    }
  };

  return (
    <div className="relative min-h-screen pb-10 bg-[#EFF5FF] w-full overflow-hidden">
      <TeacherSideBar />
      <div className="relative sm:ml-[200px] md:ml-[260px]">
        <TeacherNav />
        <div className="px-2 md:px-6 mt-4">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Students Answers
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] table-fixed border-collapse border border-transparent shadow-md rounded-md overflow-hidden bg-white">
              <thead>
                <tr>
                  <th className="w-1/4 p-2">Student Name</th>
                  <th className="w-1/4 p-2">Email Address</th>
                  <th className="w-1/4 p-2">Group</th>
                  <th className="w-1/4 p-2">Attachment</th>
                  <th className="w-1/4 p-2">Evaluation</th>
                </tr>
              </thead>
              <tbody>
                {/* Table rows */}
                {answers.map((st, index) => (
                  <tr key={index}>
                    <td className="p-4">{st.fullname}</td>
                    <td className="p-4">{st.email}</td>
                    <td className="p-4">{st.groupeNumber}</td>
                    <td className="p-4">
                      <a
                        href={st.submitLink}
                        target="_blank"
                        rel="noreferrer"
                        className="py-1 px-4 border border-gray rounded-md"
                      >
                        Consult
                      </a>
                    </td>
                    <td className="p-4">
                      <button
                        className="py-1 px-4 bg-gray5 text-blueState font-medium rounded-md"
                        onClick={() => handleAddNote(st)}
                      >
                        Add Note
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal for adding note */}
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-[100]">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[40%]">
            <h2 className="text-2xl font-bold text-primary mb-4">Add Note</h2>
            <select
              className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="bad">Bad</option>
            </select>
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-2 bg-blueState text-white rounded-md font-semibold"
                onClick={handleSubmitNote}
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

export default AssignmentAnswers;
