'use client';

import React from 'react'; // Import React here
import { useRouter, usePathname } from 'next/navigation';
import { Home, Boxes, Menu, Settings, Settings2, Settings2Icon } from 'lucide-react'; // Add Menu (burger icon) from lucide-react

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = React.useState(pathname);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <Home size={20} /> },
    { name: 'Inventory', path: '/inventory', icon: <Boxes size={20} /> },

  ];

  const handleNav = (path) => {
    setActive(path);
    router.push(path);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="h-screen w-64 bg-gray-900 text-white fixed top-0 left-0 flex flex-col py-6 shadow-lg">
        {/* Logo and Burger Icon */}
        <div className="flex items-center justify-between px-4 mb-10">
          <h1 className="text-2xl font-bold text-center">
            InventoryMS
          </h1>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col space-y-2 px-4">
          {navItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleNav(item.path)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                active === item.path
                  ? 'bg-blue-600'
                  : 'hover:bg-gray-800'
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>
        <div className="mt-auto px-4">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/");
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg mt-6"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 p-6">
        {/* Content of the page goes here */}
      </div>
    </div>
  );
}