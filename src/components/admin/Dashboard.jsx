// src/pages/admin/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Sparkles
} from 'lucide-react';

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

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        const res = await api.get('/analytics/overview');
        const data = res.data || {};
        setOverview({
          appointments: data.totalAppointments || data.appointments || 0,
          clients: data.totalClients || data.clients || 0,
          revenue: data.totalRevenue || data.revenue || 0,
          growth: data.revenueGrowth || data.growth || 0,
          todayAppointments: data.todayAppointments || 0,
          pendingAppointments: data.pendingAppointments || 0,
        });
      } catch (err) {
        console.error('Dashboard fetch failed:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const stats = [
    { label: 'Total Appointments', value: overview.appointments.toLocaleString(), icon: Calendar, color: 'from-amber-500 to-amber-600' },
    { label: 'Active Clients', value: overview.clients.toLocaleString(), icon: Users, color: 'from-amber-600 to-amber-700' },
    { label: 'Total Revenue', value: `$${Number(overview.revenue).toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Appointments Today', value: overview.todayAppointments, icon: Clock, color: 'from-blue-500 to-blue-600' },
    { label: 'Pending Confirmations', value: overview.pendingAppointments, icon: AlertCircle, color: 'from-orange-500 to-orange-600' },
    { 
      label: 'Revenue Growth', 
      value: `${overview.growth > 0 ? '+' : ''}${overview.growth}%`, 
      icon: TrendingUp, 
      color: overview.growth >= 0 ? 'from-emerald-500 to-emerald-600' : 'from-red-500 to-red-600',
      trend: overview.growth >= 0
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-gray-600 font-light tracking-wide">Preparing your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-amber-50/30">
      <div className="max-w-7xl mx-auto px-6 py-16">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl md:text-7xl font-light tracking-widest text-gray-900">
            Dashboard
          </h1>
          <div className="w-48 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-8" />
          <p className="text-xl text-gray-600 mt-8 font-light tracking-wide max-w-2xl mx-auto">
            Welcome back. Here’s what’s happening at Nailea Studios today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Gold Top Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${stat.color}`} />

                <div className="p-10 text-center">
                  {/* Icon with Gradient Circle */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${stat.color} p-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  <p className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-4">
                    {stat.label}
                  </p>

                  <div className={`text-5xl font-light tracking-tight ${
                    stat.trend !== undefined
                      ? stat.trend ? 'text-emerald-600' : 'text-red-600'
                      : 'text-gray-900'
                  }`}>
                    {stat.value}
                  </div>

                  {stat.trend !== undefined && (
                    <div className="mt-5 flex items-center justify-center gap-2">
                      <TrendingUp className={`w-5 h-5 ${stat.trend ? 'text-emerald-600' : 'text-red-600 rotate-180'}`} />
                      <span className={`text-sm font-medium ${stat.trend ? 'text-emerald-600' : 'text-red-600'}`}>
                        {stat.trend ? 'Up' : 'Down'} from last month
                      </span>
                    </div>
                  )}
                </div>

                {/* Subtle Sparkle on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                  <Sparkles className="absolute top-6 right-6 w-12 h-12 text-amber-400/20" />
                  <Sparkles className="absolute bottom-8 left-10 w-8 h-8 text-amber-300/20" />
                </div>

                {/* Bottom Gold Line */}
                <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-30 mt-8" />
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-center mt-20"
        >
          <p className="text-gray-500 font-light tracking-wider">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: 'numeric',
              minute: '2-digit',
            })}
          </p>
        </motion.div>
      </div>
    </div>
  );
}