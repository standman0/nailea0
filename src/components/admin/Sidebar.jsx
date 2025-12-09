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
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo & Toggle */}
          <div className="flex items-center justify-between p-8 border-b border-gray-100">
            <h1 className="text-2xl font-light tracking-wider text-gray-900">
              Nailea Studios
            </h1>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* User Info */}
          <div className="px-8 py-2 border-b border-gray-100">
            <p className="text-sm uppercase tracking-widest text-gray-500">Welcome back</p>
            <p className="text-lg font-medium text-gray-900 mt-1">{user?.name || 'Admin'}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-6 py-8 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.to;

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-4 px-6 py-4 rounded-none transition-all duration-300 group ${
                    isActive
                      ? 'bg-black text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900'}`} />
                  <span className="font-medium ">{item.label}</span>
                  {isActive && <div className="ml-auto w-1 h-8 bg-gold-600" />}
                </NavLink>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-6 border-t border-gray-100">
            <button
              onClick={logout}
              className="flex items-center gap-4 w-full px-6 py-4 text-gray-700 hover:bg-gray-50 transition-all group"
            >
              <LogOut className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
              <span className="font-medium tracking-wide">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 lg:hidden bg-black text-white p-4 rounded-full shadow-2xl z-40 hover:bg-gray-900 transition"
      >
        <Menu className="w-6 h-6" />
      </button>
    </>
  );
}