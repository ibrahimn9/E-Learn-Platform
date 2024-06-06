import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/assignment";

const getAll = async (teacherId, moduleId) => {
  return await axios.get(
    `${baseUrl}?teacherId=${teacherId}&moduleId=${moduleId}`,
    { withCredentials: true }
  );
};

const create = async (formData) => {
  return await axios.post(`${baseUrl}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

const getStudentAssignments = async (moduleId) => {
  return axios.get(`${baseUrl}/module/${moduleId}`, {
    withCredentials: true,
  });
};

const submit = async (formData, assignmentId) => {
  return await axios.post(`${baseUrl}/${assignmentId}/submission`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

const evaluateSubmission = async (assignmentId, body) => {
  return await axios.post(`${baseUrl}/${assignmentId}/evaluation`, body, {
    withCredentials: true,
  });
};

export default {
  getAll,
  create,
  getStudentAssignments,
  submit,
  evaluateSubmission,
};
