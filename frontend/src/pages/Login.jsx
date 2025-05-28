import logoImage from "../assets/logo.png";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { userNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "../api/axios.js";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = userNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/login", { email, password });
      toast.success("Login successful!");
      navigate("/home");
    } catch (error) {
      toast.error(error.response?.data?.error || "Login failed");
    }
  };
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      {/* Right Side – Image/Welcome (shows on top in mobile) */}
      <div className="w-full md:w-1/2 bg-indigo-600 text-white flex flex-col items-center justify-center p-8 md:rounded-r-lg">
        <img
          src={logoImage}
          alt="Welcome"
          className="w-40 md:w-64 h-auto mb-4 md:mb-6 rounded-tl-lg rounded-bl-lg"
        />
        <h2 className="text-2xl md:text-3xl font-bold mb-2 md:mb-4 text-center">
          Welcome Back!
        </h2>
        <p className="text-base md:text-lg text-center max-w-md">
          Enter your personal details and start your journey with us.
        </p>
      </div>

      {/* Left Side – Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            Sign In
          </h2>
          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="Enter your email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            {/* Password */}
            <div className="relative  ">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition pr-12"
              />
              <div
                className="absolute inset-y-0 right-3 top-8 flex items-center cursor-pointer text-gray-500"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-gray-700 select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <span className="ml-2">Keep me signed in</span>
              </label>
              <a
                href="#forgetPassword"
                className="text-sm text-indigo-600 hover:underline"
              >
                Forgot Password?
              </a>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
            >
              Login
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-700">
            Don&apos;t have an account?{" "}
            <a href="/register" className="text-indigo-600 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
