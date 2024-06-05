import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/quiz";

const getQuizByModule = async (moduleId) => {
  return axios.get(`${baseUrl}/module/${moduleId}`, {
    withCredentials: true,
  });
};

const createQuiz = async (body) => {
  return axios.post(`${baseUrl}/`, body, {
    withCredentials: true,
  });
};

const getQuestionsByQuiz = async (idQuiz) => {
  return axios.get(`${baseUrl}/${idQuiz}/questions`, {
    withCredentials: true,
  });
};



export default {
  getQuizByModule,
  createQuiz,
  getQuestionsByQuiz,
};
