import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/questions";

const create = async (body) => {
  return axios.post(`${baseUrl}/`, body, { withCredentials: true });
};

const getQuestionByQuiz = async (body) => {
  return await axios.get(`${baseUrl}/`, body, { withCredentials: true });
};

export default {
  create,
  getQuestionByQuiz
};
