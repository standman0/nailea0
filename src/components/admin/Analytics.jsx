// src/components/admin/Analytics.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { 
  DollarSign, 
  Calendar, 
  Users, 
  TrendingUp, 
  Activity, 
  Sparkles,
  ArrowUpRight,
  Clock,
  Star
} from 'lucide-react';

export default function AdminAnalytics() {
  const [data, setData] = useState({
    overview: {},
    popularServices: [],
    topClients: [],
    trends: [],
    peakHours: [],
    cancellations: {},
    monthlyComparison: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllAnalytics = async () => {
      try {
        const [
          overview,
          popularServices,
          topClients,
          trends,
          peakHours,
          cancellations,
          monthly
        ] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/services/popular'),
          api.get('/analytics/clients/top'),
          api.get('/analytics/trends'),
          api.get('/analytics/peak-hours'),
          api.get('/analytics/cancellations'),
          api.get('/analytics/monthly')
        ]);

        setData({
          overview: overview.data || {},
          popularServices: popularServices.data || [],
          topClients: topClients.data || [],
          trends: trends.data || [],
          peakHours: peakHours.data || [],
          cancellations: cancellations.data || {},
          monthlyComparison: monthly.data || {}
        });
      } catch (err) {
        console.error("Analytics fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllAnalytics();
  }, []);

  const formatCurrency = (amount) => amount ? `$${Number(amount).toLocaleString()}` : '$0';
  const o = data.overview;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-6xl font-light tracking-widest text-gray-900">
          Analytics
        </h1>
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-8" />
        <p className="text-xl text-gray-600 mt-6 font-light tracking-wide">
          Live insights from your studio’s performance
        </p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        {[
          { label: 'Total Revenue', value: formatCurrency(o.totalRevenue), icon: DollarSign, color: 'from-amber-500 to-amber-600' },
          { label: 'Appointments', value: o.totalAppointments || 0, icon: Calendar, color: 'from-amber-600 to-amber-700' },
          { label: 'Active Clients', value: o.totalClients || 0, icon: Users, color: 'from-emerald-500 to-emerald-600' },
          { label: 'Avg. Revenue/Visit', value: formatCurrency(o.avgRevenuePerVisit), icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
        ].map((metric, i) => {
          const Icon = metric.icon;
          return (
            <div
              key={i}
              className="group relative bg-white border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:border-amber-200"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${metric.color}`} />
              <div className="p-10 text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${metric.color} p-5 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-full h-full text-white" />
                </div>
                <p className="text-sm uppercase tracking-widest text-gray-500 font-medium mb-4">{metric.label}</p>
                <p className="text-4xl font-light text-gray-900">{metric.value}</p>
              </div>
              <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-30" />
            </div>
          );
        })}
      </div>

      {/* Live Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
        {/* This Month Revenue */}
        <div className="lg:col-span-2 relative bg-black text-white shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-transparent to-amber-800/20" />
          <div className="relative p-12">
            <p className="text-sm uppercase tracking-widest opacity-80 mb-3">This Month Revenue</p>
            <p className="text-7xl font-light tracking-tight">
              {formatCurrency(o.thisMonthRevenue)}
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Activity className="w-9 h-9 opacity-60" />
              <span className="text-2xl text-amber-400 font-medium">
                {o.growth > 0 ? '+' : ''}{o.growth || 0}% vs last month
              </span>
            </div>
          </div>
          <Sparkles className="absolute bottom-8 right-10 w-20 h-20 opacity-10 group-hover:opacity-20 transition" />
        </div>

        {/* Top Performing Service */}
        <div className="bg-white border border-gray-200 shadow-2xl p-10 text-center">
          <Star className="w-16 h-16 mx-auto mb-6 text-amber-500" />
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Most Popular Service</p>
          <p className="text-3xl font-light text-gray-900">
            {data.popularServices[0]?.name || '—'}
          </p>
          <p className="text-5xl font-light text-amber-600 mt-4">
            {data.popularServices[0]?.count || 0}
          </p>
          <p className="text-gray-600">bookings this month</p>
        </div>
      </div>

      {/* Top Clients */}
      {data.topClients.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-light text-center mb-10 text-gray-900">VIP Clients</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.topClients.slice(0, 3).map((client, i) => (
              <div key={i} className="bg-white border border-gray-200 shadow-lg p-8 text-center hover:shadow-xl transition">
                <div className={`w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                  {client.fullName?.[0] || 'C'}
                </div>
                <p className="text-xl font-light text-gray-900">{client.fullName || client.name}</p>
                <p className="text-3xl font-light text-amber-600 mt-3">
                  {formatCurrency(client.totalSpent)}
                </p>
                <p className="text-sm text-gray-600">{client.appointments} visits</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Peak Hours Preview */}
      {data.peakHours.length > 0 && (
        <div className="text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-4">Peak Booking Hour</p>
          <p className="text-6xl font-light text-amber-600">
            {data.peakHours[0]?.hour}:00
          </p>
          <p className="text-gray-600 mt-3">{data.peakHours[0]?.count} appointments</p>
        </div>
      )}

      <div className="mt-20 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-40" />
    </div>
  );
}