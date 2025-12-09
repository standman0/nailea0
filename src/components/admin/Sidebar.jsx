// src/components/admin/Sidebar.jsx
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Scissors, 
  Settings, 
  BarChart3, 
  Bell, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

const menuItems = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/admin/clients', icon: Users, label: 'Clients' },
  { to: '/admin/services', icon: Scissors, label: 'Services' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">

          {/* Logo + Close Button */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h1 className="text-2xl font-light tracking-widest text-gray-900">
              NAILEA
            </h1>
            <button onClick={() => setIsOpen(false)} className="lg:hidden">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Compact User Info */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wider">Welcome back</p>
              <p className="text-sm font-semibold text-gray-900">{user?.name || 'Admin'}</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-3 py-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.startsWith(item.to);

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all group relative overflow-hidden ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'
                  }`} />
                  <span>{item.label}</span>

                  {/* Gold left bar indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-yellow-600" />
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="border-t border-gray-100 p-4">
            <button
              onClick={logout}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition group"
            >
              <LogOut className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Floating Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 lg:hidden bg-black text-white p-4 rounded-full shadow-2xl z-40 hover:bg-gray-900 transition-all"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}