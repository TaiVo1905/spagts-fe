import PasswordInput from "../PasswordInput";
import Input from "../Input";
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { useAuth } from "../../store/AuthContext";
import { Toaster, toast } from "react-hot-toast";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const handleForgotPassword = () => {
    navigate("/enter-email", { state: { from: location.state?.from } });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={true} />
      <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Welcome Back</h2>
          <p className="text-gray-600 mt-2">
            Sign in to access your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            icon={<FaEnvelope className="text-gray-400" />}
          />

          <PasswordInput
            label="Password"
            value={password}
            onChange={setPassword}
            placeholder="••••••••"
            icon={<FaLock className="text-gray-400" />}
          />

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm text-sky-500 hover:text-sky-600"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-sky-500 text-white py-2 rounded hover:bg-sky-600 transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>
      </div>
    </>
  );
};

export default LoginForm;