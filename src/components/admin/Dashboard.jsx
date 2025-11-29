// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [overview, setOverview] = useState({
    appointments: 0,
    clients: 0,
    revenue: 0,
    growth: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/analytics/overview');
        // Defensive parsing — never crash
        const data = res.data || {};
        setOverview({
          appointments: data.totalAppointments || data.appointments || 0,
          clients: data.totalClients || data.clients || 0,
          revenue: data.totalRevenue || data.revenue || 0,
          growth: data.revenueGrowth || data.growth || 0,
          todayAppointments: data.todayAppointments || 0,
          pendingAppointments: data.pendingAppointments || 0,
        });
        setError(null);
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
        setError('Unable to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const stats = [
    { label: 'Total Appointments', value: overview.appointments, icon: 'Calendar' },
    { label: 'Active Clients', value: overview.clients, icon: 'Users' },
    { label: 'Total Revenue', value: `$${Number(overview.revenue).toLocaleString()}`, icon: 'Dollar' },
    { label: 'Appointments Today', value: overview.todayAppointments, icon: 'Clock' },
    { label: 'Pending Confirmations', value: overview.pendingAppointments, icon: 'Alert' },
    { label: 'Revenue Growth', value: `${overview.growth > 0 ? '+' : ''}${overview.growth}%`, trend: overview.growth > 0, icon: 'Trending' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-stone-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-gold-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-6 text-gray-600 font-light tracking-wide">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-stone-50 to-gray-100">
      {/* Subtle gold overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-gold-200/30 via-transparent to-gold-300/20" />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-light tracking-wider text-gray-900">
            Admin Dashboard
          </h1>
          <div className="w-40 h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent mx-auto mt-8" />
          <p className="text-xl text-gray-600 mt-6 font-light tracking-wide">
            Real-time insights into your salon’s performance
          </p>
        </motion.div>

        {error && (
          <div className="mb-12 p-8 bg-red-50 border border-red-200 text-red-800 text-center font-light rounded-none">
            {error}
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="p-10 text-center">
                <div className="text-5xl mb-6 opacity-10">{stat.icon}</div>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-3">
                  {stat.label}
                </p>
                <div
                  className={`text-4xl md:text-5xl font-light tracking-tight ${
                    stat.trend !== undefined
                      ? stat.trend
                        ? 'text-emerald-600'
                        : 'text-red-600'
                      : 'text-gray-900'
                  }`}
                >
                  {stat.value}
                </div>
                {stat.trend !== undefined && (
                  <div className="mt-4 inline-flex items-center gap-2">
                    <span className={`text-sm font-medium ${stat.trend ? 'text-emerald-600' : 'text-red-600'}`}>
                      {stat.trend ? 'Up' : 'Down'} {Math.abs(overview.growth)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Bottom gold accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent opacity-30" />
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <div className="text-center mt-20">
          <p className="text-gray-500 font-light tracking-wide">
            Last updated: {new Date().toLocaleString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
}