import React, { useState, useEffect } from "react";
import question from "../services/question";
import { MdDelete } from "react-icons/md";
import { IoCheckbox } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import result from "../services/result";
import { useParams } from "react-router-dom";

const QuizDetail = ({ quiz }) => {
  // fetch student result

  const { id } = useParams();

  const [studentResult, setStudentResult] = useState([]);
  const [refetchStudentResult, setRefetchStudentResult] = useState(false);

  const fetchStudentResult = async () => {
    const res = await result.getUserResults(id);
    setStudentResult(res.data);
  };

  useEffect(() => {
    fetchStudentResult();
  }, [refetchStudentResult]);

  //fetch quiz's questions
  const [questionsData, setQuestionsData] = useState();
  const [refetchQuestions, setRefetchQuestions] = useState(false);

  const getQuizQuestions = async (quizId) => {
    const res = await question.getQuestionsByQuizStudent(quizId);
    setQuestionsData(res.data);
  };

  // consult
  const [showConsultModal, setShowConsultModal] = useState(false);
  const [quizData, setQuizData] = useState("");

  const handleConsultClick = (quiz) => {
    setQuizData(quiz);
    getQuizQuestions(quiz.id);
    handleStartQuiz(quiz);
    setShowConsultModal(true);
  };

  const handleCloseConsultModal = () => {
    setShowConsultModal(false);
  };

  //answering

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);

  const handleStartQuiz = (quiz) => {
    getQuizQuestions(quiz.id);
    setTimeLeft(quiz.duration * 60);
    setQuizStarted(true);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {     
        if (prev <= 1) {
          clearInterval(interval);
        }
        return prev - 1;
      });
    }, 1000);
    setTimerInterval(interval);

  };

  const handleAnswerChange = (questionId, optionId) => {
    setAnswers((prev) => {
      const currentAnswers = prev[questionId] || [];
      if (currentAnswers.includes(optionId)) {
        return {
          ...prev,
          [questionId]: currentAnswers.filter((id) => id !== optionId),
        };
      } else {
        return {
          ...prev,
          [questionId]: [...currentAnswers, optionId],
        };
      }
    });
  };



  const handleSubmitQuiz = async () => {
    if (timerInterval) {
      clearInterval(timerInterval);
    }

    const responses = Object.keys(answers).map((questionId) => ({
      questionId,
      userOptions: answers[questionId],
    }));



    try {
      const res = await result.submitResult({
        quiz: quizData.id,
        responses,
      });
      alert(res.data.msg);
      setShowConsultModal(false); // Ensure the modal is hidden after submission
      setRefetchStudentResult(!refetchStudentResult);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (timeLeft === 0 && quizStarted) {
      handleSubmitQuiz();
      setShowConsultModal(false);
    }
  }, [timeLeft]);


  const alertMsg = (score) => {
    alert(`You got ${score} points`);
  };

  return (
    <div className="mt-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ml-2">
        {quiz.map((quiz, index) => (
          <div
            key={index}
            className="p-4 bg-white rounded-md shadow-md flex flex-col justify-between"
          >
            <p className="pt-2 font-medium text-xl">{quiz.quizName}</p>
            <div className="py-2">
              <div className="flex w-full items-center justify-between">
                {studentResult?.some((sr) => sr.QuizId == quiz.id) ? (
                  <p className="text-gray text-sm">
                    Status: <span className="text-green-700">Completed</span>
                  </p>
                ) : (
                  <p className="text-gray text-sm">
                    Status: <span className="text-red-700">Incompleted</span>
                  </p>
                )}
              </div>
              <div className="flex w-full items-center justify-between">
                <p className="text-red-700 text-sm">
                  Deadline: {new Date(quiz.timeEnd).toLocaleDateString()}
                </p>
                <p className="text-gray text-sm">
                  Timeline: {Math.floor(quiz.duration)} min
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2">
              {!studentResult?.some((sr) => sr.QuizId == quiz.id) ? (
                <button
                  onClick={() => handleConsultClick(quiz)}
                  className="w-full flex justify-center items-center text-sm py-2 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]"
                >
                  Start
                </button>
              ) : (
                <button
                  onClick={() =>
                    alertMsg(
                      studentResult?.find((sr) => sr.QuizId == quiz.id).score
                    )
                  }
                  className="w-full flex justify-center items-center text-sm py-2 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]"
                >
                  See Result
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      {showConsultModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-[100]">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[70%] max-h-[80%] overflow-y-auto">
            <h2 className="text-2xl font-bold text-primary mb-4">
              {quizData.quizName}
            </h2>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-darkGray text-lg font-medium">
                Total score: {questionsData?.scoreTotal}
              </h4>
              <h4 className="text-darkGray text-lg font-medium">
                Time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}s
              </h4>
            </div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-darkGray text-lg font-medium">Questions</h4>
            </div>

            <div className="px-4 mt-8">
              {questionsData?.questions.map((question, index) => (
                <div key={index} className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-darkGray text-md font-medium">
                      Q{index + 1}
                    </h4>
                  </div>
                  <h4 className="text-darkGray text-md font-medium">
                    {question.questionText}
                  </h4>
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      onClick={() =>
                        handleAnswerChange(
                          question.id,
                          question.optionsIds[index]
                        )
                      }
                      className="w-[80%] border border-gray4 rounded-md py-2 px-2 mt-2 flex items-center gap-2 cursor-pointer"
                    >
                      {answers[question.id]?.includes(
                        question.optionsIds[index]
                      ) ? (
                        <IoCheckbox className="mt-[3px] text-[24px] text-gray4" />
                      ) : (
                        <MdOutlineCheckBoxOutlineBlank className="mt-[3px] text-[24px] text-gray4" />
                      )}
                      <p className="text-darkGray">{option}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div className="flex items-center justify-start">
              <button
                onClick={handleSubmitQuiz}
                className="text-sm py-2 px-6 mt-6 border bg-blueState border-blueState  text-white rounded-md font-medium hover:opacity-[0.8]"
              >
                Send Answers
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizDetail;
