import { RouteObject } from "react-router-dom";
import StudentLayout from "../layouts/StudentLayout";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";

const studentRoutes: RouteObject = {
    path: "/student",
    element: <ProtectedRoute roles={['Student']} children={<StudentLayout />}></ProtectedRoute>,
    children: [
      { path: "profile", element: <StudentProfilePage /> },
      { path: "achievement", element: <StudentProfilePage /> },
      { path: "semester-goal", element: <StudentProfilePage /> },
      { path: "learning-journal", element: <StudentProfilePage /> },
      { path: "in-class", element: <StudentProfilePage /> },
      { path: "self-study", element: <StudentProfilePage /> },
    ],
  };

export default studentRoutes;