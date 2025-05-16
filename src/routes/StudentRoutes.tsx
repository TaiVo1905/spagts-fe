import { RouteObject } from "react-router-dom";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import CertificatePage from "../pages/student/CertificatePage";
    

export const studentRoutes: RouteObject[] =  [
      { path: "profile", element: <StudentProfilePage /> },
      { path: "certificates", element: <CertificatePage /> },
      { path: "semester-goal", element: <StudentProfilePage /> },
      { path: "learning-journal", element: <StudentProfilePage /> },
      { path: "in-class", element: <StudentProfilePage /> },
      { path: "self-study", element: <StudentProfilePage /> },
    ]

;