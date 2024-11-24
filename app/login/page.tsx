"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username_or_email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const response = await fetch(
        "https://farmer-market-zlmy.onrender.com/api/login/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      setIsLoading(false);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Invalid input data. Please try again.");
        return;
      }

      const data = await response.json();
      console.log("Login successful:", data);

      localStorage.setItem("token", data.token);

      // Display the success message
      setSuccessMessage("Login successful! Redirecting to the dashboard...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setIsLoading(false);
      setError("Login failed. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className="relative flex items-center justify-center h-screen">
      <Image
        src="/login-background.svg"
        alt="Login Background"
        layout="fill"
        objectFit="cover"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white p-9 rounded-2xl shadow-lg w-full max-w-md mx-4"
      >
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Login to Your Account
        </h1>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-4 text-sm text-green-600">{successMessage}</div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-sm text-red-600">{error}</div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="flex items-center justify-center mb-4">
            <svg
              className="animate-spin h-6 w-6 text-pink-500"
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
            <span className="ml-2 text-sm text-gray-600">Logging in...</span>
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="username_or_email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address:
          </label>
          <input
            id="username_or_email"
            type="email"
            placeholder="admin@gmail.com"
            value={formData.username_or_email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              className="w-full p-3 border border-gray-300 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <a
              href="#"
              className="text-sm text-pink-500 hover:underline ml-2 whitespace-nowrap"
            >
              Forget Password?
            </a>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 ${
            isLoading && "opacity-50 cursor-not-allowed"
          }`}
        >
          Sign In
        </button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <a
            href="/register"
            className=" text-pink-500 hover:underline font-medium"
          >
            Create Account
          </a>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;