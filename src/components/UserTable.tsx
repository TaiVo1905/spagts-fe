import React, { useEffect, useState } from "react";
import { FaCaretDown, FaTrash, FaAngleDown } from "react-icons/fa";

interface User {
  id: number;
  name: string;
  imageUrl: string;
  email: string;
  roles: string;
  created_at: string;
}

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/users");
        const data = await response.json();
        setUsers(data.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/v1/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
        alert("User deleted successfully.");
      } else {
        alert("Failed to delete user.");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[calc(100vw-300px)] p-4">
      <div className="overflow-auto max-h-[480px] tailwind-custom-scrollbar">
        <table className="min-w-[1000px] w-full border-separate border-spacing-y-3">
          <thead className="sticky top-0 z-10">
            <tr className="flex items-center pl-4 bg-(--light-color)">
              <th className="w-[10%] text-sm text-(--text-color)/80 py-3">Id <FaCaretDown /></th>
              <th className="text-sm w-[25%] text-(--text-color)/80 py-3">Name <FaCaretDown /></th>
              <th className="text-sm w-[25%] text-(--text-color)/80 py-3">Email <FaCaretDown /></th>
              <th className="text-sm w-[15%] text-(--text-color)/80 py-3">Date <FaCaretDown /></th>
              <th className="text-sm w-[10%] text-(--text-color)/80 py-3">Role <FaCaretDown /></th>
              <th className="text-sm w-[15%] text-(--text-color)/80 py-3"></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td colSpan={6} className="py-0.5">
                  <div className="bg-white rounded-lg shadow p-4 hover:bg-gray-100 flex items-center justify-between">
                    <div className="w-[10%] text-sm text-(--text-color)/80">{user.id}</div>
                    <div className="w-[25%] text-sm text-(--text-color)/80 flex items-center gap-2">
                      <img src={user.imageUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                      <span>{user.name}</span>
                    </div>
                    <div className="w-[25%] text-sm text-(--text-color)/80">{user.email}</div>
                    <div className="w-[15%] text-sm text-(--text-color)/80">{user.created_at}</div>
                    <div className="w-[10%] text-sm text-(--text-color)/80 relative">
                      <div className="relative inline-block w-full">
                        <select className="appearance-none w-full px-4 py-2 bg-orange-50 rounded-full text-(--primary-color) font-semibold pr-2" defaultValue={user.roles}>
                          <option value="Student">Student</option>
                          <option value="Teacher">Teacher</option>
                          <option value="Admin">Admin</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-(--text-color)/80 pt-0.5 pr-2">
                          <FaAngleDown size={17} />
                        </div>
                      </div>
                    </div>
                    <div className="w-[15%] flex justify-center gap-3 text-(--text-color)/80 hover:text-red-400">
                      <FaTrash className="cursor-pointer hover:text-red-600" size={18} onClick={() => deleteUser(user.id)} />
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;