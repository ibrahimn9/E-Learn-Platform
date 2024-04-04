import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/cohort";

const getAll = async (groupNumber, className, specialty) => {
  return axios.get(
    `${baseUrl}?groupNumber=${groupNumber}&className=${className}&specialty=${specialty}`,
    {
      withCredentials: true,
    }
  );
};

export default {
    getAll
}
