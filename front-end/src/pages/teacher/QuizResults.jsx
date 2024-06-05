import React, { useState, useEffect } from "react";
import { TeacherSideBar, TeacherNav } from "../../components";
import { FaChevronRight } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import images from "../../constants/images";
import { useStateContext } from "../../context/StateContext";
import teacher from "../../services/teacher";
import { useParams } from "react-router-dom";
import quiz from "../../services/quiz";
import question from "../../services/question";
import { IoMdAdd } from "react-icons/io";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { IoCheckbox } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import result from "../../services/result";

const QuizResults = () => {
  const { setSelectedItem } = useStateContext();

  useEffect(() => {
    setSelectedItem(5);
  }, []);
  
  const { idQuiz } = useParams();
  const [studentsResults, setStudentsResults] = useState([]);

  const fetchResults = async () => {
    const res = await result.getPassedStudents(idQuiz);
    setStudentsResults(res.data);
  };

  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="relative min-h-screen pb-10 bg-[#EFF5FF] w-full overflow-hidden">
      <TeacherSideBar />
      <div className="relative sm:ml-[200px] md:ml-[260px]">
        <TeacherNav />
        <div className="px-2 md:px-6 mt-4">
          <h1 className="text-2xl font-bold text-primary mb-4">
            Students results
          </h1>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] table-fixed border-collapse border border-transparent shadow-md rounded-md overflow-hidden bg-white">
              <thead>
                <tr>
                  <th className="w-1/4 p-2">Student Name</th>
                  <th className="w-1/4 p-2">Email Address</th>
                  <th className="w-1/4 p-2">Group</th>
                  <th className="w-1/4 p-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {/* Table rows */}
                {studentsResults.map((st, index) => (
                  <tr>
                    <td className="p-4">{st.fullName}</td>
                    <td className="p-4">{st.email}</td>
                    <td className="p-4">{st.groupeNumber}</td>
                    <td className="p-4 flex justify-center">{st.score}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
