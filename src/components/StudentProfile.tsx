import React, { useState } from 'react';
import '../styles/StudentProfile.css';

const StudentProfile: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveChanges = () => {
    console.log('Save changes:', { currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="profile-container">
      <h2>Personal Information</h2>
      <div className="personal-info">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQksR3Lt2Iy2rlmUKvJmc27GcXpe297gINhTA&s" alt="Profile" className="profile-image" />
        <div className="info">
          <p className="name">Võ Thị Thu Hiền</p>
          <p className="class">PNV26B</p>
          <p className="email">vothithuhien1315@gmail.com</p>
        </div>
      </div>
      <div className="personal-info">
        <div className="info-item">
          <label htmlFor="name" className='title-input'>Name:</label>
          <input type="text" placeholder='Vo Thi Thu Hien' id='name' />
        </div>
        
        <div className="info-item">
          <label htmlFor="class" className='title-input'>Class:</label>
          <input type="text" placeholder='Class A' id='class' />
        </div>

        <div className="info-item">
          <label htmlFor="email" className='title-input'>Email:</label>
          <input type="text" placeholder='vothithuhien1315@gmail.com' id='email' />
        </div>
      </div>
      <div className="Password">Password</div>
      <div className="password-section">
        <div className="password-inputs">
          <div className="current-pass">
            <label htmlFor="current-password" className='title-input'>Current password</label>
            <input
              type="password"
              id="current-password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
           <div className="new-pass">
            <label htmlFor="new-password" className='title-input'>New password</label>
            <input
              type="password"
              id="new-password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="confirm-pass">
            <label htmlFor="confirm-password" className='title-input'>Confirm password</label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button onClick={handleSaveChanges} className="save-button">
          Save Changes
        </button>
        </div>
        
      </div>
    </div>
  );
};

export default StudentProfile;