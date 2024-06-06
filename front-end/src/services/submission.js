import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/submission";

const submit = async (formData, assignmentId) => {
  return await axios.post(`${baseUrl}/${assignmentId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

const getStudentAssignments = async () => {
  return await axios.get(`${baseUrl}/user`, { withCredentials: true });
};

const getSubmissions = async (assignmentId) => {
  return await axios.get(`${baseUrl}/answers/${assignmentId}`, {
    withCredentials: true,
  });
};

export default {
  submit,
  getStudentAssignments,
  getSubmissions
};
