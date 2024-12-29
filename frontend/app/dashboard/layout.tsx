'use client';

import React from 'react';
import Link from 'next/link';

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white flex flex-col">
        <Link href="/dashboard" className="p-6 text-2xl font-bold border-b border-gray-700 ">
          Devmatch
        </Link>
        <nav className="flex-1 p-4 space-y-4">
          <Link href="/dashboard/hire" className="block px-4 py-2 rounded hover:bg-gray-700">
           Hire
          </Link>
          <Link href="/dashboard/apply" className="block px-4 py-2 rounded hover:bg-gray-700">
           Apply
          </Link>
          <Link href="/dashboard/chatbot" className="block px-4 py-2 rounded hover:bg-gray-700">
            Chatbot
          </Link>
          <Link href="/dashboard/profile" className="block px-4 py-2 rounded hover:bg-gray-700">
            Profile
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
