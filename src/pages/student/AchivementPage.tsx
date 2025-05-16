

// import React, { useState } from 'react';
// import { HiDotsVertical } from 'react-icons/hi';
// import achivementService from '../../services/achivementService';

// const certificatesData = [
//     { id: 1, title: "TOEIC", date: "4 April 2025", description: "Description 1", imgSrc: "https://marketplace.canva.com/EAFy42rCTA0/1/0/1600w/canva-blue-minimalist-certificate-of-achievement-_asVJz8YgJE.jpg" },
//     { id: 2, title: "IELTS", date: "5 May 2025", description: "Description 2", imgSrc: "https://marketplace.canva.com/EAFy42rCTA0/1/0/1600w/canva-blue-minimalist-certificate-of-achievement-_asVJz8YgJE.jpg" },
//     { id: 3, title: "TOEFL", date: "6 June 2025", description: "Description 3", imgSrc: "https://marketplace.canva.com/EAFy42rCTA0/1/0/1600w/canva-blue-minimalist-certificate-of-achievement-_asVJz8YgJE.jpg" },
//     { id: 4, title: "Cambridge", date: "7 July 2025", description: "Description 4", imgSrc: "https://marketplace.canva.com/EAFy42rCTA0/1/0/1600w/canva-blue-minimalist-certificate-of-achievement-_asVJz8YgJE.jpg" },
//     { id: 5, title: "PTE", date: "8 August 2025", description: "Description 5", imgSrc: "https://marketplace.canva.com/EAFy42rCTA0/1/0/1600w/canva-blue-minimalist-certificate-of-achievement-_asVJz8YgJE.jpg" },
// ];


// const AchivementPage: React.FC = () => {
//     const [activeId, setActiveId] = useState<number | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [currentCert, setCurrentCert] = useState<any>(null);
//     const [imageFile, setImageFile] = useState<File | null>(null);

//     const handleMenuToggle = (id: number) => {
//         setActiveId(activeId === id ? null : id);
//     };

//     const handleEdit = (id: number) => {
//         const cert = certificatesData.find(cert => cert.id === id);
//         setCurrentCert(cert);
//         setIsModalOpen(true);
//         setActiveId(null);
//     };

//     const handleSave = () => {
//         setIsModalOpen(false);
//     };

//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setImageFile(e.target.files[0]);
//         }
//     };

//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full p-10">
//             {certificatesData.map(cert => (
//                 <div key={cert.id} className="bg-white shadow-xl rounded-xl relative">
//                     <div className="p-10 text-center">
//                         <img
//                             src={cert.imgSrc}
//                             alt="Certificate decoration"
//                             className="w-full h-auto mb-4"
//                         />
//                         <h3 className="text-2xl font-bold my-2">{cert.title}</h3>
//                         <p className="text-2xl font-bold-700 my-2">{cert.date}</p>
//                         <p className="text-gray-600 mt-2">{cert.description}</p>
//                         <button className="absolute top-1 right-1" onClick={() => handleMenuToggle(cert.id)}>
//                             <HiDotsVertical className="w-6 h-6 text-gray-600" />
//                         </button>
//                         {activeId === cert.id && (
//                             <div className="absolute top-12 right-4 bg-white shadow-md rounded-md p-2">
//                                 <button onClick={() => handleEdit(cert.id)} className="block text-left w-full text-gray-700 hover:bg-gray-200 p-2 rounded">Edit</button>
//                                 <button className="block text-left w-full text-red-600 hover:bg-red-100 p-2 rounded">Delete</button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             ))}

//             {isModalOpen && (
//                 <div className="fixed inset-1 flex items-center justify-center bg-gray-200/50" >
//                     <div className="bg-white rounded-lg p-6 w-150">
//                         <h2 className="text-xl font-bold mb-4">Update Certificate</h2>
//                         {currentCert && (
//                             <>
//                                 <label className="block mb-2">Update Image:</label>
//                                 <input
//                                     type="file"
//                                     accept="image/*" 
//                                     onChange={handleImageUpload}
//                                     className="border rounded w-full p-2 mb-4"
//                                 />
//                                 <label className="block mb-2">Title:</label>
//                                 <input
//                                     type="text"
//                                     value={currentCert.title}
//                                     onChange={(e) => setCurrentCert({ ...currentCert, title: e.target.value })}
//                                     className="border rounded w-full p-2 mb-4"
//                                 />
//                                 <label className="block mb-2">Date:</label>
//                                 <input
//                                     type="date"
//                                     value={currentCert.date}
//                                     onChange={(e) => setCurrentCert({ ...currentCert, date: e.target.value })}
//                                     className="border rounded w-full p-2 mb-4"
//                                 />
//                                 <label className="block mb-2">Description:</label>
//                                 <textarea
//                                     value={currentCert.description}
//                                     onChange={(e) => setCurrentCert({ ...currentCert, description: e.target.value })}
//                                     className="border rounded w-full p-2 mb-4"
//                                 />
//                                 <button onClick={handleSave} className="bg-blue-500 text-white rounded px-4 py-2">Save</button>
//                                 <button onClick={() => setIsModalOpen(false)} className="ml-2 bg-gray-300 rounded px-4 py-2">Cancel</button>
//                             </>
//                         )}
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AchivementPage;


// import React, { useEffect, useState } from 'react';
// import achivementService, { CertificatePayload } from '../../services/achivementService';
// import { HiDotsVertical } from 'react-icons/hi';

// const AchivementPage: React.FC = () => {
//     const [activeId, setActiveId] = useState<number | null>(null);
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [currentCert, setCurrentCert] = useState<CertificatePayload | null>(null);
//     const [imageFile, setImageFile] = useState<File | null>(null);
//     const [certificatesData, setCertificatesData] = useState<CertificatePayload[]>([]);

//     useEffect(() => {
//         const fetchCertificates = async () => {
//             try {
//                 const response = await achivementService.getCertificates();
//                 setCertificatesData(response.data.data);
//             } catch (error) {
//                 console.error('Error fetching certificates:', error);
//             }
//         };

//         fetchCertificates();
//     }, []);

//     const handleMenuToggle = (id: number) => {
//         setActiveId(activeId === id ? null : id);
//     };

//     const handleEdit = (id: number) => {
//         const cert = certificatesData.find(cert => cert.id === id);
//         setCurrentCert(cert || null);
//         setIsModalOpen(true);
//         setActiveId(null);
//     };

//     const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//         if (e.target.files && e.target.files[0]) {
//             setImageFile(e.target.files[0]);
//         }
//     };

//     const handleSave = async () => {
//         if (currentCert) {
//             const updatedData = {
//                 imageUrl: currentCert.imageUrl,
//                 module: currentCert.module,
//                 date: currentCert.date,
//                 description: currentCert.description
//             };

//             try {
//                 await achivementService.updateCertificate(currentCert.id, updatedData);
//                 console.log(updatedData)
//                 const response = await achivementService.getCertificates();
//                 setCertificatesData(response.data);
//                 setIsModalOpen(false);
//                 setCurrentCert(null);
//                 setImageFile(null);
//             } catch (error) {
//                 console.error('Error updating certificate:', error);
//             }
//         }
//     };

//     const handleDelete = async (id: number) => {
//         const confirmDelete = window.confirm('Bạn có chắc chắn muốn xóa chứng chỉ này không?');
        
//         if (confirmDelete) {
//             try {
//                 await achivementService.deleteCertificate(id);
//                 const response = await achivementService.getCertificates();
//                 setCertificatesData(response.data);
//             } catch (error) {
//                 console.error('Error deleting certificate:', error);
//             }
//         }
//     };

//     return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 w-full p-10">
//             {certificatesData.map(cert => (
//                 <div key={cert.id} className="bg-white shadow-xl rounded-xl relative">
//                     <div className="p-10 text-center">
//                         <img
//                             src={cert.imageUrl || "https://via.placeholder.com/150"}
//                             alt="Certificate decoration"
//                             className="w-full h-auto mb-4"
//                         />
//                         <h3 className="text-2xl font-bold my-2">{cert.module}</h3>
//                         <p className="text-2xl font-bold-700 my-2">{new Date(cert.date).toLocaleDateString()}</p>
//                         <p className="text-gray-600 mt-2">{cert.description}</p>
//                         <button className="absolute top-1 right-1" onClick={() => handleMenuToggle(cert.id)}>
//                             <HiDotsVertical className="w-6 h-6 text-gray-600" />
//                         </button>
//                         {activeId === cert.id && (
//                             <div className="absolute top-12 right-4 bg-white shadow-md rounded-md p-2">
//                                 <button onClick={() => handleEdit(cert.id)} className="block text-left w-full text-gray-700 hover:bg-gray-200 p-2 rounded">Edit</button>
//                                 <button 
//                                     onClick={() => handleDelete(cert.id)} 
//                                     className="block text-left w-full text-red-600 hover:bg-red-100 p-2 rounded"
//                                 >
//                                     Delete
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             ))}

//             {isModalOpen && currentCert && (
//                 <div className="fixed inset-1 flex items-center justify-center bg-gray-200/50">
//                     <div className="bg-white rounded-lg p-6 w-150">
//                         <h2 className="text-xl font-bold mb-4">Update Certificate</h2>
//                         <>
//                             <label className="block mb-2">Update Image:</label>
//                             <input
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handleImageUpload}
//                                 className="border rounded w-full p-2 mb-4"
//                             />
//                             <label className="block mb-2">Title:</label>
//                             <input
//                                 type="text"
//                                 value={currentCert.module}
//                                 onChange={(e) => setCurrentCert({ ...currentCert, module: e.target.value })}
//                                 className="border rounded w-full p-2 mb-4"
//                             />
//                             <label className="block mb-2">Date:</label>
//                             <input
//                                 type="date"
//                                 value={new Date(currentCert.date).toISOString().split('T')[0]}
//                                 onChange={(e) => setCurrentCert({ ...currentCert, date: new Date(e.target.value) })}
//                                 className="border rounded w-full p-2 mb-4"
//                             />
//                             <label className="block mb-2">Description:</label>
//                             <textarea
//                                 value={currentCert.description}
//                                 onChange={(e) => setCurrentCert({ ...currentCert, description: e.target.value })}
//                                 className="border rounded w-full p-2 mb-4"
//                             />
//                             <button onClick={handleSave} className="bg-blue-500 text-white rounded px-4 py-2">Save</button>
//                             <button onClick={() => setIsModalOpen(false)} className="ml-2 bg-gray-300 rounded px-4 py-2">Cancel</button>
//                         </>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default AchivementPage;


import React, { useEffect, useState } from 'react';
import achivementService, { CertificatePayload } from '../../services/achivementService';
import { HiDotsVertical } from 'react-icons/hi';

const AchivementPage: React.FC = () => {
    const [activeId, setActiveId] = useState<number | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [currentCert, setCurrentCert] = useState<CertificatePayload | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [certificatesData, setCertificatesData] = useState<CertificatePayload[]>([]);
    
    const [newModule, setNewModule] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newDescription, setNewDescription] = useState('');

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const response = await achivementService.getCertificates();
                setCertificatesData(response.data.data);
            } catch (error) {
                console.error('Error fetching certificates:', error);
            }
        };

        fetchCertificates();
    }, []);

    const handleMenuToggle = (id: number) => {
        setActiveId(activeId === id ? null : id);
    };

    const handleEdit = (id: number) => {
        const cert = certificatesData.find(cert => cert.id === id);
        setCurrentCert(cert || null);
        setIsUpdateModalOpen(true);
        setActiveId(null);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        if (currentCert) {
            const updatedData = {
                imageUrl: currentCert.imageUrl,
                module: currentCert.module,
                date: currentCert.date,
                description: currentCert.description
            };

            try {
                await achivementService.updateCertificate(currentCert.id, updatedData);
                const response = await achivementService.getCertificates();
                setCertificatesData(response.data.data);
                setIsUpdateModalOpen(false);
                setCurrentCert(null);
                setImageFile(null);
            } catch (error) {
                console.error('Error updating certificate:', error);
            }
        }
    };

    const handleAdd = async () => {
        const newCertificate: CertificatePayload = {
            imageUrl: imageFile ? URL.createObjectURL(imageFile) : '',
            module: newModule,
            date: new Date(newDate),
            description: newDescription,
            id: 0
        };

        try {
            await achivementService.addCertificate(newCertificate);
            const response = await achivementService.getCertificates();
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
                await achivementService.deleteCertificate(id);
                const response = await achivementService.getCertificates();
                setCertificatesData(response.data);
            } catch (error) {
                console.error('Error deleting certificate:', error);
            }
        }
    };

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
                    className="bg-green-500 text-white rounded px-4 py-2"
                >
                    Add New Certificate
                </button>
            </div>

            {certificatesData.map(cert => (
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
            ))}

            {isAddModalOpen && (
                <div className="fixed inset-1 flex items-center justify-center bg-gray-200/50">
                    <div className="bg-white rounded-lg p-6 w-150">
                        <h2 className="text-xl font-bold mb-4">Add New Certificate</h2>
                        <>
                            <label className="block mb-2">Upload Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="border rounded w-full p-2 mb-4"
                            />
                            <label className="block mb-2">Title:</label>
                            <input
                                type="text"
                                value={newModule}
                                onChange={(e) => setNewModule(e.target.value)}
                                className="border rounded w-full p-2 mb-4"
                            />
                            <label className="block mb-2">Date:</label>
                            <input
                                type="date"
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                className="border rounded w-full p-2 mb-4"
                            />
                            <label className="block mb-2">Description:</label>
                            <textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="border rounded w-full p-2 mb-4"
                            />
                            <button onClick={handleAdd} className="bg-blue-500 text-white rounded px-4 py-2">Save</button>
                            <button onClick={() => setIsAddModalOpen(false)} className="ml-2 bg-gray-300 rounded px-4 py-2">Cancel</button>
                        </>
                    </div>
                </div>
            )}

            {isUpdateModalOpen && currentCert && (
                <div className="fixed inset-1 flex items-center justify-center bg-gray-200/50">
                    <div className="bg-white rounded-lg p-6 w-150">
                        <h2 className="text-xl font-bold mb-4">Update Certificate</h2>
                        <>
                            <label className="block mb-2">Update Image:</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="border rounded w-full p-2 mb-4"
                            />
                            <label className="block mb-2">Title:</label>
                            <input
                                type="text"
                                value={currentCert.module}
                                onChange={(e) => setCurrentCert({ ...currentCert, module: e.target.value })}
                                className="border rounded w-full p-2 mb-4"
                            />
                            <label className="block mb-2">Date:</label>
                            <input
                                type="date"
                                value={new Date(currentCert.date).toISOString().split('T')[0]}
                                onChange={(e) => setCurrentCert({ ...currentCert, date: new Date(e.target.value) })}
                                className="border rounded w-full p-2 mb-4"
                            />
                            <label className="block mb-2">Description:</label>
                            <textarea
                                value={currentCert.description}
                                onChange={(e) => setCurrentCert({ ...currentCert, description: e.target.value })}
                                className="border rounded w-full p-2 mb-4"
                            />
                            <button onClick={async () => {await handleSave();  setIsUpdateModalOpen(false);}} className="bg-blue-500 text-white rounded px-4 py-2">Save</button>
                            <button onClick={() => setIsUpdateModalOpen(false)} className="ml-2 bg-gray-300 rounded px-4 py-2">Cancel</button>
                        </>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AchivementPage;