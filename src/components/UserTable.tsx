import React, { useEffect, useState } from "react";
import { FaCaretDown, FaTrash, FaAngleDown, FaEdit } from "react-icons/fa";
import LoadingToFetchData from "./LoadingToFetchData";
import userService, { AddUserPayload, UserResponse } from "../services/userService";
import  UserModal  from "./UserModal";
import axiosClient from "../services/axiosClient";
import Pagination from "./Pagination";
import toast from "react-hot-toast";

interface User {
  id: number;
  name: string;
  imageUrl?: string;
  email: string;
  roles: string;
  created_at: string;
}

interface UserTableProps {
  reload?: boolean;
  searchQuery?: string;
  onReload?: () => void;
}

const UserTable: React.FC<UserTableProps> = ({ reload, searchQuery = '', onReload }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [userEdit, setUserEdit] = useState<AddUserPayload | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = (await userService.getUsers(page, 10)).data;
        setUsers(response.data);
        setFilteredUsers(response.data);
        setTotalPages(response.meta?.last_page || 1);
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, reload]);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers([...filtered]);
    } else {
      setFilteredUsers([...users]);
    }
  }, [searchQuery, users]);

  const handleEditUser = async (id: number) => {
    try {
      const response = await axiosClient.get(`/users/${id}`);
      const userData = response.data.data;
      setUserEdit({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        roles: userData.roles,
        password: '',
        password_confirmation: ''
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    }
  };

  if (loading) {
    return <LoadingToFetchData />;
  }

  return (
    <>
      <div className="w-[calc(100vw-300px)] p-4">
        <div className="overflow-auto max-h-[480px] tailwind-custom-scrollbar">
          <table className="min-w-[1000px] w-full border-separate border-spacing-y-3">
            <thead className="sticky top-0 z-10">
              <tr className="flex items-center pl-4 bg-(--light-color)">
                <th className="w-[10%] text-sm text-(--text-color)/80 px-2 py-3">
                  <div className="flex items-center">Id <FaCaretDown /></div>
                </th>
                <th className="text-sm w-[25%] text-(--text-color)/80 py-3">
                  <div className="flex items-center">Name <FaCaretDown /></div>
                </th>
                <th className="text-sm w-[25%] text-(--text-color)/80 py-3">
                  <div className="flex items-center">Email <FaCaretDown /></div>
                </th>
                <th className="text-sm w-[15%] text-(--text-color)/80 py-3">
                  <div className="flex items-center">Date <FaCaretDown /></div>
                </th>
                <th className="text-sm w-[10%] text-(--text-color)/80 py-3">
                  <div className="flex items-center">Role <FaCaretDown /></div>
                </th>
                <th className="text-sm w-[15%] text-(--text-color)/80 py-3">
                  <div className="flex items-center">Options <FaCaretDown /></div>
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td colSpan={6} className="py-0.5">
                    <div className="bg-white rounded-lg shadow p-4 hover:bg-gray-100 flex items-center justify-between break-all">
                      <div className="w-[10%] text-sm text-(--text-color)/80 px-2">{user.id}</div>
                      <div className="w-[25%] text-sm text-(--text-color)/80 px-2 flex items-center gap-2">
                        <img
                          src={user.imageUrl || "https://cdn-icons-png.flaticon.com/512/10892/10892514.png"}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <span>{user.name}</span>
                      </div>
                      <div className="w-[25%] text-sm text-(--text-color)/80 px-2">{user.email}</div>
                      <div className="w-[15%] text-sm text-(--text-color)/80 px-2">{user.created_at}</div>
                      <div className="w-[10%] text-sm text-(--text-color)/80 px-2 relative">
                        <div className="relative inline-block w-full">
                          <select
                            className="appearance-none w-full px-4 py-2 bg-orange-50 rounded-full text-(--primary-color) font-semibold pr-2"
                            defaultValue={user.roles}
                            onChange={async(e) => {
                              try {
                                await userService.updateRole(user.id, {roles: e.target.value});
                                toast.success(`Updated ${user.name}'s role successfully!`);
                                if (onReload) onReload();
                              } catch (error) {
                                toast.error("Failed to update role");
                              }
                            }}
                          >
                            <option value="Student">Student</option>
                            <option value="Teacher">Teacher</option>
                            <option value="Admin">Admin</option>
                          </select>
                          <div className="pointer-events-none absolute right-[1px] top-1/2 -translate-y-1/2 text-(--text-color)/80 pt-0.5 pr-2">
                            <FaAngleDown size={17} />
                          </div>
                        </div>
                      </div>
                      <div className="w-[15%] flex justify-center gap-3 text-(--text-color)/80">
                        <FaEdit
                          className="cursor-pointer hover:text-red-600" 
                          size={18}
                          onClick={() => handleEditUser(user.id)}
                        />
                        <FaTrash
                          className="cursor-pointer hover:text-red-600"
                          size={18}
                          onClick={() => userService.deleteUser(user.id, setUsers)}
                        />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <UserModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={() => setModalOpen(false)}
          isUserManagement={true}
          editUser={true}
          selectedUser={userEdit}
          initialStateEdit={userEdit ? userEdit : undefined}
        />
      </div>
      <Pagination 
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </>
  );
};

export default UserTable;
