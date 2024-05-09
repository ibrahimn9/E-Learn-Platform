import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/chapter";

const getChaptersByModuleId = async (moduleId) => {
  return await axios.get(`${baseUrl}/${moduleId}`, { withCredentials: true });
};



export default {
    getChaptersByModuleId
}
