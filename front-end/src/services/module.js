import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/module";

const getAll = async () => {
  const { data } = await axios.get(`${baseUrl}`, {
    withCredentials: true,
  });
  return data
};

export default {
  getAll,
};
