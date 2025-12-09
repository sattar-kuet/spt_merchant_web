// Navbar.tsx
"use client";
import { MdDashboard, MdBarChart } from "react-icons/md";
import { BsBox2 } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarImage } from "@/components/ui/Avatar";
import { useSidebar } from "@/context/SidebarContext";
import { IoMdClose } from "react-icons/io";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import logo from "../../public/logo.png";

const menuItems = [
  { name: "Dashboard", path: "/", icon: <MdDashboard size={20} /> },
  { name: "All Parcels", path: "/parcels", icon: <BsBox2 size={20} /> },
  { name: "Reports", path: "/reports", icon: <MdBarChart size={20} /> },
  { name: "Settings", path: "/settings", icon: <CiSettings size={20} /> },
];

const imgLink = "https://i.ibb.co.com/BH1VBCj2/logo.png";

const LeftBar = () => {
  const pathname = usePathname();
  const { isOpen, close, toggle } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Improved responsive sidebar implementation with adjusted width for collapsed state
  const sidebarClasses = `p-5 bg-white h-screen fixed md:relative z-30 transition-all duration-300 ease-in-out overflow-x-hidden ${
    isOpen ? "left-0 w-64 md:block" : "-left-64 md:left-0 md:w-26"
  }`;

  return (
    <>
      {/* Mobile overlay with transparent background and blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-20 md:hidden"
          onClick={close}
        />
      )}

      <div className={sidebarClasses}>
        <div className="flex items-center gap-4 mb-8">
          <img src={imgLink} alt="Logo" className="w-10 h-10 object-contain" />
          <p
            className={`text-base truncate ${
              isOpen ? "block" : "hidden md:hidden"
            }`}
          >
            Nano.INC
          </p>
          {/* Collapse/Expand button for desktop, placed inside the header area with adjusted spacing and shadow */}
          <button
            onClick={toggle}
            className="hidden cursor-pointer md:block ml-auto mr-2 text-gray-500 hover:text-gray-700 focus:outline-none shadow-sm"
            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isOpen ? (
              <FaChevronLeft size={18} />
            ) : (
              <FaChevronRight size={18} />
            )}
          </button>
          <button
            onClick={close}
            className="ml-auto cursor-pointer md:hidden"
            aria-label="Close sidebar"
          >
            <IoMdClose size={23} />
          </button>
        </div>
        <hr></hr>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`flex items-center p-3 rounded-lg mb-1 transition-colors ${
              isActive(item.path)
                ? "bg-blue-50 text-blue-600"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="flex items-center justify-center w-6">
              {item.icon}
            </span>
            <span className={`ml-3 ${isOpen ? "block" : "hidden md:hidden"}`}>
              {item.name}
            </span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default LeftBar;