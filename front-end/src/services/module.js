import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/module";

const getAll = async () => {
  const { data } = await axios.get(`${baseUrl}`, {
    withCredentials: true,
  });
  return data;
};

const createModule = async (body) => {
  return await axios.post(`${baseUrl}`, body, {
    withCredentials: true,
  });
};

const deleteModule = async (id) => {
  return await axios.delete(`${baseUrl}/${id}`, {
    withCredentials: true,
  });
};

const editModule = async (id, body) => {
  return await axios.put(`${baseUrl}/${id}`, body, {
    withCredentials: true,
  });
};

const getModuleById = async (moduleId) => {
  return axios.get(`${baseUrl}/${moduleId}`, { withCredentials: true });
};

export default {
  getAll,
  createModule,
  deleteModule,
  editModule,
  getModuleById
};
