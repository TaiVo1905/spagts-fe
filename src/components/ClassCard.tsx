import React from 'react';
import { FaEllipsisV, FaUserFriends } from 'react-icons/fa';
import '../styles/App.css'
interface TeacherProps {
  title: string;
  name: string;
  imageUrl: string;
}

const Teacher: React.FC<TeacherProps> = ({ title, name, imageUrl }) => {
  return (
    <div className="relative w-[249px] h-[186px] border border-gray-300 rounded-[15px] shadow-md overflow-hidden m-5 bg-(--light-color) transform transition duration-300 hover:scale-105 hover:shadow-lg">
      
      <div
        className="h-[60px] bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/3763/3763102.png')" }}
      >
        <div className="absolute top-2 right-2 text-gray-600 text-[20px] cursor-pointer hover:text-gray-800 transition">
          <FaEllipsisV />
        </div>

        <img
          src={imageUrl}
          alt={name}
          className="w-[59px] h-[58px] rounded-full object-cover border-4 border-white absolute top-[30px] right-[10px] shadow-md"
        />
      </div>

      <div className="p-4 pt-6 text-left">
        <h2 className="text-[20px] font-bold mb-2">{title}</h2>
        <p className="text-[16px] text-gray-800">{name}</p>

        <div className="flex justify-end text-(--primary-color) text-[25px] mt-2 cursor-pointer hover:text-(--primary-color)/90 transition">
          <FaUserFriends />
        </div>
      </div>
    </div>
  );
};

export default Teacher;
