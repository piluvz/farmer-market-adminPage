"use client";
import React, { useState} from "react";
import Image from "next/image";
import MenuLink from "./menuLink";
import {
  RiDashboard3Line,
  RiListCheck3,
  RiLogoutCircleLine,
  RiMenuLine,
  RiCloseLine,
} from "react-icons/ri";
import { useRouter } from "next/navigation";

const menuItems = [
  {
    title: "MAIN",
    list: [
      { title: "Pending Farmers", path: "/dashboard", icon: <RiDashboard3Line /> },
      { title: "Users List", path: "/dashboard/users", icon: <RiListCheck3 /> },
    ],
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-500 text-white p-2 rounded-lg shadow-lg"
        onClick={toggleSidebar}
      >
        {isOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg p-6 py-8 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-40 md:static md:translate-x-0 md:w-[24%]`}
      >
        {/* User Info */}
        <div className="flex items-center gap-4 mb-8">
          <Image
            src="/noavatar.png"
            alt="User Avatar"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <p className="text-gray-800 font-bold">Superuser</p>
            <p className="text-sm text-gray-500">Administrator</p>
          </div>
        </div>

        {/* Menu Items */}
        <ul className="space-y-6">
          {menuItems.map((category) => (
            <li key={category.title}>
              <p className="text-xs font-semibold text-gray-400 uppercase mb-3">
                {category.title}
              </p>
              <ul className="space-y-2">
                {category.list.map((item) => (
                  <MenuLink key={item.title} item={item} />
                ))}
                {category.title === "MAIN" && (
                  <li>
                    <button
                      onClick={handleLogout}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-500 hover:text-white`}
                    >
                      <RiLogoutCircleLine />
                      <span>Log Out</span>
                    </button>
                  </li>
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
