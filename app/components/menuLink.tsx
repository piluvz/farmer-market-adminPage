"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MenuItem {
  path: string;
  icon: React.ReactNode;
  title: string;
}

const MenuLink = ({ item }: { item: MenuItem }) => {
  const pathname = usePathname();

  return (
    <Link
      href={item.path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg ${
        pathname === item.path
          ? "bg-blue-500 text-white"
          : "text-gray-700 hover:bg-blue-500 hover:text-white"
      }`}
    >
      {item.icon}
      <span>{item.title}</span>
    </Link>
  );
};

export default MenuLink;
