// src/components/admin/Appointments.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ChevronRight } from 'lucide-react';

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/appointments')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data?.appointments || [];
        setAppointments(data);
      })
      .catch(err => {
        console.error("Failed to load appointments:", err);
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-16 h-16 border-4 border-gold-600 border-t-transparent rounded-full animate-spin" />
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
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent mt-6" />
        <p className="text-lg text-gray-600 mt-4 font-light">
          {appointments.length} upcoming reservations
        </p>
      </div>

      {/* Appointments List */}
      <div className="space-y-6">
        {appointments.length === 0 ? (
          <div className="bg-white border border-gray-200 shadow-lg p-20 text-center">
            <div className="text-8xl mb-6 opacity-10">Calendar</div>
            <p className="text-xl text-gray-500 font-light">No appointments scheduled</p>
          </div>
        ) : (
          appointments.map((appt) => {
            const clientName = appt.clientId?.fullName || 
                              appt.clientId?.name || 
                              appt.client?.fullName || 
                              'Guest';

            return (
              <div
                key={appt._id}
                className="group bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                <div className="p-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  {/* Left */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <User className="w-6 h-6 text-gray-400" />
                      <h3 className="text-2xl font-light text-gray-900 tracking-wide">
                        {clientName}
                      </h3>
                    </div>
                    
                    <div className="flex flex-wrap gap-8 text-gray-600 font-light">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-gold-600" />
                        {formatDate(appt.date)}
                      </div>
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gold-600" />
                        {appt.time}
                      </div>
                    </div>

                    {appt.serviceId?.name && (
                      <p className="mt-4 text-gray-700 font-medium">
                        {appt.serviceId.name}
                      </p>
                    )}
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <span className={`inline-block px-6 py-3 text-sm font-medium tracking-wider uppercase ${
                        appt.status === 'confirmed'
                          ? 'bg-black text-white'
                          : appt.status === 'pending'
                          ? 'bg-amber-100 text-amber-900'
                          : appt.status === 'cancelled'
                          ? 'bg-gray-200 text-gray-600'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}>
                        {appt.status || 'Pending'}
                      </span>
                    </div>

                    <Link
                      to={`/admin/appointments/${appt._id}`}
                      className="flex items-center gap-3 text-gray-700 hover:text-black transition group"
                    >
                      <span className="font-medium tracking-wide">View Details</span>
                      <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                    </Link>
                  </div>
                </div>

                {/* Gold accent line */}
                <div className="h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent opacity-30" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}