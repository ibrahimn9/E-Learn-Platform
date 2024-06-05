import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Authentification, Landing, ResetPassword } from "./pages";
import AdminHome from "./pages/admin/Home";
import TeacherHome from "./pages/teacher/Home";
import StudentHome from "./pages/student/Home";
import { Teacher, Student, CreateCohort, CreateModules } from "./pages/admin";
import CourseManagement from "./pages/teacher/CourseManagement";
import { MoocManagement, Resource, CreateQuiz, QuizResults } from "./pages/teacher";
import { useStateContext } from "./context/StateContext";
import Cookies from "js-cookie";
import auth from "./services/auth";
import Module from "./pages/student/Module";

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
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/admin/:id" element={<AdminHome />} />
        <Route path="/admin/:id/manage-teachers" element={<Teacher />} />
        <Route path="/admin/:id/manage-students" element={<Student />} />
        <Route path="/admin/:id/manage-cohorts" element={<CreateCohort />} />
        <Route path="/admin/:id/manage-modules" element={<CreateModules />} />

        <Route path="/teacher/:id" element={<TeacherHome />} />
        <Route
          path="/teacher/:id/course-management"
          element={<CourseManagement />}
        />
        <Route
          path="/teacher/:id/mooc-management"
          element={<MoocManagement />}
        />
        <Route path="/teacher/:id/resource-management" element={<Resource />} />
        <Route path="/teacher/:id/quiz-management" element={<CreateQuiz />} />
        <Route path="/teacher/:id/quiz-management/:idQuiz" element={<QuizResults />} />

        <Route path="/student/:id" element={<StudentHome />} />
        <Route path="/student/:id/module/:id" element={<Module />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
