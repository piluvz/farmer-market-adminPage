"use client";
import { useRouter} from "next/navigation";
import { useState, useEffect} from "react";
import Navbar from "../../components/navbar";
import Sidebar from "../../components/sidebar";

const UsersList = () => {
    const router = useRouter();

    interface User {
      id: string;
      username: string;
      first_name: string;
      last_name: string;
      email: string;
      role: string;
      is_active: boolean;
    }
  
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch("https://farmer-market-zlmy.onrender.com/api/users/");
          if (!response.ok) {
            throw new Error("Failed to fetch users");
          }
          const data = await response.json();
          const filtered = data.filter((user: User) => user.role === "farmer" || user.role === "buyer");
          setFilteredUsers(filtered);
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


    const handleViewClick = (id: string) => {
        router.push(`/dashboard/users/${id}`);
    };

  return (
    <div className="flex h-full flex-col md:flex-row pb-6 bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="p-6 py-5 flex-1">
        <Navbar />

        <div className="p-4 mt-6 md:p-6 bg-white rounded-lg">
          <h2 className="text-lg md:text-xl text-gray-800 mb-4">List of Users</h2>

          {/* Loading State */}
          {isLoading && <p className="text-center text-gray-500">Loading users...</p>}

          {/* Error State */}
          {error && <p className="text-center text-red-500">{error}</p>}

          {/* User Table */}
          {!isLoading && !error && (
            <div className="overflow-x-auto shadow-md">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-6 py-3 text-left text-sm text-gray-700">ID</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-700">Name</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-700">Email</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-700">Role</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-700">Active?</th>
                    <th className="px-6 py-3 text-left text-sm text-gray-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-gray-700">{user.id}</td>
                      <td className="px-6 py-4 text-gray-700">{user.first_name} {user.last_name}</td>
                      <td className="px-6 py-4 text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 text-gray-700">{user.role}</td>
                      <td className="px-6 py-4 text-gray-700">{user.is_active ? "Yes" : "No"}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewClick(user.id)}
                          className="border border-gray-400 rounded p-3 py-0 hover:bg-blue-500 hover:text-white hover:border-blue-500 hover:shadow-lg transition-all duration-300 ease-in-out"
                        >
                          View
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
    </div>
  );
};

export default UsersList;