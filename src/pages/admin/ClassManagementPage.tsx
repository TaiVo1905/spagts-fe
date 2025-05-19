import ClassCard from "../../components/ClassCard.tsx";
import React, { useState, useEffect } from "react";
import Pagination from "../../components/Pagination.tsx";
import { classService } from "../../services/classService";
import { toast } from 'react-hot-toast';
import LoadingToFetchData from "../../components/LoadingToFetchData.tsx";
import { Class } from "../../interface/Interface.ts";
import Button from "../../components/Button.tsx";
import ClassModal from "../../components/ClassModal.tsx";

const ClassManagementPage: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [reload, setReload] = useState(false);
    const [page, setPage] = useState(1);
    const [classes, setClasses] = useState<Class[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [editingClass, setEditingClass] = useState<Class | null>(null);
    const [isEditClass, setIsEditClass] = useState(false);
    

    
    useEffect(() => {
        const fetchClasses = async (pageNumber: number) => {
            try {
                setLoading(true);
                const response = await classService.getClasses(pageNumber);
                setClasses(response.data);
                setTotalPages(response.meta?.last_page || 1);
            } catch (err) {
                toast.error('Failed to load classes');
                console.error('Error fetching classes:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchClasses(page);
    }, [page, reload]);

    if (loading) {
        return (<LoadingToFetchData/>);
    }

    const handleAddClick = () => {
        setEditingClass(null);
        setIsEditClass(false);
        setModalOpen(true);
    };

    return (
        <div className="p-4 w-full">
            <div className="flex items-center justify-end mb-3">
                <div>
                <input
                    type="text"
                    placeholder="Search"
                    className="border rounded px-3 py-1"
                />
                </div>
                <Button
                text="Add"
                onClick={handleAddClick}
                className='ml-4'
                />
            </div>
            <div className="flex flex-wrap w-[calc(100vw-300px)]  content-start px-[16px] overflow-auto h-[calc(100vh-120px)]">
                {classes.map((cls) => (
                    <ClassCard
                        key={cls.id}
                        teacherName={cls.teacher.name}
                        className={cls.name}
                        imageUrl={cls.teacher.imageUrl || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQR-5mE4fCK8ve2inVMmTQkBeC3VeTeaXY9Lg&s"}
                        onEdit={() => {
                            setEditingClass(cls);
                            setIsEditClass(true);
                            setModalOpen(true);
                        }}
                        onDelete={async () => {
                          if (window.confirm('Are you sure you want to delete this class?')) {
                            try {
                              await classService.deleteClass(cls.id);
                              setReload(r => !r);
                            } catch (err) {
                              toast.error('Failed to delete class');
                            }
                          }
                        }}
                    />
                ))}
            </div>
            <Pagination 
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
      <ClassModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditingClass(null); setIsEditClass(false); }}
        onSuccess={() => { setModalOpen(false); setEditingClass(null); setIsEditClass(false); setReload(r => !r); }}
        initialStateEdit={editingClass}
        isEditClass={isEditClass}
      />

        </div>
    );
};

export default ClassManagementPage;