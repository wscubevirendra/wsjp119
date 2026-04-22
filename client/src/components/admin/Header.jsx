import { FaBars, FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

export default function AdminHeader() {
    return (
        <header className="w-full bg-white shadow-sm px-6 py-3 flex items-center justify-between">

            {/* Left: Hamburger + Page Title */}
            <div className="flex items-center gap-4">
               
                <h1 className="text-lg font-semibold text-gray-800">Dashboard</h1>
            </div>

            {/* Middle: Search Bar */}
            <div className="hidden md:flex flex-1 max-w-md mx-6">
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-full border rounded-full px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <FaSearch className="absolute left-3 top-3 text-gray-400" />
                </div>
            </div>

            {/* Right: Icons + Profile */}
            <div className="flex items-center gap-6">
                {/* Notifications */}
                <div className="relative cursor-pointer text-gray-600 hover:text-blue-600">
                    <FaBell size={18} />
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        3
                    </span>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-2 cursor-pointer">
                    <FaUserCircle size={28} className="text-gray-600" />
                    <span className="hidden md:inline text-gray-700 font-medium">Admin</span>
                </div>
            </div>
        </header>
    );
}
