"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const data = await loginUser(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } else {
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side background image */}
      <div
        className="w-1/2 bg-cover bg-center"
        style={{
          backgroundImage: "url('/loginback.png')",
          filter: "brightness(70%)",
        }}
      ></div>

      {/* Right side form */}
      <div className="w-1/2 flex items-center justify-center bg-white">
        <div className="bg-white/80 backdrop-blur-md p-8 rounded-lg shadow-md w-96">
          <img src="/logoLogin.png" alt="Login Logo" className="w-20 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4 text-center text-black">Login to your Account</h1>
          <h2 className="text-sm font-light text-center text-gray-400 mb-16">
            Welcome back! Please enter your details.
          </h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 shadow-sm rounded mt-1 text-black mb-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full p-2 shadow-sm rounded mt-1 text-black"
                placeholder="**********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" id="rememberMe" />
                <label htmlFor="rememberMe" className="text-gray-700">
                  Remember for 30 days
                </label>
              </div>
              <a href="#" className="text-sm text-sky-500 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-sky-500 text-white p-2 rounded hover:bg-blue-600 mb-11"
            >
              Sign in
            </button>
          </form>

          <p className="mt-4 text-center text-gray-700">
            Don’t have an account?{" "}
            <a href="/signup" className="text-sky-500 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}