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
        { label: 'In-class', link: '/student/in-class', icon: <FaGraduationCap />,
          children: [
          { label: 'Semester 1', link: '/student/in-class/semester1', icon: <FaGraduationCap /> },  
          { label: 'Semester 2', link: '/student/in-class/semester2', icon: <FaGraduationCap /> },
          { label: 'Semester 3', link: '/student/in-class/semester3', icon: <FaGraduationCap /> },
          { label: 'Semester 4', link: '/student/in-class/semester4', icon: <FaGraduationCap /> },
          { label: 'Semester 5', link: '/student/in-class/semester5', icon: <FaGraduationCap /> },
          { label: 'Semester 6', link: '/student/in-class/semester6', icon: <FaGraduationCap /> },
          ],
        },
        { label: 'Self-study', link: '/student/self-study', icon: <FaGraduationCap />,
          children: [
            { label: 'Semester 1', link: '/student/self-study/semester1', icon: <FaGraduationCap /> },  
            { label: 'Semester 2', link: '/student/self-study/semester2', icon: <FaGraduationCap /> },
            { label: 'Semester 3', link: '/student/self-study/semester3', icon: <FaGraduationCap /> },
            { label: 'Semester 4', link: '/student/self-study/semester4', icon: <FaGraduationCap /> },
            { label: 'Semester 5', link: '/student/self-study/semester5', icon: <FaGraduationCap /> },
            { label: 'Semester 6', link: '/student/self-study/semester6', icon: <FaGraduationCap /> },
            ],
        }, 
      ]
    },
    { label: 'Timetable', link: '/student/timetable', icon: <FaCalendarAlt /> },
];

export default menuItems;