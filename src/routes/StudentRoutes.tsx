import { RouteObject } from "react-router-dom";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import TimetablePage from "../pages/student/TimetablePage";
import CertificatePage from "../pages/student/CertificatePage";
import StudentSemesterGoalPage from "../pages/student/SemesterGoalPage";
import LearningJournalPage from "../pages/student/LearningJournalPage";

export const studentRoutes: RouteObject[] =  [
      { path: "profile", element: <StudentProfilePage /> },
      { path: "achievement", element: <CertificatePage /> },
      { path: "semester-goal", element: <StudentSemesterGoalPage /> },
      { path: "learning-journal", element: <StudentProfilePage /> },
      { path: "learning-journal/semester1", element: <LearningJournalPage /> },
      { path: "learning-journal/semester2", element: <LearningJournalPage /> },
      { path: "learning-journal/semester3", element: <LearningJournalPage /> },
      { path: "learning-journal/semester4", element: <LearningJournalPage /> },
      { path: "learning-journal/semester5", element: <LearningJournalPage /> },
      { path: "learning-journal/semester6", element: <LearningJournalPage /> },
      { path: "timetable", element: <TimetablePage /> },
    ]

;
export default studentRoutes;