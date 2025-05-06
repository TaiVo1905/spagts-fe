import Sidebar from "../components/Sidebar";
import MainLayout from "../layouts/MainLayout";
import Header from "../components/Header";
import Avatar from "../components/Avatar";
import menuItems from "../utils/menuItemsForStudentRole.tsx";
import StudentProfile from "../components/StudentProfile";

const StudentProfilePage: React.FC = () => {
    const menuItemsForStudentRole = menuItems;
     
    return (
        <MainLayout
            Header = {<Header
                Avatar={
                    <Avatar
                        name="Nguyễn Thị Thùy Trang"
                        imageUrl="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
                        className="w-[48px] h-[48px]"
                    />
                }
            />}
            Sidebar = {<Sidebar menuItems={menuItemsForStudentRole}></Sidebar>}
            Content = {
                <>
                    <StudentProfile />
                </>
            }
        >

        </MainLayout>
    );
}

export default StudentProfilePage;