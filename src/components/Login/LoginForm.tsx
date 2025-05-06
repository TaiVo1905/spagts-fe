import PasswordInput from "../PasswordInput";
import Input from "../Form/Input";
import Button from "../Form/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleForgotPassword = () => {
        navigate("/enter-email");
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white p-10 rounded-xl shadow-lg transition-all duration-300">
            <h2 className="text-3xl font-bold text-purple-900 mb-3 text-center">Login</h2>
            <p className="text-base text-gray-600 mb-8 text-center">
                Please fill your details to access your account.
            </p>

            <form className="space-y-6">
                <Input
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="youremail@example.com"
                    icon={<FaEnvelope className="text-gray-400 text-lg" />}
                />
                <PasswordInput
                    label="Password"
                    value={password}
                    onChange={setPassword}
                    placeholder="********"
                    icon={<FaLock className="text-gray-400 text-lg" />}
                />

                <div className="flex justify-between items-center text-base">
                    <div></div>
                    <span
                        onClick={handleForgotPassword}
                        className="text-pink-600 hover:text-pink-700 hover:underline cursor-pointer transition-colors duration-200"
                    >
                        Forgot Password?
                    </span>
                </div>

                <Button text="Sign in"  />
            </form>
        </div>
    );
};

export default LoginForm;