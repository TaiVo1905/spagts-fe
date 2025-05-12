import React, { useEffect, useState } from "react";
import '../../styles/StudentProfile.css';
import userService from '../../services/userService';
import { useAuth } from '../../store/AuthContext';
import { Toaster, toast } from "react-hot-toast";
import LoadingToFetchData from "../../components/LoadingToFetchData";

const StudentProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setError('');
    setSuccess('');

    try {
      const data = {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      };
      
      await userService.updatePassword(user?.id || 0, data);
      setSuccess('Password updated successfully');
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleUpdateField = async (field: 'name' | 'email', value: string) => {
    if (!user?.id) return;

    setError('');
    setSuccess('');

    try {
      const data = { [field]: value };
      await userService.updateProfile(user.id, data);
      setSuccess(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to update ${field}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'name' | 'email') => {
    if (e.key === 'Enter') {
      handleUpdateField(field, field === 'name' ? name : email);
    }
  };

  if (loading) {
    return (
      <LoadingToFetchData/>
    );
  }

  useEffect( () => {
    if(error.length > 0) {
      toast.error(error);
    }
    if(success.length > 0) {
      toast.success(success);
    }
  }, [error, success]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <div className="profile-container">
        <h2>Personal Information</h2>
        <div className="personal-info">
          <img
            src={user?.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"}
            alt="Profile"
            className="profile-image"
          />
          <div className="info">
            <p className="name">{name}</p>
            <p className="class">PNV26B</p>
            <p className="email">{email}</p>
          </div>
        </div>
        <div className="personal-info">
          <div className="info-item">
            <label htmlFor="name" className="title-input">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'name')}
            />
          </div>
          <div className="info-item">
            <label htmlFor="class" className="title-input">Class:</label>
            <input type="text" placeholder="Class A" id="class" />
          </div>
          <div className="info-item">
            <label htmlFor="email" className="title-input">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'email')}
            />
          </div>
        </div>
        <div className="Password">Password</div>
        <div className="password-section">
          <div className="password-inputs">
            <div className="current-pass">
              <label htmlFor="current_password" className="title-input">Current password</label>
              <input
                type="password"
                id="current_password"
                placeholder="Current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="new-pass">
              <label htmlFor="password" className="title-input">New password</label>
              <input
                type="password"
                id="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="confirm-pass">
              <label htmlFor="confirmPassword" className="title-input">Confirm password</label>
              <input
                type="password"
                id="confirmPassword"
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
    </>
  );
};

export default StudentProfilePage;