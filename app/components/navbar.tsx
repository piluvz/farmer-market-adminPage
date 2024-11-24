"use client";
import { usePathname } from "next/navigation";
import { RiNotification3Line, RiMessage2Line, RiSearchLine } from "react-icons/ri";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <div className="bg-white shadow-sm rounded-md px-4 md:px-6">
      {/* Navbar Content */}
      <div className="flex items-center justify-between py-3 md:py-4">
        {/* Title */}
        <h1 className="font-bold text-gray-700 capitalize text-sm md:text-lg">
          {pathname.split("/").pop()}
        </h1>

        {/* Search and Icons */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search Bar */}
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 md:px-4 md:py-2 rounded-full">
            <RiSearchLine className="text-gray-500" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-xs md:text-sm text-gray-600"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-3 md:gap-4">
            <RiMessage2Line
              className="text-gray-600 hover:text-blue-500"
              size={18}
            />
            <RiNotification3Line
              className="text-gray-600 hover:text-blue-500"
              size={18}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
