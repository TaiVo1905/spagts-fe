import { RouteObject } from "react-router-dom";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import TimetablePage from "../pages/student/TimetablePage";
import CertificatePage from "../pages/student/CertificatePage";
import StudentSemesterGoalPage from "../pages/student/SemesterGoalPage";
import LearningJournalPage from "../pages/student/LearningJournalPage";

export const teacherRoutes: RouteObject[] =  [
      { path: "profile", element: <StudentProfilePage /> },
      { path: "student/:id/profile", element: <StudentProfilePage /> },
      { path: "student/:id/achievement", element: <CertificatePage /> },
      { path: "student/:id/semester-goal", element: <StudentSemesterGoalPage /> },
      { path: "student/:id/learning-journal", element: <StudentProfilePage /> },
      { path: "student/:id/learning-journal/semester1", element: <LearningJournalPage /> },
      { path: "student/:id/learning-journal/semester2", element: <LearningJournalPage /> },
      { path: "student/:id/learning-journal/semester3", element: <LearningJournalPage /> },
      { path: "student/:id/learning-journal/semester4", element: <LearningJournalPage /> },
      { path: "student/:id/learning-journal/semester5", element: <LearningJournalPage /> },
      { path: "student/:id/learning-journal/semester6", element: <LearningJournalPage /> },
      { path: "student/:id/timetable", element: <TimetablePage /> },
    ]

;
export default teacherRoutes;