// src/pages/AdminAccess.jsx
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";

export default function AdminAccess() {
  const [authorized, setAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const ADMIN_PASSWORD = "Admin123"; // Change this

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) setAuthorized(true);
    else alert("Incorrect password!");
  };

  const handleLogout = () => {
    setAuthorized(false);
    setPassword("");
  };

  if (!authorized)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-10">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold mb-2">Admin Access</h1>
            <p className="text-gray-300">Enter your credentials to continue</p>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 mb-6 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
            placeholder="Enter admin password"
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Access Dashboard
          </button>
        </div>
      </div>
    );

  return (
    <Routes>
      <Route path="/*" element={<AdminLayout onLogout={handleLogout} />} />
    </Routes>
  );
}