import { RouteObject } from "react-router-dom";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import  SelfStudyPage from "../pages/student/SelfStudyPage";
import  InClassPage from "../pages/student/InClassPage";
import TimetablePage from "../pages/student/TimetablePage";
import CertificatePage from "../pages/student/CertificatePage";

import StudentSemesterGoalPage from "../pages/student/StudentSemesterGoalPage";

export const studentRoutes: RouteObject[] =  [
      { path: "profile", element: <StudentProfilePage /> },
      { path: "achievement", element: <CertificatePage /> },
      { path: "semester-goal", element: <StudentSemesterGoalPage /> },
      { path: "learning-journal", element: <StudentProfilePage /> },
      { path: "selfstudy", element: <SelfStudyPage /> },
      { path: "InClass", element: <InClassPage /> },
      { path: "timetable", element: <TimetablePage /> },
    ]

;
export default studentRoutes;