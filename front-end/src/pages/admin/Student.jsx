import React, { useState, useEffect } from "react";
import { AdminNav, StudentTable } from "../../components";
import { FaPlus } from "react-icons/fa6";
import images from "../../constants/images";
import { useStateContext } from "../../context/StateContext";
import users from "../../services/users";
import admin from "../../services/admin";

const Student = () => {
  const { refetchStudents, setRefetchStudents } = useStateContext();

  //fetch students
  const [students, setStudents] = useState([]);

  const fetchData = async () => {
    const res = await users.getAll("student");
    setStudents(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [refetchStudents]);

  // add one student
  const [showModal, setShowModal] = useState(false);

  const handleAddStudentClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [idClass, setIdClass] = useState("");
  const [groupeNumber, setGroupeNumber] = useState("");
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();

  const handleInsertOneStudent = async (e) => {
    e.preventDefault();
    setErrorMsg();
    setSuccessMsg();
    try {
      const response = await admin.insertOneStudent({
        fullName,
        email,
        password,
        idClass,
        groupeNumber,
      });
      if (response.status >= 200 && response.status < 300) {
        setSuccessMsg(response.data.message);
        setRefetchStudents(!refetchStudents);
      }
    } catch (error) {
      if (error.response) {
        setErrorMsg(error.response.data.message);
      }
    }
  };

  // send csv file
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleInsertStudents = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await admin.insertStudents(formData);
      console.log("File uploaded successfully:", response.data);
      handleSuccessPopup(response.data.message);
      setRefetchStudents(!refetchStudents);
    } catch (error) {
      handleErrorPopup("Error uploading file:");
    }
  };

  useEffect(() => {
    if (file) {
      handleInsertStudents();
    }
  }, [file]);

  //error handling
  const [errorText, setErrorText] = useState("");
  const [errorToggle, setErrorToggle] = useState(false);
  const handleErrorPopup = (text) => {
    setErrorText(text);
    setErrorToggle(true);
    setTimeout(() => {
      setErrorToggle(false);
    }, 3000);
  };

  //success handling
  const [successText, setSuccessText] = useState("");
  const [successToggle, setSuccessToggle] = useState(false);
  const handleSuccessPopup = (text) => {
    setSuccessText(text);
    setSuccessToggle(true);
    setTimeout(() => {
      setSuccessToggle(false);
    }, 3000);
  };

  return (
    <div className="h-auto min-h-screen bg-[#EFF5FF] overflow-hidden">
      <AdminNav />
      {errorToggle && (
        <div className="px-4 py-1 bg-red-200 text-[#242B2E] absolute top-[50%] z-[90] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md shadow-md">
          <p>{errorText}</p>
        </div>
      )}
      {successToggle && (
        <div className="px-4 py-1 bg-green-200 text-[#242B2E] absolute top-[50%] z-[90] left-[50%] translate-x-[-50%] translate-y-[-50%] rounded-md shadow-lg">
          <p>{successText}</p>
        </div>
      )}
      <div className="max-w-7xl mx-auto mt-10 px-4 py-8">
        <h1 className="text-3xl font-bold text-primary mb-16">
          Students Management
        </h1>
        <div className="mx-auto max-w-xl flex items-center justify-center gap-6 mb-8">
          <button
            onClick={handleAddStudentClick}
            className="flex items-center gap-2 px-4 py-2 bg-blueState border border-blueState  text-white rounded-md font-semibold hover:opacity-[0.8]"
          >
            <FaPlus />
            Add student
          </button>
          <label className="flex items-center cursor-pointer gap-2 px-4 py-2 text-blueState border border-blueState rounded-md font-semibold hover:opacity-[0.8]">
            <img src={images.uploadIcon} alt="upload" />
            Import csv file
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              accept=".csv"
            />
          </label>
        </div>
        <StudentTable students={students} />
      </div>
      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[#00194F80] bg-opacity-50 z-20">
          <div className="bg-white p-8 rounded-md w-[90%] md:w-[40%]">
            <h2 className="text-2xl font-bold text-primary mb-4">
              Add Student
            </h2>
            {errorMsg && (
              <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative my-2 w-full"
                role="alert"
              >
                <span class="block sm:inline text-sm">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div
                className="bg-green-100 w-full border border-green-400 text-green-700 px-4 py-2 rounded relative my-2"
                role="alert"
              >
                <span className="block sm:inline text-sm">{successMsg}</span>
              </div>
            )}
            <form onSubmit={handleInsertOneStudent}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Enter the full name
                </label>
                <input
                  type="text"
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Enter the email address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter name"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Enter the password
                </label>
                <input
                  type="password"
                  id="password"
                  autoComplete
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border rounded-md bg-[#F5F6FA] border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="idclass"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Enter the Class ID
                </label>
                <input
                  type="text"
                  id="class"
                  value={idClass}
                  onChange={(e) => setIdClass(e.target.value)}
                  placeholder="Enter class ID"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="mb-8">
                <label
                  htmlFor="name"
                  className="text-[#606060] font-medium block mb-1"
                >
                  Enter the Group number
                </label>
                <input
                  type="text"
                  id="group"
                  value={groupeNumber}
                  onChange={(e) => setGroupeNumber(e.target.value)}
                  placeholder="Enter group number"
                  className="w-full px-4 py-2 border border-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 rounded-md bg-[#F5F6FA]"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blueState text-white rounded-md font-semibold hover:opacity-80"
                >
                  Add
                </button>
                <button
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md font-semibold hover:opacity-80"
                  onClick={handleCloseModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Student;
