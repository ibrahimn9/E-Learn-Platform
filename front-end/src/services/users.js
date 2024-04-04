import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/users";

const getAll = async (role) => {
  const { data } = await axios.get(`${baseUrl}?role=${role}`, {
    withCredentials: true,
  });
  return data;
};

export default {
  getAll,
};
