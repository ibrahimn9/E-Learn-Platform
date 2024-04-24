import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/cohort";

const getAll = async (groupNumber, className, specialty) => {
  return axios.get(`${baseUrl}`, {
    withCredentials: true,
  });
};

const createCohort = async (body) => {
  return axios.post(`${baseUrl}`, body, {
    withCredentials: true,
  });
};

const deleteCohort = async (cohortId) => {
  return axios.delete(`${baseUrl}/${cohortId}`, {
    withCredentials: true,
  });
};

const editCohort = async (cohortId, body) => {
  return axios.put(`${baseUrl}/${cohortId}`, body, {
    withCredentials: true,
  });
};

export default {
  getAll,
  createCohort,
  deleteCohort,
  editCohort
};
