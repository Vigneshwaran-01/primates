"use client";
import { useState } from "react";

export default function AdminLogoutButton() {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin-login";
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors font-semibold"
    >
      {loading ? "Logging out..." : "Logout"}
    </button>
  );
} 