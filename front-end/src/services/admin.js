import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/admin";

const insertOneTeacher = async (body) => {
  return axios.post(`${baseUrl}/insert-new-teacher`, body, {
    withCredentials: true,
  });
};

const insertTeachers = async (formData) => {
  return axios.post(`${baseUrl}/insert-new-teachers`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

const deleteTeacherById = async (id) => {
  return axios.delete(`${baseUrl}/delete-teacher/${id}`, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

const getTeachersModules = async (id) => {
  return axios.get(`${baseUrl}/teacher-modules?id=${id}`, {
    withCredentials: true,
  });
};

const insertOneStudent = async (body) => {
  return axios.post(`${baseUrl}/insert-new-student`, body, {
    withCredentials: true,
  });
};

const insertStudents = async (formData) => {
  return axios.post(`${baseUrl}/insert-new-students`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

const deleteStudentById = async (id) => {
  return axios.delete(`${baseUrl}/delete-student/${id}`, {
    withCredentials: true,
  });
};

const editStudent = async(id, body) => {
  return axios.put(`${baseUrl}/update-student/${id}`, body, {
    withCredentials: true,
  });
}


export default {
  insertOneTeacher,
  insertTeachers,
  deleteTeacherById,
  getTeachersModules,
  insertOneStudent,
  insertStudents,
  deleteStudentById,
  editStudent
};
