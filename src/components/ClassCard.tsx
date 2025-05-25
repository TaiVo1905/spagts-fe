import React from 'react';
import { FaEllipsisV, FaUserFriends } from 'react-icons/fa';
import '../styles/App.css';

interface TeacherProps {
  className: string;
  teacherName: string;
  imageUrl: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

const ClassCard: React.FC<TeacherProps> = ({ 
  className, 
  teacherName, 
  imageUrl, 
  onEdit, 
  onDelete 
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit?.();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onDelete?.();
  };

  return (
    <div className="relative w-[249px] h-[186px] border border-gray-300 rounded-[15px] shadow-md overflow-hidden m-5 bg-(--light-color) transform transition duration-300 hover:scale-105 hover:shadow-lg">
      
      <div
        className="h-[60px] bg-cover bg-center relative"
        style={{ backgroundImage: "url('https://cdn-icons-png.flaticon.com/512/3763/3763102.png')" }}
      >
        <div 
          className="absolute top-2 right-2 text-gray-600 text-[20px] cursor-pointer hover:text-gray-800 transition"
          onClick={handleMenuClick}
        >
          <FaEllipsisV />
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg z-10">
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button 
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
            </div>
          )}
        </div>

        <img
          src={imageUrl}
          alt={teacherName}
          className="w-[59px] h-[58px] rounded-full object-cover border-4 border-white absolute top-[30px] right-[10px] shadow-md"
        />
      </div>

      <div className="p-4 pt-6 text-left">
        <h2 className="text-[20px] font-bold mb-2">{className}</h2>
        <p className="text-[16px] text-gray-800">{teacherName}</p>

        <div className="flex justify-end text-(--primary-color) text-[25px] mt-2 cursor-pointer hover:text-(--primary-color)/90 transition">
          <FaUserFriends />
        </div>
      </div>
    </div>
  );
};

export default ClassCard;