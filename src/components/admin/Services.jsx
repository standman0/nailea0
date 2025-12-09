// src/components/admin/Services.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { Clock, DollarSign, Sparkles, Edit3, Plus, X } from 'lucide-react';

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    description: ''
  });
  const [saving, setSaving] = useState(false);

  // Load services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
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
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Submit new service
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) return;

    setSaving(true);
    try {
      const response = await api.post('/services', {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description.trim()
      });

      setServices(prev => [...prev, response.data]);
      setIsModalOpen(false);
      setFormData({ name: '', price: '', duration: '', description: '' });
    } catch (err) {
      console.error("Failed to create service:", err);
      alert("Failed to add service. Please try again.");
    } finally {
      setSaving(false);
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
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-5xl font-light tracking-wider text-gray-900">
            Services
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-6" />
          <p className="text-lg text-gray-600 mt-4 font-light">
            {services.length} exclusive treatments in your collection
          </p>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-3 px-8 py-4 bg-black text-white rounded-none hover:bg-gray-900 transition-all group"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="font-medium tracking-wide">Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {services.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 shadow-lg p-24 text-center rounded-lg">
            <Sparkles className="w-24 h-24 mx-auto mb-6 text-gray-200" />
            <p className="text-xl text-gray-500 font-light">No services have been added yet</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-8 text-amber-600 hover:text-amber-700 font-medium"
            >
              + Add your first service
            </button>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service._id}
              className="group relative bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden rounded-lg"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent" />

              <div className="h-56 bg-gradient-to-br from-amber-50 via-stone-50 to-white flex items-center justify-center">
                <Sparkles className="w-20 h-20 text-amber-600/30 group-hover:text-amber-600/50 transition" />
              </div>

              <div className="p-10">
                <h3 className="text-2xl font-light text-center text-gray-900 tracking-wide mb-8">
                  {service.name}
                </h3>

                <div className="space-y-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <Clock className="w-6 h-6 text-amber-600" />
                    <span className="text-lg font-light text-gray-700">{service.duration} minutes</span>
                  </div>

                  <div className="flex items-center justify-center gap-3">
                    <DollarSign className="w-7 h-7 text-amber-600" />
                    <span className="text-3xl font-light text-gray-900">${service.price}</span>
                  </div>

                  {service.description && (
                    <p className="mt-8 text-gray-600 font-light leading-relaxed text-sm">
                      {service.description}
                    </p>
                  )}
                </div>

                <div className="mt-10 text-center opacity-0 group-hover:opacity-100 transition">
                  <button className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition">
                    <Edit3 className="w-5 h-5" />
                    <span className="text-sm font-medium tracking-wide">Edit Service</span>
                  </button>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-30" />
            </div>
          ))
        )}
      </div>

      {/* Add Service Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 z-50" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white w-full max-w-lg shadow-2xl border border-gray-200 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-8 border-b border-gray-100">
                <h2 className="text-2xl font-light tracking-wide text-gray-900">Add New Service</h2>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-900 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 focus:border-amber-600 focus:ring-0 transition"
                    placeholder="e.g. Signature Blowout"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="5"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-amber-600 focus:ring-0 transition"
                      placeholder="150"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      min="15"
                      step="15"
                      className="w-full px-4 py-3 border border-gray-300 focus:border-amber-600 focus:ring-0 transition"
                      placeholder="60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 focus:border-amber-600 focus:ring-0 transition resize-none"
                    placeholder="A luxurious experience featuring..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-black text-white py-4 font-medium tracking-wide hover:bg-gray-900 transition disabled:opacity-70"
                  >
                    {saving ? 'Adding Service...' : 'Add Service'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}