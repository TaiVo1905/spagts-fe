import { RouteObject } from "react-router-dom";
import TeacherPage from "../pages/teacher/TeacherPage";

export const teacherRoutes: RouteObject[] =  [
      { path: "Teacherpage", element: <TeacherPage /> }
    ]

;
export default teacherRoutes;