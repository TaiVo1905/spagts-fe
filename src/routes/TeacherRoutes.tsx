import { RouteObject } from "react-router-dom";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import TimetablePage from "../pages/student/TimetablePage";
import CertificatePage from "../pages/student/CertificatePage";
import StudentSemesterGoalPage from "../pages/student/SemesterGoalPage";
import LearningJournalPage from "../pages/student/LearningJournalPage";
import DashboardPage from "../pages/teacher/DashboardPage";

export const teacherRoutes: RouteObject[] =  [
      { path: "profile", element: <StudentProfilePage /> },
      { path: "modules/:moduleId", element: <DashboardPage /> },
      { path: "students/:id/profile", element: <StudentProfilePage /> },
      { path: "students/:id/achievement", element: <CertificatePage /> },
      { path: "students/:id/semester-goal", element: <StudentSemesterGoalPage /> },
      { path: "students/:id/learning-journal", element: <StudentProfilePage /> },
      { path: "students/:id/learning-journal/semester1", element: <LearningJournalPage /> },
      { path: "students/:id/learning-journal/semester2", element: <LearningJournalPage /> },
      { path: "students/:id/learning-journal/semester3", element: <LearningJournalPage /> },
      { path: "students/:id/learning-journal/semester4", element: <LearningJournalPage /> },
      { path: "students/:id/learning-journal/semester5", element: <LearningJournalPage /> },
      { path: "students/:id/learning-journal/semester6", element: <LearningJournalPage /> },
      { path: "students/:id/timetable", element: <TimetablePage /> },
    ]

;
export default teacherRoutes;