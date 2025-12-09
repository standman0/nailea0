// src/components/admin/Clients.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { Mail, Phone, Calendar, User, Sparkles } from 'lucide-react';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clients')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data?.clients || [];
        // Sort by most recent first
        const sorted = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setClients(sorted);
      })
      .catch(err => {
        console.error("Failed to load clients:", err);
        setClients([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatJoinDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
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
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-light tracking-wider text-gray-900">
          Clients
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-6 mx-auto" />
        <p className="text-lg text-gray-600 mt-4 font-light">
          {clients.length} {clients.length === 1 ? 'valued guest' : 'valued guests'} in your collection
        </p>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {clients.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 shadow-2xl p-28 text-center">
            <div className="mx-auto w-36 h-36 mb-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-full flex items-center justify-center">
              <User className="w-20 h-20 text-amber-600/30" />
            </div>
            <Sparkles className="w-24 h-24 mx-auto mb-6 text-amber-600/20" />
            <h3 className="text-2xl font-light text-gray-600 mb-3">
              No clients yet
            </h3>
            <p className="text-gray-500 font-light max-w-md mx-auto">
              Your first guest will appear here with elegance and grace.
            </p>
          </div>
        ) : (
          clients.map((client) => {
            const name = client.fullName || client.name || 'Guest';
            const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

            return (
              <div
                key={client._id}
                className="group relative bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden hover:border-amber-200"
              >
                {/* Gold Top Accent */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent opacity-70 group-hover:opacity-100 transition" />

                <div className="p-10 text-center">
                  {/* Avatar with Gradient */}
                  <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-2xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-500">
                    {initials}
                  </div>

                  {/* Name */}
                  <h3 className="text-2xl font-light text-gray-900 tracking-wide mb-6">
                    {name}
                  </h3>

                  {/* Contact Info */}
                  <div className="space-y-5 text-gray-600 font-light text-sm">
                    {client.email && (
                      <div className="flex items-center justify-center gap-3">
                        <Mail className="w-5 h-5 text-amber-600" />
                        <span className="truncate max-w-48">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center justify-center gap-3">
                        <Phone className="w-5 h-5 text-amber-600" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-center gap-3 pt-5 border-t border-gray-100">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <span>Joined {formatJoinDate(client.createdAt)}</span>
                    </div>
                  </div>

                  {/* Total Appointments Badge (Optional Future Enhancement) */}
                  {client.appointmentCount > 0 && (
                    <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 text-xs font-medium rounded-full">
                      <Sparkles className="w-4 h-4" />
                      {client.appointmentCount} {client.appointmentCount === 1 ? 'visit' : 'visits'}
                    </div>
                  )}
                </div>

                {/* Bottom Gold Line */}
                <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-30 group-hover:opacity-50 transition" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}