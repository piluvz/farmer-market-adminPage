"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <p className="text-lg text-gray-700 animate-pulse">Redirecting...</p>
    </div>
  );
};

export default HomePage;
