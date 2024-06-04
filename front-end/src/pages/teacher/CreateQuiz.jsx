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

const CreateQuiz = () => {
  const { setSelectedItem } = useStateContext();

  useEffect(() => {
    setSelectedItem(5);
  }, []);

  const { userData } = useStateContext();
  const { refetchTModules, setRefetchTModules } = useStateContext();
  const { id } = useParams();

  const [modules, setModules] = useState([]);

  // fetch modules
  const fetchModules = async () => {
    try {
      const res = await teacher.getMyModules(id);
      const modulesData = await Promise.all(
        res.data.map(async (module) => {
          const quizRes = await quiz.getQuizByModule(module.id);
          module.quiz = quizRes.data;
          return module;
        })
      );
      setModules(modulesData);
    } catch (error) {
      console.error("Error fetching modules and moocs:", error);
    }
  };

  // add quiz
  const [showModal, setShowModal] = useState(false);
  const [idModule, setIdModule] = useState("");

  const [quizName, setQuizName] = useState("");
  const [quizDuration, setQuizDuration] = useState("");
  const [quizEndTime, setQuizEndTime] = useState("");

  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const handleAddQuizClick = (id) => {
    setShowModal(true);
    setIdModule(id);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddQuiz = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const quizData = {
        quizName,
        moduleId: idModule,
        duration: quizDuration,
        endTime: quizEndTime,
      };
      const response = await quiz.createQuiz(quizData); // Adjust according to your service
      if (response.status >= 200 && response.status < 300) {
        setSuccessMsg(response.data.message);
        setRefetchTModules(!refetchTModules);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.msg);
      }
    }
  };

  // consult
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [quizData, setQuizData] = useState("");

  const handleConsultClick = (quiz) => {
    setQuizData(quiz);
    setShowConsultModal(true);
  };

  // add question
  const [showAddQuestionModal, setShowAddQuestionModal] = useState(false);
  const [questionText, setQuestionText] = useState("");
  const [note, setNote] = useState("");
  const [options, setOptions] = useState([{ text: "", isCorrect: false }]);

  const handleOptionChange = (index, field, value) => {
    const newOptions = options.map((option, i) => {
      if (i === index) {
        return { ...option, [field]: value };
      }
      return option;
    });
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, { text: "", isCorrect: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    try {
      const response = await question.create({
        questionText,
        note,
        options,
        idQuiz: quizData.id,
      });
      if (response.status >= 200 && response.status < 300) {
        setSuccessMsg(response.data.msg);
        setQuestionText("");
        setNote("");
        setOptions([{ text: "", isCorrect: false }]);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.msg);
      }
    }
  };

  useEffect(() => {
    fetchModules();
  }, [refetchTModules]);

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
                {module.quiz.map((quiz, index) => (
                  <div
                    key={index}
                    className="p-4 bg-white rounded-md shadow-md flex flex-col justify-between"
                  >
                    <p className="pt-2 font-medium text-xl">{quiz.quizName}</p>
                    <div className="py-2">
                      <p className="text-gray text-sm">Questions: 15</p>
                      <div className="flex w-full items-center justify-between">
                        <p className="text-gray text-sm">
                          Deadline:{" "}
                          {new Date(quiz.timeEnd).toLocaleDateString()}
                        </p>
                        <p className="text-gray text-sm">
                          Timeline: {Math.floor(quiz.duration)} min
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleConsultClick(quiz)}
                        className="basis-[45%] flex justify-center items-center text-sm py-2 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]"
                      >
                        Consult
                      </button>
                      <button className="basis-[45%] flex justify-center items-center text-sm py-2 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]">
                        Student results
                      </button>
                    </div>
                  </div>
                ))}
                {userData.userData.id === module.idEditor && (
                  <div className="relative py-4 px-6 sm:px-2 md:px-10 min-h-[200px] bg-white border border-dashed border-gray4 rounded-md flex flex-col items-center">
                    <p className="font-medium">Create new Quiz</p>
                    <div className="absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] cursor-pointer">
                      <img
                        src={images.addElps}
                        onClick={() => handleAddQuizClick(module.id)}
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
            <h2 className="text-2xl font-bold text-primary mb-4">Add Quiz</h2>
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
            <div className="mb-4">
              <label
                htmlFor="quizName"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the Quiz Name
              </label>
              <input
                type="text"
                id="quizName"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                placeholder="Enter Quiz Name"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="quizDuration"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the Quiz Duration
              </label>
              <input
                type="text"
                id="quizDuration"
                value={quizDuration}
                onChange={(e) => setQuizDuration(e.target.value)}
                placeholder="Enter Quiz Duration"
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="quizEndTime"
                className="text-[#606060] font-medium block mb-1"
              >
                Enter the Quiz End Time
              </label>
              <input
                type="datetime-local"
                id="quizEndTime"
                value={quizEndTime}
                onChange={(e) => setQuizEndTime(e.target.value)}
                className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                onClick={(e) => handleAddQuiz(e)}
                disabled={!quizName || !quizDuration || !quizEndTime}
                className={`px-4 py-2 ${
                  !quizName || !quizDuration || !quizEndTime
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
      {showConsultModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-[100]">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[70%] max-h-[80%] overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">
              {quizData.quizName}
            </h2>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-darkGray text-lg font-medium">Questions</h4>
              <button
                onClick={() => setShowAddQuestionModal(!showAddQuestionModal)}
                className="flex items-center gap-1 text-sm py-2 px-4 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]"
              >
                <IoMdAdd className="text-lg font-bold" />
                Add question
              </button>
            </div>

            {showAddQuestionModal && (
              <form
                onSubmit={handleSubmit}
                className="border border-gray4 rounded-md px-4 py-4 mt-4"
              >
                <h2 className="text-xl font-medium text-darkGray mb-2">
                  Add Question
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
                    <span className="block sm:inline text-sm">
                      {successMsg}
                    </span>
                  </div>
                )}
                <div className="mb-4">
                  <label
                    htmlFor="questionText"
                    className="text-[#606060] font-medium block mb-1"
                  >
                    Question Text
                  </label>
                  <input
                    type="text"
                    id="questionText"
                    value={questionText}
                    onChange={(e) => setQuestionText(e.target.value)}
                    placeholder="Enter question text"
                    className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                  />
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="note"
                    className="text-[#606060] font-medium block mb-1"
                  >
                    Note
                  </label>
                  <input
                    type="text"
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Enter note"
                    className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                  />
                </div>
                {options.map((option, index) => (
                  <div key={index} className="mb-4">
                    <label className="text-[#606060] font-medium block mb-1">
                      Option {index + 1}
                    </label>
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) =>
                        handleOptionChange(index, "text", e.target.value)
                      }
                      placeholder={`Option ${index + 1} text`}
                      className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                    />
                    <label className="flex items-center mt-2">
                      <input
                        type="checkbox"
                        checked={option.isCorrect}
                        onChange={(e) =>
                          handleOptionChange(
                            index,
                            "isCorrect",
                            e.target.checked
                          )
                        }
                        className="mr-2 mt-[3px]"
                      />
                      Correct
                    </label>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center ga-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-md font-semibold hover:opacity-80"
                >
                  <IoMdAdd className="text-lg font-bold" />
                  Add Option
                </button>
                <div className="flex items-center justify-between mt-4 mb-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blueState text-white rounded-md font-semibold"
                  >
                    Add Question
                  </button>
                </div>
              </form>
            )}

            <div className="px-4 mt-8">
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-darkGray text-md font-medium">Q1</h4>
                  <div className="flex items-center gap-4 text-xl text-darkGray">
                    <MdEdit className="cursor-pointer" />
                    <MdDelete className="cursor-pointer" />
                  </div>
                </div>
                <h4 className="text-darkGray text-md font-medium">
                  Wich of the following is not is not a networking protocol?
                </h4>
                <div className="w-[80%] border border-gray4 rounded-md py-2 px-2 mt-2 flex items-center gap-2">
                  <MdOutlineCheckBoxOutlineBlank className="mt-[3px] text-[24px] text-gray4 cursor-pointer" />
                  <p className="text-darkGray">a. ICP</p>
                </div>
                <div className="w-[80%] border border-green-400 bg-green-50 rounded-md py-2 px-2 mt-2 flex items-center gap-2">
                  <IoCheckbox className="mt-[3px] text-[24px] text-green-400 cursor-pointer" />
                  <p className="text-darkGray">a. ICP</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateQuiz;
