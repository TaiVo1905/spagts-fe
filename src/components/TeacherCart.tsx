import { useEffect, useState } from "react";
import moduleService, { Module } from "../services/moduleService";
import { useAuth } from "../store/AuthContext";
import { useLocation } from "react-router-dom";

const TeacherCard = () => {
  const { user } = useAuth();
  const [modules, setModules] = useState<Module[]>([]);
  const location = useLocation();
  
  useEffect(() => {
    const fetchModules = async () => {
      try {
        const response = await moduleService.getUserModules(user.id);
        setModules(response.data);
      } catch (error) {
        console.error("Error fetching modules:", error);
      }
    };
    
    if (user?.id) {
      fetchModules();
    }
  }, [user?.id]);

  const module = modules.find((module) => module.id === Number(location.pathname[location.pathname.length - 1]));

  return (
    <div className="flex rounded-xl overflow-hidden shadow-md h-[261px]">
      <div
        className="bg-cover bg-center w-[70%] h-full"
        style={{
          backgroundImage: `url("https://i.pinimg.com/736x/36/b0/23/36b023762ab3337d3eba0d0c253785f9.jpg")`,
        }}
      />
      <div className="bg-[#FFF5EB] flex justify-center items-center p-4 w-[30%] h-full">
        <img
          src={user?.imageUrl || "https://i.pinimg.com/736x/83/40/99/8340999014aee07ce2b7029bc98eb463.jpg"}
          alt={user?.name}
          className="rounded-full mr-4 w-[76px] h-[76px]"
        />
        <div>
          <h2 className="text-lg font-semibold">{module?.name}</h2>
          <p className="text-base text-gray-800">{user?.name}</p>
          <a
            href={`mailto:${user?.email}`}
            className="text-sm text-blue-500 underline"
          >
            {user?.email}
          </a>
        </div>
      </div>
    </div>
  );
};

const TeacherList = () => {
  return (
    <div className="p-6">
      <TeacherCard />
    </div>
  );
};

export default TeacherList;