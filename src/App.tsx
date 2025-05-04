import './styles/App.css'
import { BrowserRouter } from "react-router-dom";
import ClassManagement from './pages/ClassManagement.tsx';

const App = () => {
  return (
    <BrowserRouter>
      <ClassManagement/>
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