import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/quiz";

const submitResult = async (body) => {
  return await axios.post(`${baseUrl}/${body.quiz}/result`, body, {
    withCredentials: true,
  });
};

const getUserResults = async (moduleId) => {
  return await axios.get(
    `http://localhost:3000/api/v1/result/module/${moduleId}`,
    {
      withCredentials: true,
    }
  );
};

const getPassedStudents = async (quizId) => {
  return await axios.get(
    `http://localhost:3000/api/v1/result/quiz/${quizId}/students`,
    {
      withCredentials: true,
    }
  );
};

export default {
  submitResult,
  getUserResults,
  getPassedStudents,
};
