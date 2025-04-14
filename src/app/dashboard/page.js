'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar";  // Correct import path

export default function Dashboard() {
  const [inventoryData, setInventoryData] = useState([]);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // State for sidebar (collapsed or expanded)
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token"); // Retrieve token from localStorage

    if (!token) {
      setError("No token found. Please log in.");
      return; // Exit if token is not found
    }

    fetch("https://onlydevs-ims.onrender.com/api/inventory", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,  // Include token in Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInventoryData(data);  // Store data if response is an array
        } else {
          setError("Unexpected API response format");
          console.error(data);
        }
      })
      .catch((error) => {
        setError("Error fetching inventory data.");
        console.error("Error fetching inventory data:", error);
      });
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);  // Toggle sidebar state
  };

  return (
    <div className="flex min-h-screen">
      <Navbar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />  {/* Pass sidebar state and toggle function */}
      
      {/* Adjust the left margin depending on the sidebar state */}
      <div className={`flex-1 p-6 transition-all ${isSidebarOpen ? 'ml-14' : 'ml-20'}`}>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-2">Welcome to your inventory management system.</p>

        {error && <p className="text-red-500">{error}</p>}

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold">Total Inventory Items</h2>
            <p className="text-3xl font-bold">
              {inventoryData.length}
            </p>
          </div>
          
          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold">Total Stock</h2>
            <p className="text-3xl font-bold">
              {inventoryData.reduce((total, item) => total + item.quantity, 0)}
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold">Total Inventory Cost</h2>
            <p className="text-3xl font-bold">
              ${inventoryData.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
            </p>
          </div>

          <div className="p-4 bg-gray-100 rounded-lg">
            <h2 className="text-lg font-semibold">Low Stock Alerts (≤ 50)</h2>
            <ul className="text-black text-sm mt-2 space-y-1 max-h-40 overflow-y-auto">
              {inventoryData
                .filter(item => item.quantity <= 50)
                .map(item => (
                  <li key={item._id}>
                    {item.name} – {item.quantity} left
                  </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Inventory Data</h2>
          <ul className="bg-gray-100 p-4 rounded-lg">
            {inventoryData.length > 0 ? (
              inventoryData.map((item) => (
                <li key={item._id} className="p-2 border-b border-gray-300">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowModal(true);
                    }}
                    className="text-left w-full hover:bg-gray-200 rounded px-2 py-1"
                  >
                    <strong>{item.name}</strong>: {item.quantity} in stock, Price: ${item.price}
                  </button>
                </li>
              ))
            ) : (
              <p>No inventory data available.</p>
            )}
          </ul>
        </div>

        <div className="mt-6">
          <Link href="/inventory" className="text-blue-600 hover:underline">
            View Inventory
          </Link>
        </div>

        {showModal && selectedItem && (
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/40 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96 relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 right-3 text-gray-600 hover:text-black"
              >
                ✕
              </button>
              <h3 className="text-xl font-bold mb-2">{selectedItem.name}</h3>
              <ul className="text-sm text-gray-800 space-y-1">
                <li><strong>Item ID:</strong> {selectedItem._id}</li>
                <li><strong>Quantity:</strong> {selectedItem.quantity}</li>
                <li><strong>Price:</strong> ${selectedItem.price}</li>
                <li><strong>User:</strong> {selectedItem.user}</li>
                <li><strong>Created At:</strong> {new Date(selectedItem.createdAt).toLocaleString()}</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}