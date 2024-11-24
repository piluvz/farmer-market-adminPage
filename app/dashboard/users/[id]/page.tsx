"use client";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import Sidebar from "../../../components/sidebar";
import { useEffect, useState } from "react";
import Image from "next/image";

const UserPage = () => {
  const router = useRouter();
  const { id } = useParams();

  interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_active: boolean;
  }

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<User | null>(null);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `https://farmer-market-zlmy.onrender.com/api/users/${id}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user data.");
          }
          const data = await response.json();
          setUser(data);
          setIsLoading(false);
        } catch (err) {
          setError((err as Error).message);
          setIsLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!formData) return;
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "is_active" ? value === "true" : value, // Explicit boolean conversion
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    if (!formData) {
    alert("Invalid form data. Please check the fields.");
    return;
    }

    try {
      const response = await fetch(
        `https://farmer-market-zlmy.onrender.com/api/users/${id}/`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to update user.");
      const updatedUser = await response.json();
      setUser(updatedUser);
      setIsModalOpen(false);
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert(`Failed to update user: ${(err as Error).message}`);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://farmer-market-zlmy.onrender.com/api/users/${id}/`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete user.");
      alert("User deleted successfully!");
      router.push("/dashboard/users");
    } catch (err) {
      console.error(err);
      alert(`Failed to delete user: ${(err as Error).message}`);
    }
  };

  const openEditModal = () => {
    setFormData(user);
    setIsModalOpen(true);
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-gray-700 animate-pulse">Loading user data...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col p-4 md:p-6">
        <div className="mt-4 p-4 md:p-8 md:mt-0 bg-white shadow-lg rounded-lg">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
            User Info
          </h2>
          <div className="flex flex-col md:flex-row gap-[25%]">
            {user && (
              <div className="flex items-center gap-4 md:gap-8 mb-4 md:mb-8">
                <Image
                  src="/profile.png"
                  alt="User Avatar"
                  width={130}
                  height={130}
                  className="rounded-full"
                />
                <div>
                  <p className="text-gray-800 font-bold text-xl whitespace-nowrap">
                    {user.first_name} {user.last_name}
                  </p>
                  <p className="text-md text-gray-500">{user.role}</p>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 gap-4 w-full">
              <div className="p-4 md:p-6 border border-gray-300 rounded-lg bg-gray-50">
                <span className="font-semibold text-gray-600">User Details:</span>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">ID:</span> {user?.id}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Username:</span> {user?.username}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Email:</span> {user?.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-800">Active:</span>{" "}
                  {user?.is_active ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-6 flex flex-col md:flex-row gap-4">
            <button
              onClick={openEditModal}
              className="bg-blue-900 text-white py-2 px-4 rounded-lg hover:bg-blue-700 w-full md:w-auto"
            >
              Edit User
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-600 w-full md:w-auto"
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg w-[90%] md:w-1/3">
            <h2 className="text-lg font-bold mb-4">Edit User</h2>
            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData?.username || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData?.first_name || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData?.last_name || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData?.email || ""}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Active</label>
                <select
                  name="is_active"
                  value={formData?.is_active ? "true" : "false"}
                  onChange={handleEditChange}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="true">Active</option>
                  <option value="false">Non-active</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
