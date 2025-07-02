import Link from "next/link";
import { ReactNode } from "react";
import AdminLogoutButton from "./logout-button";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/reviews", label: "Reviews" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-8 text-primary">Admin Panel</h2>
        <nav className="flex-1 space-y-4">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded hover:bg-primary hover:text-white transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="mt-8">
          <AdminLogoutButton />
        </div>
      </aside>
      {/* Main content */}
      <main className="flex-1 p-8">
        {/* Topbar */}
        <div className="mb-8 flex justify-between items-center">
          <div className="text-lg font-semibold text-gray-700">Welcome, Admin</div>
        </div>
        {children}
      </main>
    </div>
  );
} 