"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { useState as useLocalState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Package, Monitor, Keyboard, Mouse, Smartphone, Cpu } from "lucide-react";

export default function InventoryPage() {
  const [inventoryData, setInventoryData] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useLocalState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [editedItemData, setEditedItemData] = useState({});
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [newItemData, setNewItemData] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found.");
      return;
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setInventoryData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching inventory data:", error);
      });
  }, []);

  useEffect(() => {
    if (editItem) {
      setEditedItemData(editItem);
    }
  }, [editItem]);

  const handleAddItem = () => {
    const token = localStorage.getItem("token");
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/inventory`, newItemData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        setIsAddItemOpen(false);
        location.reload();
      })
      .catch((error) => {
        console.error("Error adding new inventory item:", error);
      });
  };

  const getItemIcon = (name) => {
    const lowered = name.toLowerCase();
    if (lowered.includes("monitor")) return <Monitor className="w-6 h-6 text-gray-500" />;
    if (lowered.includes("keyboard")) return <Keyboard className="w-6 h-6 text-gray-500" />;
    if (lowered.includes("mouse")) return <Mouse className="w-6 h-6 text-gray-500" />;
    if (lowered.includes("phone")) return <Smartphone className="w-6 h-6 text-gray-500" />;
    if (lowered.includes("cpu") || lowered.includes("processor")) return <Cpu className="w-6 h-6 text-gray-500" />;
    return <Package className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="flex">
      <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div
        className={`flex-1 transition-all duration-300 ${
          isSidebarOpen ? "ml-10" : "ml-10"
        }`}
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Inventory Items</h1>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setIsAddItemOpen(true)}
            >
              Add Inventory
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {inventoryData.map((item) => (
              <div
                key={item._id}
                className="bg-white p-4 rounded-lg shadow-md w-full max-w-sm mx-auto"
              >
                <div className="flex items-center gap-2">
                  {getItemIcon(item.name)}
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                </div>
                <p className="mt-2 text-gray-700">Quantity: {item.quantity}</p>
                <p className="mt-2 text-gray-700">Price: ${item.price}</p>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={() => setSelectedItem(item)}
                  >
                    View Details
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    onClick={() => setEditItem(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    onClick={() => {
                      const token = localStorage.getItem("token");
                      axios
                        .delete(`${process.env.NEXT_PUBLIC_API_URL}/inventory/${item._id}`, {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          },
                        })
                        .then(() => {
                          location.reload();
                        })
                        .catch((error) => {
                          console.error("Error deleting inventory item:", error);
                        });
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Add Item Modal */}
      <Transition.Root show={isAddItemOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsAddItemOpen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Add New Item
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={newItemData.name || ""}
                        onChange={(e) => setNewItemData({ ...newItemData, name: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Item Name"
                      />
                      <input
                        type="number"
                        value={newItemData.quantity || ""}
                        onChange={(e) => setNewItemData({ ...newItemData, quantity: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Quantity"
                      />
                      <input
                        type="number"
                        value={newItemData.price || ""}
                        onChange={(e) => setNewItemData({ ...newItemData, price: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Price"
                      />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={handleAddItem}
                      >
                        Add Item
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setIsAddItemOpen(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* View Item Modal */}
      <Transition.Root show={selectedItem !== null} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setSelectedItem(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      Item Details
                    </h3>
                    <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                      {JSON.stringify(selectedItem, null, 2)}
                    </pre>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setSelectedItem(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Edit Item Modal */}
      <Transition.Root show={editItem !== null} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setEditItem(null)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Edit Item</h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editedItemData.name || ""}
                        onChange={(e) => setEditedItemData({ ...editedItemData, name: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Item Name"
                      />
                      <input
                        type="number"
                        value={editedItemData.quantity || ""}
                        onChange={(e) => setEditedItemData({ ...editedItemData, quantity: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Quantity"
                      />
                      <input
                        type="number"
                        value={editedItemData.price || ""}
                        onChange={(e) => setEditedItemData({ ...editedItemData, price: e.target.value })}
                        className="w-full border px-3 py-2 rounded"
                        placeholder="Price"
                      />
                    </div>
                    <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => {
                          const token = localStorage.getItem("token");
                          axios
                            .put(`${process.env.NEXT_PUBLIC_API_URL}/inventory/${editItem._id}`, editedItemData, {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            })
                            .then(() => {
                              setEditItem(null);
                              location.reload();
                            })
                            .catch((error) => {
                              console.error("Error updating inventory item:", error);
                            });
                        }}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                        onClick={() => setEditItem(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}