import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";

const FloatingLabelInput = ({ label, type = "text", name, value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="relative mb-3">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        className="w-full h-14 border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-500"
      />
      <label
        className={`pointer-events-none absolute cursor-text text-gray-500 duration-200 transform z-10 bg-white px-1 left-4 ${
          value
            ? "top-0 scale-75 -translate-y-1/2"
            : isFocused
            ? "top-0 scale-75 -translate-y-1/2"
            : "top-1/2 -translate-y-1/2"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const PasswordInput = ({ label, name, value, onChange, showPassword, setShowPassword }) => {
  const [isFocused, setIsFocused] = useState(false);
  return (
    <div className="relative mb-3">
      <input
        type={showPassword ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder=" "
        className="w-full h-14 border border-gray-300 rounded-lg px-4 focus:outline-none focus:border-blue-500"
      />
      <label
        className={`pointer-events-none absolute cursor-text text-gray-500 duration-200 transform z-10 bg-white px-1 left-4 ${
          value
            ? "top-0 scale-75 -translate-y-1/2"
            : isFocused
            ? "top-0 scale-75 -translate-y-1/2"
            : "top-1/2 -translate-y-1/2"
        }`}
      >
        {label}
      </label>
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-500 text-sm"
      >
        {showPassword ? "HIDE" : "SHOW"}
      </button>
    </div>
  );
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "identifier") setIdentifier(value);
    else if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setIsLoading(true);
      const response = await axiosInstance.post("/user/login", { identifier, password });
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        navigate(`/u/${response.data.user.userId}`);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex w-full max-w-4xl overflow-hidden rounded-2xl shadow-xl">
        <div className="hidden w-1/2 bg-gradient-blue p-8 text-white md:flex md:flex-col md:items-center md:justify-center">
          <h1 className="mb-4 text-4xl font-bold">WELCOME</h1>
          <p className="text-center text-lg">
            Your headline name goes here. Some welcoming text about the system.
          </p>
        </div>
        <div className="w-full bg-white p-8 md:w-1/2">
          <div className="mx-auto max-w-md">
            <h2 className="mb-8 text-3xl font-bold text-gray-800">Login</h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <FloatingLabelInput
                label="User ID or Municipality ID"
                name="identifier"
                value={identifier}
                onChange={handleChange}
              />
              <PasswordInput
                label="Password"
                name="password"
                value={password}
                onChange={handleChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button
                type="submit"
                className="hover:bg-blue-700 focus:ring-blue-500 flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 cursor-pointer"
              >
                {isLoading ? "Processing..." : "Login"}
              </button>
            </form>
            <p className="mt-8 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;