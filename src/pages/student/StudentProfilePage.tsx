import React, { useState, useRef } from "react";
import { FaEye, FaEyeSlash, FaCamera } from "react-icons/fa";
import "../../styles/StudentProfile.css";

const StudentProfilePage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profileImage, setProfileImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQksR3Lt2Iy2rlmUKvJmc27GcXpe297gINhTA&s"
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const togglePasswordVisibility = (field: string) => {
    if (field === "current") setShowCurrentPassword(!showCurrentPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSaveChanges = () => {
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match!");
      return;
    }
    console.log("Save changes:", { currentPassword, newPassword, confirmPassword });
  };

  return (
    <div className="profile-container">
      <h2>Personal Information</h2>
      <div className="personal-info">
        <div className="profile-image-container">
          <img src={profileImage} alt="Profile" className="profile-image" />
          <button className="image-upload-button" onClick={triggerFileInput}>
            <FaCamera />
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>
        <div className="info">
          <p className="name">Võ Thị Thu Hiền</p>
          <p className="class">PNV26B</p>
          <p className="email">vothithuhien1315@gmail.com</p>
        </div>
      </div>
      <div className="personal-info">
        <div className="info-item">
          <label htmlFor="name" className="title-input">
            Name:
          </label>
          <input type="text" placeholder="Vo Thi Thu Hien" id="name" />
        </div>
        <div className="info-item">
          <label htmlFor="class" className="title-input">
            Class:
          </label>
          <input type="text" placeholder="Class A" id="class" />
        </div>
        <div className="info-item">
          <label htmlFor="email" className="title-input">
            Email:
          </label>
          <input type="text" placeholder="vothithuhien1315@gmail.com" id="email" />
        </div>
      </div>
      <div className="Password">Password</div>
      <div className="password-section">
        <div className="password-inputs">
          <div className="current-pass">
            <label htmlFor="current-password" className="title-input">
              Current password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="current-password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <span
                className="password-toggle-icon"
                onClick={() => togglePasswordVisibility("current")}
              >
                {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="new-pass">
            <label htmlFor="new-password" className="title-input">
              New password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showNewPassword ? "text" : "password"}
                id="new-password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <span
                className="password-toggle-icon"
                onClick={() => togglePasswordVisibility("new")}
              >
                {showNewPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <div className="confirm-pass">
            <label htmlFor="confirm-password" className="title-input">
              Confirm password
            </label>
            <div className="password-input-wrapper">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirm-password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <span
                className="password-toggle-icon"
                onClick={() => togglePasswordVisibility("confirm")}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
          <button onClick={handleSaveChanges} className="save-button">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;