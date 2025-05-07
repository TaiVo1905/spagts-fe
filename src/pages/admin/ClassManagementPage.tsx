import ClassCard from "../../components/ClassCard.tsx";
import React, { useState } from "react";
import Pagination from "../../components/Pagination.tsx";

const ClassManagementPage: React.FC = () => {
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
    );
}

export default ClassManagementPage;