"use client";

import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center text-center"
      style={{
        backgroundImage: "url('/backgroundGetStarted.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Blurred Overlay */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-md"></div>

      {/* Header */}
      <header className="absolute top-6 left-0 right-0 flex justify-between items-center px-12 text-white z-20">
        <h1 className="text-3xl font-bold">InventoryMS</h1>
        <nav>
          <ul className="flex space-x-6">
            <li className="hover:text-blue-300 cursor-pointer">About</li>
            <li className="hover:text-blue-300 cursor-pointer">Contact</li>
          </ul>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-20 mt-16 max-w-2xl text-white">
        <h2 className="text-5xl font-bold leading-tight">Inventory Management System</h2>
        <p className="text-2xl mt-4 text-gray-200">
          Simplify your inventory tracking and management with our intuitive and efficient platform.
        </p>

        <div className="mt-6 flex space-x-4 justify-center">
          <button
            className="bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
            onClick={() => router.push('/login')}
          >
            Login
          </button>
          <button
            className="bg-gray-800 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-gray-900 transition-all"
            onClick={() => router.push('/signup')}
          >
            Signup
          </button>
        </div>
      </main>
    </div>
  );
}