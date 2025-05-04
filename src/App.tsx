import './styles/App.css'

import React from 'react';
import TeacherCard from './components/ClassCard';

function App() {
  return (
    <div>
      <TeacherCard 
        title="IT English"
        name="Nguyễn Thị Thùy Trang"
        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
      />
    </div>
  );
}

export default App;

