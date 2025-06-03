import ClassCard from "../../components/ClassCard.tsx";
import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination.tsx";
import { classService } from "../../services/classService";
import { toast } from 'react-hot-toast';
import LoadingToFetchData from "../../components/LoadingToFetchData.tsx";
import { Class } from "../../interface/Interface.ts";
import Button from "../../components/Button.tsx";
import UserModal from "../../components/UserModal.tsx";

const ClassManagementPage: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [isEditClass, setIsEditClass] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const [page, setPage] = useState(1);
    const [classes, setClasses] = useState<Class[]>([]);
    const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
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
    }, [page, reload]);

    // Separate effect for filtering
    useEffect(() => {
        if (searchQuery) {
            const filtered = classes.filter(cls => 
                cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                cls.teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredClasses(filtered);
        } else {
            setFilteredClasses(classes);
        }
    }, [searchQuery, classes]);

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

    const handleAddClick = () => {
        setEditingClass(null);
        setIsEditClass(false);
        setModalOpen(true);
    };

    const handleModalSuccess = () => {
        setModalOpen(false);
        setReload(r => !r);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="p-4 w-full">
            <div className="flex items-center justify-end mb-3">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search classes..."
                        value={searchQuery}
                        onChange={handleSearch}
                        className="w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ×
                        </button>
                    )}
                </div>
                <Button
                    text="Add"
                    onClick={handleAddClick}
                    className='ml-4'
                />
            </div>
            <div className="flex flex-wrap w-[calc(100vw-300px)] content-start px-[16px] overflow-auto h-[calc(100vh-120px)]">
                {filteredClasses.length === 0 ? (
                    <div className="w-full text-center text-gray-500 mt-8">
                        {searchQuery ? 'No classes found matching your search' : 'No classes available'}
                    </div>
                ) : (
                    filteredClasses.map((cls) => (
                        <ClassCard
                            key={cls.id}
                            id={cls.id}
                            name={cls.name}
                            teacher={cls.teacher}
                            onEdit={() => {
                                setEditingClass(cls);
                                setIsEditClass(true);
                                setModalOpen(true);
                            }}
                            onDelete={async () => {
                                if (window.confirm('Are you sure you want to delete this class?')) {
                                    try {
                                        await classService.delete(cls.id);
                                        setReload(r => !r);
                                    } catch (err) {
                                        toast.error('Failed to delete class');
                                    }
                                }
                            }}
                        />
                    ))
                )}
            </div>
            {filteredClasses.length > 0 && (
                <Pagination 
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={setPage}
                />
            )}
            <UserModal 
                open={modalOpen} 
                onClose={() => setModalOpen(false)} 
                onSuccess={handleModalSuccess}
                editClass={editingClass}
                isEditClass={isEditClass}
            />
        </div>
    );
};

export default ClassManagementPage;