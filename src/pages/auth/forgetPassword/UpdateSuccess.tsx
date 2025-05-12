import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';

const UpdateSuccess = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 px-4">
            <div className="bg-white px-10 py-8 rounded-xl shadow-lg w-full max-w-sm text-center animate__animated animate__fadeInDown">
                <FaSpinner className="text-blue-500 text-5xl mx-auto mb-5 animate-spin" />
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Updating your password...</h2>
                <p className="text-base text-gray-600">Please wait a moment while we redirect you.</p>
            </div>
        </div>
    );
};

export default UpdateSuccess;
