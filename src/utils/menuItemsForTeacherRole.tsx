import { FaGraduationCap } from "react-icons/fa";
import { useAuth } from "../store/AuthContext";
import moduleService from "../services/moduleService";
import { JSX, useEffect, useState } from "react";


const menuItems = () => {
    const { user } = useAuth();
    
    const [items, setItems] = useState<Array<{ 
        label: string; 
        link: string; 
        icon: JSX.Element 
    }>>([]);

    useEffect(() => {
        if (!user) return;

        const fetchModules = async () => {
            try {
                const response = await moduleService.getUserModules(user.id);
                const teacherModules = response.data;
                
                const mappedItems = teacherModules.map((teacherModule: any) => ({
                    label: teacherModule.name,
                    link: `/teacher/Dashboard/modules/${teacherModule.id}`, 
                    icon: <FaGraduationCap />
                }));
                
                setItems(mappedItems);
            } catch (error) {
                console.error("Failed to fetch modules:", error);
            }
        };

        fetchModules();
    }, [user]);

    return items;
};
export default menuItems;