import React from "react";
import { FaCaretDown, FaEllipsisH,FaAngleDown  } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  email: string;
  date: string;
  role: string;
  avatar: string;
}

const users: User[] = [
  {
    id: "#876364",
    name: "Arrora Gaur",
    email: "imjackhehehe@gmail.com",
    date: "12 Dec, 2025",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=5",
  },
  {
    id: "#876123",
    name: "James Mullican",
    email: "musiala@gmail.com",
    date: "10 Dec, 2025",
    role: "Student",
    avatar: "https://i.pravatar.cc/150?img=11",
  },
  {
    id: "#876124",
    name: "Liam Daniels",
    email: "liam.daniels@gmail.com",
    date: "09 Dec, 2025",
    role: "Teacher",
    avatar: "https://i.pravatar.cc/150?img=12",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
  {
    id: "#876125",
    name: "Sophie Tran",
    email: "sophie.tran@gmail.com",
    date: "08 Dec, 2025",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=13",
  },
];

const UserTable: React.FC = () => {
  return (
    <div className="w-[calc(100vw-300px)] p-4">
      <div className="overflow-auto max-h-[480px] tailwind-custom-scrollbar">
      <table className="min-w-[1000px] w-full border-separate border-spacing-y-3">
        <thead className="sticky top-0 z-10">
          <tr className="flex items-center pl-4 bg-(--light-color)">
            <th className="w-[10%] text-sm text-(--text-color)/80 py-3">
              <div className="flex items-center">
                Id <FaCaretDown />
              </div>
            </th>
            <th className="text-sm w-[25%] text-(--text-color)/80 py-3">
              <div className="flex items-center">
                Name <FaCaretDown />
              </div>
            </th>
            <th className="text-sm  w-[25%] text-(--text-color)/80 py-3">
              <div className="flex items-center">
                Email <FaCaretDown />
              </div>
            </th>
            <th className="text-sm  w-[15%] text-(--text-color)/80 py-3">
              <div className="flex items-center">
                Date <FaCaretDown />
              </div>
            </th>
            <th className="text-sm  w-[10%] text-(--text-color)/80 py-3">
              <div className="flex items-center">
                Role <FaCaretDown />
              </div>
            </th>
            <th className="text-sm  w-[15%] text-(--text-color)/80 py-3">
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user, idx) => (
            <tr key={idx}>
              <td colSpan={6} className="py-0.5">
                <div className="bg-white rounded-lg shadow p-4 hover:bg-gray-100 flex items-center justify-between">
                  <div className="w-[10%] text-sm text-(--text-color)/80">{user.id}</div>

                  <div className="w-[25%] text-sm text-(--text-color)/80 flex items-center gap-2">
                    <img
                      src={user.avatar}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span>{user.name}</span>
                  </div>

                  <div className="w-[25%] text-sm text-(--text-color)/80">{user.email}</div>
                  <div className="w-[15%] text-sm text-(--text-color)/80">{user.date}</div>

                  <div className="w-[10%] text-sm text-(--text-color)/80 relative">
                    <div className="relative inline-block w-full">
                      <select
                        className="appearance-none w-full px-4 py-2 bg-orange-50 rounded-full text-(--primary-color) font-semibold pr-2"
                        defaultValue={user.role}
                      >
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
                    <FaEllipsisH className="cursor-pointer hover:text-red-600" size={18} />
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
