import { RouteObject } from "react-router-dom";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import  SelfStudyPage from "../pages/student/SelfStudyPage";
import  InClassPage from "../pages/student/InClassPage";
import TimetablePage from "../pages/student/TimetablePage";
import CertificatePage from "../pages/student/CertificatePage";

import StudentSemesterGoalPage from "../pages/student/SemesterGoalPage";

export const studentRoutes: RouteObject[] =  [
      { path: "profile", element: <StudentProfilePage /> },
      { path: "achievement", element: <CertificatePage /> },
      { path: "semester-goal", element: <StudentSemesterGoalPage /> },
      { path: "learning-journal", element: <StudentProfilePage /> },
      { path: "self-study/semester1", element: <SelfStudyPage /> },
      { path: "self-study/semester2", element: <SelfStudyPage /> },
      { path: "self-study/semester3", element: <SelfStudyPage /> },
      { path: "self-study/semester4", element: <SelfStudyPage /> },
      { path: "self-study/semester5", element: <SelfStudyPage /> },
      { path: "self-study/semester6", element: <SelfStudyPage /> },
      { path: "In-class", element: <InClassPage /> },
      { path: "timetable", element: <TimetablePage /> },
    ]

;
export default studentRoutes;