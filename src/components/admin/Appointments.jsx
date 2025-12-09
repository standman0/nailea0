// src/components/admin/Appointments.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  User, 
  Scissors,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data?.appointments || [];
        // Sort by date/time (soonest first)
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.date + ' ' + a.time);
          const dateB = new Date(b.date + ' ' + b.time);
          return dateA - dateB;
        });
        setAppointments(sorted);
      })
      .catch(err => {
        console.error("Failed to load appointments:", err);
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-black text-white';
      case 'pending':
        return 'bg-amber-100 text-amber-800 border border-amber-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 border border-emerald-200';
      case 'cancelled':
      case 'no-show':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

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
      <div className="mb-12">
        <h1 className="text-5xl font-light tracking-wider text-gray-900">
          Appointments
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-6" />
        <p className="text-lg text-gray-600 mt-4 font-light">
          {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'} scheduled
        </p>
      </div>

      {/* Appointments List */}
      <div className="space-y-8">
        {appointments.length === 0 ? (
          <div className="bg-white border border-gray-200 shadow-2xl p-24 text-center">
            <div className="mx-auto w-32 h-32 mb-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full flex items-center justify-center">
              <Calendar className="w-16 h-16 text-amber-600/30" />
            </div>
            <Sparkles className="w-20 h-20 mx-auto mb-6 text-amber-600/20" />
            <h3 className="text-2xl font-light text-gray-600 mb-3">
              No appointments yet
            </h3>
            <p className="text-gray-500 font-light">
              When clients book, they’ll appear here in elegant detail.
            </p>
          </div>
        ) : (
          appointments.map((appt) => {
            const clientName = appt.clientId?.fullName || 
                              appt.clientId?.name || 
                              appt.client?.fullName || 
                              'Guest';

            const serviceName = appt.serviceId?.name || 
                               appt.serviceName || 
                               'Service';

            return (
              <Link
                key={appt._id}
                to={`/admin/appointments/${appt._id}`}
                className="block group"
              >
                <div className="bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:border-amber-200">
                  {/* Gold top accent */}
                  <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent opacity-70 group-hover:opacity-100 transition" />

                  <div className="p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                    {/* Left: Client + Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-5 mb-5">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {clientName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-2xl font-light text-gray-900 tracking-wide">
                            {clientName}
                          </h3>
                          <div className="flex items-center gap-3 mt-2 text-gray-600">
                            <Scissors className="w-5 h-5 text-amber-600" />
                            <span className="font-medium">{serviceName}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-8 text-gray-600 font-light text-sm">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-amber-600" />
                          <span>{formatDate(appt.date)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-amber-600" />
                          <span>{appt.time}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Status + Arrow */}
                    <div className="flex items-center gap-8">
                      <div className={`px-6 py-3 rounded-full text-sm font-semibold tracking-wider uppercase ${getStatusStyle(appt.status)}`}>
                        {appt.status || 'Pending'}
                      </div>

                      <div className="flex items-center gap-3 text-gray-700 group-hover:text-black transition">
                        <span className="font-medium tracking-wide">View Details</span>
                        <ChevronRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom gold line */}
                  <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-30 group-hover:opacity-50 transition" />
                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}