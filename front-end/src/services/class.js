import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/class";

const getAll = async () => {
  return axios.get(`${baseUrl}`, {
    withCredentials: true,
  });
};

export default {
  getAll,
};
