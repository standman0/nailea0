// src/components/admin/Services.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { Clock, DollarSign, Sparkles, Edit3 } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : res.data?.services || [];
        setServices(data);
      })
      .catch(err => {
        console.error("Failed to load services:", err);
        setServices([]);
      })
      .finally(() => setLoading(false));
  }, []);

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
          Services
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent mt-6" />
        <p className="text-lg text-gray-600 mt-4 font-light">
          {services.length} exclusive treatments in your collection
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 shadow-lg p-24 text-center">
            <Sparkles className="w-24 h-24 mx-auto mb-6 text-gray-200" />
            <p className="text-xl text-gray-500 font-light">No services have been added yet</p>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service._id}
              className="group relative bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
            >
              {/* Gold top accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold-600 via-gold-500 to-transparent" />

              {/* Optional image placeholder */}
              <div className="h-56 bg-gradient-to-br from-gold-50 via-stone-50 to-white flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-gold-600/30 group-hover:text-gold-600/50 transition" />
              </div>

              <div className="p-10">
                <h3 className="text-2xl font-light text-center text-gray-900 tracking-wide mb-8">
                  {service.name}
                </h3>

                <div className="space-y-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Clock className="w-6 h-6 text-gold-600" />
                    <span className="text-lg font-light text-gray-700">{service.duration} minutes</span>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <DollarSign className="w-7 h-7 text-gold-600" />
                    <span className="text-3xl font-light text-gray-900">{service.price}</span>
                  </div>

                  {service.description && (
                    <p className="mt-8 text-gray-600 font-light leading-relaxed text-sm">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Edit button (optional future feature) */}
                <div className="mt-10 text-center opacity-0 group-hover:opacity-100 transition">
                  <button className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition">
                    <Edit3 className="w-5 h-5" />
                    <span className="text-sm font-medium tracking-wide">Edit Service</span>
                  </button>
                </div>
              </div>

              {/* Bottom gold line */}
              <div className="h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent opacity-30" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}