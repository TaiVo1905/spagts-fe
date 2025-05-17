import { RouteObject } from "react-router-dom";
import StudentProfilePage from "../pages/student/StudentProfilePage";
import  SelfStudyPage from "../pages/student/SelfStudyPage";
import  InClassPage from "../pages/student/InClassPage";



export const studentRoutes: RouteObject[] =  [
      { path: "profile", element: <StudentProfilePage /> },
      { path: "achievement", element: <StudentProfilePage /> },
      { path: "semester-goal", element: <StudentProfilePage /> },
      { path: "learning-journal", element: <StudentProfilePage /> },
      { path: "in-class", element: <StudentProfilePage /> },
      { path: "self-study", element: <StudentProfilePage /> },
      { path: "selfstudy", element: <SelfStudyPage /> },
      { path: "InClass", element: <InClassPage /> },


    ]

;
export default studentRoutes;


