import React, { useEffect, useState, useRef } from "react";
import userService from '../../services/userService';
import { useAuth } from '../../store/AuthContext';
import { Toaster, toast } from "react-hot-toast";
import LoadingToFetchData from "../../components/LoadingToFetchData";
import { FaEye, FaEyeSlash, FaCamera } from 'react-icons/fa';

const StudentProfilePage: React.FC = () => {
  const { user, loading } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [avatar, setAvatar] = useState(user?.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  const handleSaveChanges = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    try {
      const data = {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword
      };
      
      await userService.updatePassword(user?.id || 0, data);
      toast.success('Password updated successfully');
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  const handleUpdateField = async (field: 'name' | 'email', value: string) => {
    if (!user?.id) return;

    try {
      const data = { [field]: value };
      await userService.updateProfile(user.id, data) && toast.success(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || `Failed to update ${field}`);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, field: 'name' | 'email') => {
    if (e.key === 'Enter') {
      handleUpdateField(field, field === 'name' ? name : email);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id || !e.target.files || !e.target.files[0]) return;
    setIsUploading(true);
    try {
      const file = e.target.files[0];
      const response = await userService.uploadAvatar(user.id, file);
      setAvatar(response.data.imageUrl
        
      );
      toast.success('Avatar updated successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update avatar');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading || isUploading) {
    return <LoadingToFetchData/>;
  }

  return (
    <>
      <Toaster 
        position="top-right"
      />
      <div className="w-full bg-white ml-[18px] mt-[21px] mr-[35px]">
        <h2 className="leading-[60px] text-[25px] font-bold border-b border-[#C5C1C1]">Personal Information</h2>
        <div className="flex items-center mb-5 mt-5">
          <div className="relative w-[120px] h-[120px] mr-5">
            <img
              src={avatar}
              alt="Profile"
              className="w-[120px] h-[120px] rounded-full object-cover"
            />
            <div 
              className="absolute inset-0 bg-black/50 rounded-full flex justify-center items-center cursor-pointer opacity-0 hover:opacity-100 transition-opacity duration-300"
              onClick={() => fileInputRef.current?.click()}
            >
              <FaCamera className="text-white text-2xl" />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarUpload}
              accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
            />
          </div>
          <div className="flex flex-col">
            <p className="text-xl font-bold">{name}</p>
            <p className="text-sm text-gray-600 my-1">PNV26B</p>
            <p className="text-sm text-gray-600 my-1">{email}</p>
          </div>
        </div>
        <div className="flex mb-5 rounded gap-[30px]">
          <div className="flex-1 mx-2.5">
            <label htmlFor="name" className="text-sm text-[#85877E] font-bold block mb-1.5">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'name')}
              className="w-full border border-[#EEEEEE] h-12 pl-5 rounded-lg"
            />
          </div>
          <div className="flex-1 mx-2.5">
            <label htmlFor="class" className="text-sm text-[#85877E] font-bold block mb-1.5">Class:</label>
            <input 
              type="text" 
              placeholder="Class A" 
              id="class"
              className="w-full border border-[#EEEEEE] h-12 pl-5 rounded-lg"
            />
          </div>
          <div className="flex-1 mx-2.5">
            <label htmlFor="email" className="text-sm text-[#85877E] font-bold block mb-1.5">Email:</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, 'email')}
              className="w-full border border-[#EEEEEE] h-12 pl-5 rounded-lg"
            />
          </div>
        </div>
        <div className="font-bold text-2xl text-left leading-[50px] border-b border-[#C5C1C1]">Password</div>
        <div className="mt-[30px] w-full flex flex-row gap-[30px] items-center">
          <div className="w-full flex flex-row justify-between items-center mb-2.5">
            <div className="text-sm w-1/4 flex flex-col gap-2.5">
              <label htmlFor="current_password" className="text-sm text-[#85877E] font-bold block mb-1.5">Current password</label>
              <div className="relative w-full">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  id="current_password"
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full pr-10 border border-[#EEEEEE] h-12 pl-5 rounded-lg"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#85877E] p-1.5 flex items-center justify-center hover:text-[#00BFFF]"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="text-sm w-1/4 flex flex-col gap-2.5">
              <label htmlFor="password" className="text-sm text-[#85877E] font-bold block mb-1.5">New password</label>
              <div className="relative w-full">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pr-10 border border-[#EEEEEE] h-12 pl-5 rounded-lg"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#85877E] p-1.5 flex items-center justify-center hover:text-[#00BFFF]"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className="text-sm w-1/4 flex flex-col gap-2.5">
              <label htmlFor="confirmPassword" className="text-sm text-[#85877E] font-bold block mb-1.5">Confirm password</label>
              <div className="relative w-full">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pr-10 border border-[#EEEEEE] h-12 pl-5 rounded-lg"
                />
                <button
                  type="button"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-[#85877E] p-1.5 flex items-center justify-center hover:text-[#00BFFF]"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <button 
              onClick={handleSaveChanges} 
              className="inline-block px-5 py-2.5 bg-[#00BFFF] border-none rounded-full text-white text-base text-center cursor-pointer relative top-[15px] hover:bg-[#0056b3]"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentProfilePage;

function setSuccess(arg0: string) {
  throw new Error("Function not implemented.");
}
