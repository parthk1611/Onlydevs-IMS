export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
// Login function
export const loginUser = async (email, password) => {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json(); // Should return { token, message, etc. }
};

// Register function
export const registerUser = async (username, email, password) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  return res.json(); // Should return the result of registration
};

// Delete Inventory Item
export const deleteItem = async (itemId, token) => {
  const res = await fetch(`http://localhost:5000/api/inventory/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`, // Include the token for authorization
    },
  });
  return res.json(); // Should return the result of deletion
};