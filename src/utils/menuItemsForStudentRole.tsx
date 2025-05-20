import { FaGraduationCap, FaLayerGroup, FaTrophy, FaUser, FaCalendarAlt } from "react-icons/fa";

const menuItems = [
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
];

export default menuItems;