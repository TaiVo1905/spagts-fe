import React, { useEffect, useState } from 'react';
import certificateService, { CertificatePayload } from '../../services/certificateService';
import { HiDotsVertical } from 'react-icons/hi';
import { Certificate } from '../../interface/Interface';

const CertificatePage: React.FC = () => {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentCert, setCurrentCert] = useState<Certificate | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [certificatesData, setCertificatesData] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const [newModule, setNewModule] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                setLoading(true);
                const response = await certificateService.getAll();
                setCertificatesData(response.data);
                console.log(certificatesData)
                setError(null);
            } catch (error) {
                console.error('Error fetching certificates:', error);
                setError('Failed to fetch certificates');
                setCertificatesData([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCertificates();
    }, []);

    const handleMenuToggle = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };

    const handleEdit = (id: number) => {
        const cert = certificatesData.find(cert => cert.id === id);
        if (cert) {
            setCurrentCert(cert);
            setIsUpdateModalOpen(true);
            setActiveId(null);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (currentCert) {
            const updatedData: CertificatePayload = {
                id: currentCert.id,
                imageUrl: imageFile || currentCert.imageUrl,
                module: currentCert.module,
                date: currentCert.date,
                description: currentCert.description
            };

            try {
                await certificateService.update(currentCert.id, updatedData);
                const response = await certificateService.getAll();
                setCertificatesData(response.data);
                setIsUpdateModalOpen(false);
                setCurrentCert(null);
                setImageFile(null);
            } catch (error) {
                console.error('Error updating certificate:', error);
            }
        }
    };

    const handleAdd = async () => {
        if (!imageFile) {
            alert('Please select an image');
            return;
        }

        const newCertificate: CertificatePayload = {
            imageUrl: imageFile,
            module: newModule,
            date: newDate,
            description: newDescription,
        };

        try {
            await certificateService.add(newCertificate)
            const response = await certificateService.getAll();
            setCertificatesData(response.data);
            setIsAddModalOpen(false); 
            setNewModule(''); 
            setNewDate('');
            setNewDescription('');
            setImageFile(null);
        } catch (error) {
            console.error('Error adding certificate:', error);
        }
    };

    const handleDelete = async (id: number) => {
        const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa chứng chỉ này không?');
        
        if (confirmDelete) {
            try {
                await certificateService.delete(id);
                const response = await certificateService.getAll();
                setCertificatesData(response.data);
            } catch (error) {
                console.error('Error deleting certificate:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setIsUpdateModalOpen(false);
        setNewModule('');
        setNewDate('');
        setNewDescription('');
        setImageFile(null);
        setCurrentCert(null);
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            handleCloseModal();
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center p-4">{error}</div>;
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full p-10">
            <div className="col-span-1 sm:col-span-2 md:col-span-3 mb-4">
                <button 
                    onClick={() => {
                        setIsAddModalOpen(true); 
                        setNewModule(''); 
                        setNewDate('');
                        setNewDescription('');
                    }} 
                    className="bg-(--primary-color) text-white rounded px-4 py-2"
                >
                    Add New Certificate
                </button>
            </div>

            {certificatesData && certificatesData.length > 0 ? (
                certificatesData.map((cert) => (
                    <div key={cert.id} className="bg-white shadow-xl rounded-xl relative">
                        <div className="p-10 text-center">
                            <img
                                src={cert.imageUrl || "https://via.placeholder.com/150"}
                                alt="Certificate decoration"
                                className="w-full h-auto mb-4"
                            />
                            <h3 className="text-2xl font-bold my-2">{cert.module}</h3>
                            <p className="text-2xl font-bold-700 my-2">{new Date(cert.date).toLocaleDateString()}</p>
                            <p className="text-gray-600 mt-2">{cert.description}</p>
                            <button className="absolute top-1 right-1" onClick={() => handleMenuToggle(cert.id)}>
                                <HiDotsVertical className="w-6 h-6 text-gray-600" />
                            </button>
                            {activeId === cert.id && (
                                <div className="absolute top-12 right-4 bg-white shadow-md rounded-md p-2">
                                    <button onClick={() => handleEdit(cert.id)} className="block text-left w-full text-gray-700 hover:bg-gray-200 p-2 rounded">Edit</button>
                                    <button 
                                        onClick={() => handleDelete(cert.id)} 
                                        className="block text-left w-full text-red-600 hover:bg-red-100 p-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <div className="col-span-1 sm:col-span-2 md:col-span-3 text-center text-gray-500">
                    No certificates found
                </div>
            )}

            {isAddModalOpen && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    onClick={handleOverlayClick}
                >
                    <div className="bg-white rounded-lg p-6 w-[500px] relative" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold mb-4">Add New Certificate</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2">Upload Image:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="border rounded w-full p-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Title:</label>
                                <input
                                    type="text"
                                    value={newModule}
                                    onChange={(e) => setNewModule(e.target.value)}
                                    className="border rounded w-full p-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Date:</label>
                                <input
                                    type="date"
                                    value={newDate}
                                    onChange={(e) => setNewDate(e.target.value)}
                                    className="border rounded w-full p-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Description:</label>
                                <textarea
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    className="border rounded w-full p-2"
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button 
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleAdd} 
                                    className="bg-(--primary-color) text-white rounded px-4 py-2"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isUpdateModalOpen && currentCert && (
                <div 
                    className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
                    onClick={handleOverlayClick}
                >
                    <div className="bg-white rounded-lg p-6 w-[500px] relative" onClick={e => e.stopPropagation()}>
                        <button 
                            onClick={handleCloseModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        <h2 className="text-xl font-bold mb-4">Update Certificate</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block mb-2">Update Image:</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="border rounded w-full p-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Title:</label>
                                <input
                                    type="text"
                                    value={currentCert.module}
                                    onChange={(e) => setCurrentCert({ ...currentCert, module: e.target.value })}
                                    className="border rounded w-full p-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Date:</label>
                                <input
                                    type="date"
                                    value={new Date(currentCert.date).toISOString().split('T')[0]}
                                    onChange={(e) => setCurrentCert({ ...currentCert, date: new Date(e.target.value) })}
                                    className="border rounded w-full p-2"
                                />
                            </div>
                            <div>
                                <label className="block mb-2">Description:</label>
                                <textarea
                                    value={currentCert.description}
                                    onChange={(e) => setCurrentCert({ ...currentCert, description: e.target.value })}
                                    className="border rounded w-full p-2"
                                    rows={4}
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button 
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={async () => { 
                                        await handleSave(); 
                                        setIsUpdateModalOpen(false); 
                                    }} 
                                    className="bg-(--primary-color) text-white rounded px-4 py-2"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CertificatePage;