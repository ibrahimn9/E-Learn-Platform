import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/student";

const getModulesByCohort = async (cohortId) => {
  return await axios.get(`${baseUrl}/${cohortId}`, { withCredentials: true });
};

const getModulesByStudentId = async (studentId) => {
  return axios.get(`${baseUrl}/modules/${studentId}`, { withCredentials: true });
};

export default {
  getModulesByCohort,
  getModulesByStudentId
};
