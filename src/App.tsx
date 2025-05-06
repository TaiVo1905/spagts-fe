import './styles/App.css'
import { BrowserRouter } from "react-router-dom";
import ClassManagement from './pages/ClassManagement.tsx';
import StudentProfilePage from './pages/StudentProfilePage.tsx';
import StudentCard from './components/StudentCard'; // Đường dẫn đến component StudentCard
import StudentProfile from './components/StudentProfile'; // Đường dẫn đến component StudentProfile
import StudentGoal from './components/StudentGoal';
const App = () => {
  return (
    <BrowserRouter>
      {/* <ClassManagement/> */}
      {/* <StudentCard
        name="John Doe"
        imageUrl="https://i.pinimg.com/736x/9e/92/c1/9e92c1bac422b24faa796fbfb37bb0d2.jpg"
        onAccessClick={handleAccessClick}
      /> */}
      {/* <StudentProfile />  */}
      {/* <StudentGoal /> */}
      <StudentProfilePage/>
    </BrowserRouter>
  );
}

export default App;
{/* import React from 'react';
import Sidebar from './components/Sidebar';
import { FaUser, FaTrophy, FaLayerGroup, FaGraduationCap } from 'react-icons/fa';

const App = () => {

  
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar menuItems={menuItems} />
      <div style={{ padding: '20px' }}>Hello, Content here!</div>
    </div>
  );
};

export default App; */}