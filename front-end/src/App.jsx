import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Authentification, Landing, ResetPassword } from "./pages";
import AdminHome from "./pages/admin/Home";
import TeacherHome from "./pages/teacher/Home";
import StudentHome from "./pages/student/Home";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path="/" element={<Landing />} />
        <Route path="/auth" element={<Authentification />} />
        <Route path="/admin/:id" element={<AdminHome />} />
        <Route path="/teacher/:id" element={<TeacherHome />} />
        <Route path="/student/:id" element={<StudentHome />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
