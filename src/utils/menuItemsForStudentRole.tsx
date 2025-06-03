import { FaGraduationCap, FaLayerGroup, FaTrophy, FaUser, FaCalendarAlt } from "react-icons/fa";
import { useRole } from "./useRole";
import { useParams } from "react-router-dom";



const menuItems =  () => {
    const { id: studentId } = useParams<{ id: string }>();
    return useRole().isStudent ? [
        { label: 'My profile', link: '/student/profile', icon: <FaUser /> },
        { label: 'Achievement', link: '/student/achievement', icon: <FaTrophy /> },
        { label: 'Semester goals', link: '/student/semester-goal', icon: <FaLayerGroup /> },
        {
          label: 'Learning journal',
          link: '#', 
          icon: <FaGraduationCap />,
          children: [
              { label: 'Semester 1', link: '/student/learning-journal/semester1', icon: <FaGraduationCap /> },  
              { label: 'Semester 2', link: '/student/learning-journal/semester2', icon: <FaGraduationCap /> },
              { label: 'Semester 3', link: '/student/learning-journal/semester3', icon: <FaGraduationCap /> },
              { label: 'Semester 4', link: '/student/learning-journal/semester4', icon: <FaGraduationCap /> },
              { label: 'Semester 5', link: '/student/learning-journal/semester5', icon: <FaGraduationCap /> },
              { label: 'Semester 6', link: '/student/learning-journal/semester6', icon: <FaGraduationCap /> },
              ],
        },
        { label: 'Timetable', link: '/student/timetable', icon: <FaCalendarAlt /> },
    ] :
    [
        { label: 'My profile', link: `/teacher/students/${studentId}/profile`, icon: <FaUser /> },
        { label: 'Achievement', link: `/teacher/students/${studentId}/achievement`, icon: <FaTrophy /> },
        { label: 'Semester goals', link: `/teacher/students/${studentId}/semester-goal`, icon: <FaLayerGroup /> },
        {
          label: 'Learning journal',
          link: '#', 
          icon: <FaGraduationCap />,
          children: [
              { label: 'Semester 1', link: `/teacher/students/${studentId}/learning-journal/semester1`, icon: <FaGraduationCap /> },  
              { label: 'Semester 2', link: `/teacher/students/${studentId}/learning-journal/semester2`, icon: <FaGraduationCap /> },
              { label: 'Semester 3', link: `/teacher/students/${studentId}/learning-journal/semester3`, icon: <FaGraduationCap /> },
              { label: 'Semester 4', link: `/teacher/students/${studentId}/learning-journal/semester4`, icon: <FaGraduationCap /> },
              { label: 'Semester 5', link: `/teacher/students/${studentId}/learning-journal/semester5`, icon: <FaGraduationCap /> },
              { label: 'Semester 6', link: `/teacher/students/${studentId}/learning-journal/semester6`, icon: <FaGraduationCap /> },
              ],
        },
        { label: 'Timetable', link: `/teacher/students/${studentId}/timetable`, icon: <FaCalendarAlt /> },
    ];
}


export default menuItems;