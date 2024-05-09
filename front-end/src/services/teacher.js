import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/teacher";

const getAll = async () => {
  const { data } = await axios.get(`${baseUrl}?role=teacher`, {
    withCredentials: true,
  });
  return data;
};

const getMyModules = async (id) => {
  return await axios.get(`${baseUrl}/${id}`, { withCredentials: true });
};

const insertChapter = async (moduleId, body) => {
  return axios.post(`${baseUrl}/chapter/insert-new-chapter/${moduleId}`, body, {
    withCredentials: true,
  });
};

const deleteChapter = async (id) => {
  return axios.delete(`${baseUrl}/chapter/${id}`, {
    withCredentials: true,
  });
};

const insertDocument = async (chapterId, body) => {
  return axios.post(
    `${baseUrl}/document/insert-new-document/${chapterId}`,
    body,
    {
      withCredentials: true,
    }
  );
};

const deleteDocument = async (documentId) => {
  return axios.delete(`${baseUrl}/document/${documentId}`)
}

const getChaptersByModuleId = async (moduleId) => {
  return await axios.get(`${baseUrl}/chapter/${moduleId}`, { withCredentials: true });
};



export default {
  getAll,
  getMyModules,
  insertChapter,
  deleteChapter,
  insertDocument,
  deleteDocument,
  getChaptersByModuleId
};
