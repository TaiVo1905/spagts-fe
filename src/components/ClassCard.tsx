import React, { useState } from 'react';
import { FaEllipsisV, FaUserFriends } from 'react-icons/fa';
import { classUserService } from '../services/classUserService';
import { toast } from 'react-hot-toast';
import '../styles/App.css';

interface ClassCardProps {
  id: number;
  name: string;
  teacher: {
    id: number;
    name: string;
    imageUrl?: string;
  };
  onEdit?: () => void;
  onDelete?: () => void;
}

const ClassCard: React.FC<ClassCardProps> = ({ 
  id,
  name, 
  teacher, 
  onEdit, 
  onDelete
}) => {
  const [showMenu, setShowMenu] = React.useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [users, setUsers] = useState<any>({ students: [], teachers: [] });
  const [loading, setLoading] = useState(false);

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

  const handleShowUsers = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      const response = await classUserService.getClassUsers(id);
      setUsers(response.data);
      setShowUserList(true);
    } catch (error) {
      toast.error('Failed to load class members');
    } finally {
      setLoading(false);
    }
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
          src={teacher.imageUrl || "https://cdn-icons-png.flaticon.com/512/10892/10892514.png"}
          alt={teacher.name}
          className="w-[59px] h-[58px] rounded-full object-cover border-4 border-white absolute top-[30px] right-[10px] shadow-md"
        />
      </div>

      <div className="p-4 pt-6 text-left">
        <h2 className="text-[20px] font-bold mb-2">{name}</h2>
        <p className="text-[16px] text-gray-800">{teacher.name}</p>

        <div className="flex justify-end text-(--primary-color) text-[25px] mt-2 cursor-pointer hover:text-(--primary-color)/90 transition">
          <FaUserFriends onClick={handleShowUsers} />
        </div>
      </div>

      {showUserList && (
        <div className="absolute top-full left-0 mt-2 w-[300px] bg-white rounded-lg shadow-lg p-4 z-10">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Class Members</h4>
            <button
              onClick={() => setShowUserList(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-2">Loading...</div>
          ) : (
            <>
              <div className="mb-4">
                <h5 className="font-medium mb-2">Teachers</h5>
                <div className="space-y-1">
                  {users.teachers.map((teacher: any) => (
                    <div key={teacher.id} className="flex items-center text-sm">
                      <img
                        src={teacher.image_url || "https://cdn-icons-png.flaticon.com/512/10892/10892514.png"}
                        alt={teacher.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span>{teacher.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-medium mb-2">Students</h5>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {users.students.map((student: any) => (
                    <div key={student.id} className="flex items-center text-sm">
                      <img
                        src={student.image_url || "https://cdn-icons-png.flaticon.com/512/10892/10892514.png"}
                        alt={student.name}
                        className="w-6 h-6 rounded-full mr-2"
                      />
                      <span>{student.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ClassCard;