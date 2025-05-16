import { RouteObject } from "react-router-dom";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import StudentSemesterGoalPage from "../pages/student/StudentSemesterGoalPage";

export const studentRoutes: RouteObject[] = [
  { path: "profile", element: <StudentProfilePage /> },
  { path: "achievement", element: <StudentProfilePage /> },
  { path: "semester-goal", element: <StudentSemesterGoalPage /> },
  { path: "learning-journal", element: <StudentProfilePage /> },
  { path: "in-class", element: <StudentProfilePage /> },
  { path: "self-study", element: <StudentProfilePage /> },
];