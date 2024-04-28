import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Authentification, Landing, ResetPassword } from "./pages";
import AdminHome from "./pages/admin/Home";
import TeacherHome from "./pages/teacher/Home";
import StudentHome from "./pages/student/Home";
import { Teacher, Student, CreateCohort, CreateModules } from "./pages/admin";
import { useStateContext } from "./context/StateContext";
import Cookies from "js-cookie";
import auth from "./services/auth";

const App = () => {
  const token = Cookies.get("access_token");

  const { userData, setUserData } = useStateContext();
  const sendToken = async () => {
    try {
      const response = await auth.verifyToken({ token });
      if (response.status >= 200 && response.status < 300)
        setUserData(response.data);
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  useEffect(() => {
    if (token && !userData?.userData?.id) {
      sendToken();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/auth" element={<Authentification />} />
        <Route path="/admin/:id" element={<AdminHome />} />
        <Route path="/teacher/:id" element={<TeacherHome />} />
        <Route path="/student/:id" element={<StudentHome />} />
        <Route path="/admin/:id/manage-teachers" element={<Teacher />} />
        <Route path="/admin/:id/manage-students" element={<Student />} />
        <Route path="/admin/:id/manage-cohorts" element={<CreateCohort />} />
        <Route path="/admin/:id/manage-modules" element={<CreateModules />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
