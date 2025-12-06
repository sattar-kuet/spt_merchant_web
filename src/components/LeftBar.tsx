// Navbar.tsx
"use client";
import { MdDashboard, MdBarChart } from "react-icons/md";
import { BsBox2 } from "react-icons/bs";
import { CiSettings } from "react-icons/ci";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Avatar from "@/components/ui/Avatar";


const menuItems = [
    { name: "Dashboard", path: "/", icon: <MdDashboard size={20} /> },
    { name: "All Parcels", path: "/parcels", icon: <BsBox2 size={20} /> },
    {name: "All orders", path: "/orders", icon: <BsBox2 size={20} /> },
    { name: "Reports", path: "/reports", icon: <MdBarChart size={20} /> },
    { name: "Settings", path: "/settings", icon: <CiSettings size={20} /> },
];

const imgLink = "https://avatars.githubusercontent.com/u/173485995?v=4&size=64"


const LeftBar = () => {
    const pathname = usePathname();

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname.startsWith(path);
    };

    return (
        <div className="p-5 bg-white h-screen w-68">

            <div className="flex items-center gap-4 mb-8">
                <Avatar imgLink={imgLink} />
                <p className="text-base">Parcel.INC</p>
            </div>

            {menuItems.map((item) => (
                <Link
                    href={item.path}
                    key={item.name}
                    className={`${isActive(item.path) ? "text-white bg-blue-600" : "text-slate-700"} flex justify-start items-center px-3 py-2 rounded-sm gap-4 text-xs sm:text-sm md:text-base mb-4`}
                >
                    {item.icon}
                    {item.name}
                </Link>
            ))}
        </div>
    );
};

export default LeftBar;