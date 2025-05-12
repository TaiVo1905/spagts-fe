import { useLocation, Link, useNavigate } from 'react-router-dom';

const UnauthorizedPage = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || '';
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">403 - Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access {from || 'this page'}.
        </p>
        <div className="flex flex-col space-y-2">
          <Link
            to=""
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Go back
          </Link>
          <Link
            to="/login"
            state={{ from: location.state?.from }}
            className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50 transition"
          >
            Sign in as different user
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;