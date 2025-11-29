// src/components/admin/Clients.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { Mail, Phone, Calendar, User } from 'lucide-react';

export default function AdminClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/clients')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data?.clients || [];
        setClients(data);
      })
      .catch(err => {
        console.error("Failed to load clients:", err);
        setClients([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
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
          Clients
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent mt-6" />
        <p className="text-lg text-gray-600 mt-4 font-light">
          {clients.length} valued guests in your collection
        </p>
      </div>

      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {clients.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 shadow-lg p-20 text-center">
            <div className="text-8xl mb-6 opacity-10">Users</div>
            <p className="text-xl text-gray-500 font-light">No clients registered yet</p>
          </div>
        ) : (
          clients.map((client) => (
            <div
              key={client._id}
              className="group bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              <div className="p-10">
                {/* Avatar Placeholder */}
                <div className="w-20 h-20 bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition">
                  <User className="w-10 h-10 text-gold-700" />
                </div>

                {/* Name */}
                <h3 className="text-2xl font-light text-center text-gray-900 tracking-wide mb-6">
                  {client.fullName || client.name || 'Guest'}
                </h3>

                {/* Contact Info */}
                <div className="space-y-4 text-gray-600 font-light">
                  {client.email && (
                    <div className="flex items-center gap-3 justify-center">
                      <Mail className="w-5 h-5 text-gold-600" />
                      <span className="text-sm">{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center gap-3 justify-center">
                      <Phone className="w-5 h-5 text-gold-600" />
                      <span className="text-sm">{client.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 justify-center pt-4 border-t border-gray-100">
                    <Calendar className="w-5 h-5 text-gold-600" />
                    <span className="text-sm">Joined {formatDate(client.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Gold accent */}
              <div className="h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent opacity-30" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}