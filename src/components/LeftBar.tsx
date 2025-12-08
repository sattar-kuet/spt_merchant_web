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

const menuItems = [
  { name: "Dashboard", path: "/", icon: <MdDashboard size={20} /> },
  { name: "All Parcels", path: "/parcels", icon: <BsBox2 size={20} /> },
  { name: "Reports", path: "/reports", icon: <MdBarChart size={20} /> },
  { name: "Settings", path: "/settings", icon: <CiSettings size={20} /> },
];

const imgLink = "https://avatars.githubusercontent.com/u/173485995?v=4&size=64";

const LeftBar = () => {
  const pathname = usePathname();
  const { isOpen, close, toggle } = useSidebar();

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  // Single sidebar implementation that works on all screen sizes
  const sidebarClasses = `p-5 bg-white h-screen w-68 ${
    isOpen ? "block" : "hidden"
  }`;

  return (
    <div className={sidebarClasses}>
      <div className="flex items-center gap-4 mb-8">
        <Avatar>
          <AvatarImage src={imgLink} alt="avatar" />
        </Avatar>
        <p className="text-base">Parcel.INC</p>
        <button
          onClick={close}
          className="ml-auto cursor-pointer"
          aria-label="Close sidebar"
        >
          <IoMdClose size={23} />
        </button>
      </div>

      {menuItems.map((item) => (
        <Link
          href={item.path}
          key={item.name}
          className={`${
            isActive(item.path) ? "text-white bg-blue-600" : "text-slate-700"
          } flex justify-start items-center px-3 py-2 rounded-sm gap-4 text-xs sm:text-sm md:text-base mb-4`}
        >
          {item.icon}
          {item.name}
        </Link>
      ))}
    </div>
  );
};

export default LeftBar;