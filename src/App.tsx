import './styles/App.css'

// import React from 'react';
// import TeacherCard from './components/ClassCard';

// function App() {
//   return (
//     <div>
//       <TeacherCard 
//         title="IT English"
//         name="Nguyễn Thị Thùy Trang"
//         imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
//       />
//     </div>
//   );
// }

// export default App;
import React from 'react';
import Sidebar from './components/Sidebar';
import { FaUser, FaTrophy, FaLayerGroup, FaGraduationCap } from 'react-icons/fa';

const App = () => {

  const menuItems = [
    { label: 'My profile', link: '/profile', icon: <FaUser /> },
    { label: 'Achievement', link: '/achievement', icon: <FaTrophy /> },
    {
      label: 'Semester goals', 
      link: '#', 
      icon: <FaLayerGroup />,
      children: [
        { label: 'Semester 1', link: '#', icon: <FaGraduationCap /> },  
        { label: 'Semester 2', link: '#', icon: <FaGraduationCap /> },
      ],
    },
    {
      label: 'Learning journal',
      link: '#', 
      icon: <FaGraduationCap />,
      children: [
        { label: 'In-class', link: '/in-class', icon: <FaGraduationCap /> },
        { label: 'Self-study', link: '/self-study', icon: <FaGraduationCap /> }, 
      ]
    },
  ];
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar menuItems={menuItems} />
      <div style={{ padding: '20px' }}>Hello, Content here!</div>
    </div>
  );
};

export default App;