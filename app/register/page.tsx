"use client";
import React, { useState } from "react";
import Image from "next/image";

const RegisterPage = () => {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch("https://farmer-market-zlmy.onrender.com/api/users/register_superuser/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed, please try again");
        return;
      }

      setSuccess("Account created successfully! ");
      console.log("Registration successful:", await response.json());
      setFormData({ email: "", password: "", username:""});
    } catch (err) {
      setIsLoading(false);
      setError("Registration failed.");
      console.error(err);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
        <Image
          src="/register-background.svg"
          alt="Login Background"
          layout="fill"
          objectFit="cover"
        />

      <form onSubmit={handleSubmit}
      className="relative z-10 bg-white p-9 rounded-2xl shadow-lg w-full max-w-lg mx-4 overflow-y-auto">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create Account
        </h1>

        {error && (
          <div className="text-red-600 bg-red-100 p-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-600 bg-green-100 p-3 rounded mb-4 text-sm">
            {success}
            <a
              href="/login"
              className="text-blue-500 hover:underline font-medium"
            >
               Go to login page
            </a>
          </div>
        )}

        {/* Loading spinner */}
        {isLoading && (
          <div className="flex items-center justify-center mb-4">
            <svg
              className="animate-spin h-6 w-6 text-blue-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <span className="ml-2 text-sm text-gray-600">Processing...</span>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address:
          </label>
          <input
            id="email"
            type="email"
            placeholder="admin@gmail.com"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-3">
        <div className="mb-4 ">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700"
          >
            Username:
          </label>
          <input
            id="username"
            type="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password:
          </label>
          <div className="flex items-center justify-between">
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          Register
        </button>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className=" text-blue-500 hover:underline font-medium"
          >
            Log in
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
