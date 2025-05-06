import React from 'react';
import '../styles/StudentCard.css'; 

interface StudentCardProps {
  name: string;
  imageUrl: string;
  onAccessClick: () => void;
}

const StudentCard: React.FC<StudentCardProps> = ({ name, imageUrl, onAccessClick }) => {
  return (
    <div className="student-profile-card">
      <img
        src={imageUrl}
        alt={name}
      />
      <h3>{name}</h3>
      <button onClick={onAccessClick} className="access-button">
        Access
      </button>
    </div>
  );
};

export default StudentCard; 