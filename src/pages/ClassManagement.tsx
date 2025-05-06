import ClassCard from "../components/ClassCard";
import Sidebar from "../components/Sidebar";
import MainLayout from "../layouts/MainLayout";
import React, { useState } from "react";
import Header from "../components/Header";
import Avatar from "../components/Avatar";
import menuItems from "../utils/menuItemsForStudentRole.tsx";
import Pagination from "../components/Pagination.tsx";

const ClassManagement: React.FC = () => {
    const menuItemsForStudentRole = menuItems;
    const [page, setPage] = useState(1);
    const startIndex = (page - 1) * 12;
    const endIndex = startIndex + 12;
    
    const classes = [
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        },
        {
            title: "IT English",
            name: "Nguyễn Thị Thùy Trang",
            imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"
        }

    ]
    const paginatedClasses = classes.slice(startIndex, endIndex);
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
                    <div className="flex flex-wrap w-[100%] justify-center content-start px-[16px] overflow-auto h-[calc(100vh-120px)]">
                    {paginatedClasses.map((cls) => (
                        <ClassCard
                            key={cls.imageUrl}
                            title={cls.title}
                            name={cls.name}
                            imageUrl={cls.imageUrl}
                        />
                    ))}
                    </div>
                    <Pagination currentPage={page}
                    totalPages={Math.ceil(classes.length/10)}
                    onPageChange={setPage}
                    ></Pagination>
                </>
            }
        >

        </MainLayout>
    );
}

export default ClassManagement;