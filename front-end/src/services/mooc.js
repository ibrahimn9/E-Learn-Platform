import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/moocs";

const getMoocsByModule = async (moduleId) => {
  return axios.get(`${baseUrl}/module/${moduleId}`, {
    withCredentials: true,
  });
};

const deleteMooc = async (id) => {
  return axios.delete(`${baseUrl}/${id}`, {
    withCredentials: true,
  });
};

const insertMooc = async (body) => {
  return axios.post(`${baseUrl}/upload`, body, {
    withCredentials: true,
  });
};

export default {
  getMoocsByModule,
  deleteMooc,
  insertMooc,
};
