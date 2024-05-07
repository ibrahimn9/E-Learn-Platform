import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/resource";

const getResourcesByModule = async (moduleId) => {
  return axios.get(`${baseUrl}/module/${moduleId}`, {
    withCredentials: true,
  });
};

const createResource = async (body) => {
  return axios.post(`${baseUrl}`, body, {
    withCredentials: true,
  });
};

export default {
  getResourcesByModule,
  createResource,
};
