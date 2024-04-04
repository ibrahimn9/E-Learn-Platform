import axios from "axios";

const baseUrl = "http://localhost:3000/api/v1/auth";


const signIn = async(body) => {
    return await axios.post(`${baseUrl}/signIn/`, body);
}

const resendEmail = async(body) => {
    return await axios.post(`${baseUrl}/resend-email`, body);
}

const forgetPassword = async(body) => {
    return await axios.post(`${baseUrl}/forgot-password`, body);
}

const resetPassword = async(token, body) => {
    return await axios.post(`${baseUrl}/reset-password/${token}`, body);
}


const verifyToken = async(body) => {
    return await axios.post(`${baseUrl}/verifytoken`, body);
}

export default {
    signIn,
    resendEmail,
    forgetPassword,
    resetPassword,
    verifyToken
}