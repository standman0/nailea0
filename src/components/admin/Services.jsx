import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { Clock, DollarSign, Sparkles, Edit3, Plus, X, Tag, Ruler } from 'lucide-react';

// Categories helps filtering (you can customize these)
const CATEGORIES = ["Manicure", "Pedicure", "Nail Art", "Extensions", "Removal", "Add-on"];

export default function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Manicure',
    price: '',
    duration: '',
    description: '',
    isActive: true,
    hasLength: false // <--- NEW: Toggle for Length Options
  });

  const [editingId, setEditingId] = useState(null);

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
      })
      .finally(() => setLoading(false));
  };

  const handleOpenModal = (service = null) => {
    if (service) {
      setEditingId(service._id);
      setFormData({
        name: service.name,
        category: service.category || 'Manicure',
        price: service.price,
        duration: service.duration,
        description: service.description || '',
        isActive: service.isActive !== undefined ? service.isActive : true,
        hasLength: service.hasLength || false // <--- Load existing setting
      });
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        category: 'Manicure',
        price: '',
        duration: '',
        description: '',
        isActive: true,
        hasLength: false // <--- Default to false
      });
    }
    setIsModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.duration) return;

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        description: formData.description.trim(),
        isActive: formData.isActive,
        hasLength: formData.hasLength // <--- Send to Backend
      };

      if (editingId) {
        const res = await api.put(`/services/${editingId}`, payload);
        setServices(prev => prev.map(s => s._id === editingId ? res.data : s));
      } else {
        const res = await api.post('/services', payload);
        setServices(prev => [...prev, res.data]);
      }

      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save service:", err);
      alert("Failed to save service. Please try again.");
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-light tracking-wider text-gray-900">
            Service Menu
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-6" />
          <p className="text-lg text-gray-600 mt-4 font-light">
            Manage your treatments and pricing
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-black text-white rounded-none hover:bg-gray-900 transition-all group shadow-lg"
        >
          <Plus className="w-5 h-5 group-hover:scale-110 transition" />
          <span className="font-medium tracking-wide">Add New Service</span>
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.length === 0 ? (
          <div className="col-span-full bg-white border border-gray-200 shadow-lg p-24 text-center rounded-lg">
            <Sparkles className="w-24 h-24 mx-auto mb-6 text-gray-200" />
            <p className="text-xl text-gray-500 font-light">No services found.</p>
            <button onClick={() => handleOpenModal()} className="mt-8 text-amber-600 hover:text-amber-700 font-medium">
              + Create your first service
            </button>
          </div>
        ) : (
          services.map((service) => (
            <div
              key={service._id}
              onClick={() => handleOpenModal(service)}
              className={`group relative bg-white border shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden rounded-lg cursor-pointer ${!service.isActive ? 'opacity-60 grayscale' : 'border-gray-200'}`}
            >
              {/* Active Strip */}
              <div className={`absolute top-0 left-0 right-0 h-1 ${service.isActive ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200' : 'bg-gray-300'}`} />

              <div className="p-8">
                {/* Badges Row */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-medium tracking-wide uppercase border border-amber-100">
                      <Tag className="w-3 h-3" />
                      {service.category}
                    </span>
                    
                    {/* VISUAL INDICATOR FOR LENGTH */}
                    {service.hasLength && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-medium tracking-wide uppercase border border-blue-100">
                        <Ruler className="w-3 h-3" />
                        Length Options
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-2xl font-light text-center text-gray-900 tracking-wide mb-6 group-hover:text-amber-700 transition-colors">
                  {service.name}
                </h3>

                <div className="grid grid-cols-2 gap-4 border-t border-b border-gray-100 py-6 mb-6">
                  <div className="flex flex-col items-center justify-center border-r border-gray-100">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Duration</span>
                    </div>
                    <span className="text-lg font-medium text-gray-900">{service.duration} m</span>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-2 text-gray-400 mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-xs uppercase tracking-wider">Price</span>
                    </div>
                    <span className="text-lg font-medium text-gray-900">${service.price}</span>
                  </div>
                </div>

                {service.description && (
                  <p className="text-gray-500 font-light text-sm leading-relaxed text-center line-clamp-2">
                    {service.description}
                  </p>
                )}
                
                <div className="mt-8 flex items-center justify-center gap-2 text-amber-600 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                  <Edit3 className="w-4 h-4" />
                  <span className="text-sm font-medium">Edit Details</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity" onClick={() => setIsModalOpen(false)} />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="bg-white w-full max-w-lg shadow-2xl border border-gray-100 overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-light tracking-wide text-gray-900">
                  {editingId ? 'Edit Service' : 'Add New Service'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 transition p-2 rounded-full hover:bg-gray-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                
                {/* --- TOGGLE SWITCHES ROW --- */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-100">
                    
                    {/* Is Active Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-amber-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">Available</span>
                    </label>

                    {/* Has Length Toggle */}
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="relative">
                        <input type="checkbox" name="hasLength" checked={formData.hasLength} onChange={handleChange} className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">Length Options?</span>
                        <span className="text-[10px] text-gray-400">Ask Short/Med/Long</span>
                      </div>
                    </label>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Service Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-0 transition outline-none"
                    placeholder="e.g. Gel Manicure"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-0 transition outline-none appearance-none"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price & Duration */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-0 transition outline-none"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Duration (Min)</label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      required
                      min="5"
                      step="5"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-0 transition outline-none"
                      placeholder="60"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-600 focus:ring-0 transition outline-none resize-none"
                    placeholder="Describe the service..."
                  />
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 bg-black text-white py-4 font-medium tracking-wide hover:bg-gray-900 transition disabled:opacity-70"
                  >
                    {saving ? 'Saving...' : (editingId ? 'Update Service' : 'Add Service')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
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