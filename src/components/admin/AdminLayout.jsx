// src/components/admin/AdminLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-stone-50 to-gray-100">
      <Sidebar />
      <main className="lg:ml-72 p-8">
        <Outlet />
      </main>
    </div>
  );
}