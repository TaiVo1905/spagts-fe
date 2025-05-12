import ClassCard from "../../components/ClassCard.tsx";
import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination.tsx";
import { classService } from "../../services/classService";
import { toast } from 'react-hot-toast';
import LoadingToFetchData from "../../components/LoadingToFetchData.tsx";
import { Class } from "../../interface/Interface.ts";

const ClassManagementPage: React.FC = () => {
    const [page, setPage] = useState(1);
    const [classes, setClasses] = useState<Class[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClasses = async (pageNumber: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await classService.getClasses(pageNumber);
            setClasses(response.data);
            setTotalPages(response.meta?.last_page || 1);
        } catch (err) {
            setError('Failed to fetch classes');
            toast.error('Failed to load classes');
            console.error('Error fetching classes:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses(page);
    }, [page]);

    if (loading) {
        return (<LoadingToFetchData/>);
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-wrap w-[100%] justify-center content-start px-[16px] overflow-auto h-[calc(100vh-120px)]">
                {classes.map((cls) => (
                    <ClassCard
                        key={cls.id}
                        title={cls.title}
                        name={cls.name}
                        imageUrl={cls.imageUrl}
                    />
                ))}
            </div>
            <Pagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </>
    );
};

export default ClassManagementPage;