"use client";
import { useState, useEffect} from "react";
import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

const Dashboard = () => {
  interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    is_active: boolean;
  }

  const [farmers, setFarmers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://farmer-market-zlmy.onrender.com/api/users/");
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        const filtered = data.filter((user: User) => user.role === "farmer");
        setFarmers(filtered);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleOpenModal = (user: User) => {
    if (!user.is_active) {
      setSelectedUser(user);
      setIsModalOpen(true);
      setShowFeedbackInput(false);
      setFeedback("");
    }
  };

  const handleApprove = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://farmer-market-zlmy.onrender.com/api/users/${selectedUser.id}/`,
        {
          method: "PUT",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            is_active: true,
            role: selectedUser.role,
            username: selectedUser.username,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error details:", errorData);
        throw new Error("Failed to approve the user.");
      }
  
      const updatedUser = await response.json();

      setFarmers((prev) =>
        prev.map((user) =>
          user.id === updatedUser.id ? { ...user, is_active: true } : user
        )
      );
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to approve the user.");
    }
  };

  const handleReject = async () => {
    if (!selectedUser) return;
    if (!feedback) {
      alert("Please provide feedback before rejecting.");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      alert("User is not authenticated. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `https://farmer-market-zlmy.onrender.com/api/users/${selectedUser.id}/`,
        {
          method: "DELETE",
          headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to reject the user.");
      setFarmers((prev) => prev.filter((user) => user.id !== selectedUser.id));
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Failed to reject the user.");
    }
  };

  return (
    <div className="flex h-full flex-col md:flex-row pb-6 bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-6 py-5 flex-1">
        <Navbar />

        <div className="p-4 mt-6 md:p-6 bg-white rounded-lg">
          <h2 className="text-lg md:text-xl text-gray-800 mb-4">Requests</h2>
          {/* Loading State */}
          {isLoading && <p className="text-center text-gray-500">Loading users...</p>}

          {/* Error State */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* User Table */}
          {!isLoading && !error && (
          <div className="overflow-x-auto  shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm text-gray-700">ID</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-700">Name</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-700">Location</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-700">Farm Size</th>
                  <th className="px-6 py-3 text-left text-sm text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {farmers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">{user.id}</td>
                      <td className="px-6 py-4 text-gray-700">{user.first_name} {user.last_name}</td>
                      <td className="px-6 py-4 text-gray-700">Kazakhstan</td>
                      <td className="px-6 py-4 text-gray-700">{`${Math.floor(Math.random() * (100 - 10 + 1)) + 10} ha`}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleOpenModal(user)}
                          className={`border rounded p-3 py-0 transition-all duration-300 ease-in-out ${
                            user.is_active
                              ? "bg-green-500 text-white hover:bg-green-600 border-green-500"
                              : "bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-500"
                          }`}
                        >
                          {user.is_active ? "Approved" : "Pending"}
                        </button>
                      </td>
                    </tr>
                  ))}
                  
              </tbody>
            </table>
          </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold mb-4 text-center">
              Edit request for {selectedUser.first_name} {selectedUser.last_name}
            </h2>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleApprove}
                className="bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600"
              >
                Approve
              </button>
              <button
                onClick={() => setShowFeedbackInput(true)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
            </div>
            <div className="flex flex-col gap-4 justify-center mt-6">
              {showFeedbackInput && (
                <textarea
                  placeholder="Enter feedback..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                />
              )}
              {showFeedbackInput && (
                <button
                  onClick={handleReject}
                  className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600"
                >
                  Confirm Reject
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;