import { FaGraduationCap, FaLayerGroup, FaTrophy, FaUser, FaCalendarAlt } from "react-icons/fa";

const menuItems = [
    { label: 'My profile', link: './profile', icon: <FaUser /> },
    { label: 'Achievement', link: './achievement', icon: <FaTrophy /> },
    { label: 'Semester goals', link: './semester-goal', icon: <FaLayerGroup /> },
    {
      label: 'Learning journal',
      link: '#', 
      icon: <FaGraduationCap />,
      children: [
        { label: 'In-class', link: 'InClass', icon: <FaGraduationCap />,
          children: [
          { label: 'Semester 1', link: './in-class/semester1', icon: <FaGraduationCap /> },  
          { label: 'Semester 2', link: './in-class/semester2', icon: <FaGraduationCap /> },
          { label: 'Semester 3', link: './in-class/semester3', icon: <FaGraduationCap /> },
          { label: 'Semester 4', link: './in-class/semester4', icon: <FaGraduationCap /> },
          { label: 'Semester 5', link: './in-class/semester5', icon: <FaGraduationCap /> },
          { label: 'Semester 6', link: './in-class/semester6', icon: <FaGraduationCap /> },
          ],
        },
        { label: 'Self-study', link: './self-study', icon: <FaGraduationCap />,
          children: [
            { label: 'Semester 1', link: './self-study/semester1', icon: <FaGraduationCap /> },  
            { label: 'Semester 2', link: './self-study/semester2', icon: <FaGraduationCap /> },
            { label: 'Semester 3', link: './self-study/semester3', icon: <FaGraduationCap /> },
            { label: 'Semester 4', link: './self-study/semester4', icon: <FaGraduationCap /> },
            { label: 'Semester 5', link: './self-study/semester5', icon: <FaGraduationCap /> },
            { label: 'Semester 6', link: './self-study/semester6', icon: <FaGraduationCap /> },
            ],
        }, 
      ]
    },
    { label: 'Timetable', link: './timetable', icon: <FaCalendarAlt /> },
];

export default menuItems;