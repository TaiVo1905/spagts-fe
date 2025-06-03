import React, { useEffect, useState } from 'react';
import certificateService, { CertificatePayload } from '../../services/certificateService';
import { HiDotsVertical } from 'react-icons/hi';
import { Certificate } from '../../interface/Interface';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../store/AuthContext';
import { useRole } from '../../utils/useRole';

const initialCertificatesBySemester: Record<string, Certificate[]> = {
    S1: [], S2: [], S3: [], S4: [], S5: [], S6: [],
};

const CertificatePage: React.FC = () => {
    const [selectedSemester, setSelectedSemester] = useState(1);
    const [certificatesBySemester, setCertificatesBySemester] = useState(initialCertificatesBySemester);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [loadedSemesters, setLoadedSemesters] = useState<Set<number>>(new Set());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState<number | null>(null);
    const { user } = useAuth();
    const {isStudent} = useRole();

    const { register, handleSubmit, formState: { errors }, reset } = useForm<CertificatePayload>({
        defaultValues: {
            studentId: user?.id,
            semester: selectedSemester,
            module: '',
            date: '',
            description: '',
        },
    });

    useEffect(() => {
        if (user) {
            fetchCertificatesForSemester(1);
        }
    }, [user]);

    const fetchCertificatesForSemester = async (semester: number) => {
        if (!user || loadedSemesters.has(semester)) return;

        try {
            const { data } = await certificateService.getAll(user.id, semester);
            setCertificatesBySemester(prev => ({
                ...prev,
                [`S${semester}`]: data || []
            }));
            setLoadedSemesters(prev => new Set(prev).add(semester));
        } catch (error) {
            console.error(`Fetch certificates for semester ${semester} error:`, error);
            toast.error(`Failed to load certificates for semester ${semester}.`);
        }
    };

    const handleSemesterChange = (semester: number) => {
        setSelectedSemester(semester);
        fetchCertificatesForSemester(semester);
    };

    const handleMenuToggle = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleUpdate = async (id: number, data: CertificatePayload) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('module', data.module);
            formData.append('studentId', user?.id?.toString() || '');
            formData.append('semester', selectedSemester.toString());
            formData.append('date', data.date.toString());
            formData.append('description', data.description);
            
            if (imageFile) {
                formData.append('imageUrl', imageFile);
            } else if (!id) {
                toast.error('Please upload an image');
                setIsSubmitting(false);
                return false;
            }
            
            if (id) {
                formData.append('_method', 'PATCH');
            }

            const response = id 
                ? await certificateService.update(id, formData)
                : await certificateService.add(formData);

            setCertificatesBySemester(prev => ({
                ...prev,
                [`S${selectedSemester}`]: id
                    ? prev[`S${selectedSemester}`].map(c => c.id === id ? response.data : c)
                    : [...prev[`S${selectedSemester}`], response.data]
            }));

            toast.success(`Certificate ${id ? 'updated' : 'added'} successfully!`);
            return true;
        } catch (error) {
            console.error('Certificate error:', error);
            toast.error(`Failed to ${id ? 'update' : 'add'} certificate`);
            return false;
        } finally {
            setIsSubmitting(false);
        }
    };

    const onSubmit = async (data: CertificatePayload) => {
        const success = await handleUpdate(activeId || 0, data);
        if (success) {
            setIsModalOpen(false);
            reset();
            setImageFile(null);
            setActiveId(null);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this certificate?')) {
            setIsDeleting(id);
            try {
                await certificateService.delete(id);
                setCertificatesBySemester(prev => ({
                    ...prev,
                    [`S${selectedSemester}`]: prev[`S${selectedSemester}`].filter(cert => cert.id !== id)
                }));
                toast.success('Certificate deleted successfully!');
            } catch (error) {
                console.error('Delete certificate error:', error);
                toast.error('Failed to delete certificate.');
            } finally {
                setIsDeleting(null);
            }
        }
    };

    const currentCertificates = certificatesBySemester[`S${selectedSemester}`] || [];
    const currentCert = activeId ? currentCertificates.find(c => c.id === activeId) : null;

    return (
        <div className="w-full bg-white border border-gray-200 overflow-hidden">
            <div className="relative bg-white rounded-2xl shadow-md p-6 min-h-[700px]">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-3">
                        {[1, 2, 3, 4, 5, 6].map((sem) => (
                            <button
                                key={sem}
                                onClick={() => handleSemesterChange(sem)}
                                className={`px-6 py-2 text-sm cursor-pointer font-semibold rounded-xl transition-all focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA] ${
                                    selectedSemester === sem
                                        ? 'bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-100'
                                }`}
                            >
                                S{sem}
                            </button>
                        ))}
                    </div>
                    {isStudent && <button
                        onClick={() => {
                            setIsModalOpen(true);
                            setActiveId(null);
                            reset();
                        }}
                        className="flex items-center cursor-pointer space-x-2 bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] text-white px-5 py-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-[#21BAEA]"
                    >
                        <span className="text-xl leading-none">＋</span>
                        <span className="text-sm">Add new certificate</span>
                    </button>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {currentCertificates.length === 0 ? (
                        <div className="col-span-1 sm:col-span-2 md:col-span-3 py-10 text-center text-gray-500">
                            No certificates yet. {isStudent && "Click"} <span className="text-[#21BAEA]">{isStudent && "Add new certificate"}</span> {isStudent && "to start!"}
                        </div>
                    ) : (
                        currentCertificates.map((cert) => (
                            <div key={cert.id} className="bg-white shadow-xl rounded-xl relative hover:shadow-lg transition-shadow">
                                <div className="p-6 text-center">
                                    <img
                                        src={cert.imageUrl || "https://via.placeholder.com/150"}
                                        alt="Certificate"
                                        className="w-full h-auto mb-4 rounded-lg"
                                    />
                                    <h3 className="text-xl font-bold my-2">{cert.module}</h3>
                                    <p className="text-lg font-semibold my-2">
                                        {new Date(cert.date).toLocaleDateString()}
                                    </p>
                                    <p className="text-gray-600 mt-2 text-sm">{cert.description}</p>
                                    <button 
                                        className="absolute top-2 right-2" 
                                        onClick={() => handleMenuToggle(cert.id)}
                                    >
                                        <HiDotsVertical className="w-5 h-5 text-gray-600 hover:text-gray-800" />
                                    </button>
                                    {isStudent && activeId === cert.id && (
                                        <div className="absolute top-10 right-2 bg-white shadow-md rounded-md p-2 z-10 border border-gray-200">
                                            <button 
                                                onClick={() => {
                                                    reset({
                                                        module: cert.module,
                                                        date: new Date(cert.date).toISOString().split('T')[0],
                                                        description: cert.description,
                                                        studentId: user?.id,
                                                        semester: selectedSemester
                                                    });
                                                    setActiveId(cert.id);
                                                    setIsModalOpen(true);
                                                }} 
                                                disabled={isDeleting === cert.id}
                                                className="block text-left w-full text-gray-700 hover:bg-gray-100 p-2 rounded text-sm"
                                            >
                                                Edit
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(cert.id)} 
                                                disabled={isDeleting === cert.id}
                                                className="block text-left w-full text-red-600 hover:bg-red-100 p-2 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                            >
                                                {isDeleting === cert.id ? (
                                                    <>
                                                        <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Deleting...
                                                    </>
                                                ) : (
                                                    'Delete'
                                                )}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center">
                        <div
                            className="absolute inset-0 bg-black opacity-50"
                            onClick={() => {
                                setIsModalOpen(false);
                                reset();
                                setImageFile(null);
                                setActiveId(null);
                            }}
                        />

                        <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-md w-full mx-4 p-6">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                {activeId ? 'Update Certificate' : 'Add New Certificate'}
                            </h2>
                            <div className="h-0.5 bg-gray-100 mb-6" />

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Certificate Image {!activeId && <span className="text-red-500">*</span>}
                                    </label>
                                    {activeId && !imageFile && (
                                        <div className="mb-2">
                                            <p className="text-xs text-gray-500 mb-1">Current Image:</p>
                                            <img 
                                                src={currentCert?.imageUrl} 
                                                alt="Current certificate" 
                                                className="h-20 object-contain"
                                            />
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full p-2 text-sm border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                                        required={!activeId}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Module Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('module', { required: 'Module name is required' })}
                                        type="text"
                                        className={`w-full p-2 text-sm border ${errors.module ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                                        placeholder="Enter module name"
                                    />
                                    {errors.module && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.module.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        {...register('date', { required: 'Date is required' })}
                                        type="date"
                                        className={`w-full p-2 text-sm border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition`}
                                    />
                                    {errors.date && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.date.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        {...register('description', { required: 'Description is required' })}
                                        className={`w-full p-2 text-sm border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition resize-none`}
                                        rows={3}
                                        placeholder="Enter description"
                                    />
                                    {errors.description && (
                                        <p className="mt-1 text-xs text-red-500">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsModalOpen(false);
                                            reset();
                                            setImageFile(null);
                                            setActiveId(null);
                                        }}
                                        disabled={isSubmitting}
                                        className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="px-4 py-2 cursor-pointer text-sm font-medium text-white bg-gradient-to-r from-[#21BAEA] to-[#1AA8D5] rounded-lg hover:from-[#21BAEA] hover:to-[#1AA8D5] focus:outline-none focus:ring-2 focus:ring-[#21BAEA] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[100px]"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                {activeId ? 'Updating...' : 'Saving...'}
                                            </>
                                        ) : (
                                            activeId ? 'Update' : 'Save'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CertificatePage;