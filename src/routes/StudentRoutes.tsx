import { RouteObject } from "react-router-dom";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import AchivementPage from "../pages/student/AchivementPage";
    

export const studentRoutes: RouteObject[] =  [
      { path: "profile", element: <StudentProfilePage /> },
      { path: "achievement", element: <AchivementPage /> },
      { path: "semester-goal", element: <StudentProfilePage /> },
      { path: "learning-journal", element: <StudentProfilePage /> },
      { path: "in-class", element: <StudentProfilePage /> },
      { path: "self-study", element: <StudentProfilePage /> },
    ]

;