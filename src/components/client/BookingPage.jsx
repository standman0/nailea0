import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  // Fetch services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/services');
        let list = [];

        if (Array.isArray(res.data)) list = res.data;
        else if (res.data?.services && Array.isArray(res.data.services)) list = res.data.services;
        else if (res.data?.data && Array.isArray(res.data.data)) list = res.data.data;

        setServices(list);
        if (list.length > 0) setServiceId(list[0]._id);
      } catch (err) {
        setError('Unable to load services at this time.');
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!serviceId || !date || !time) {
      setError('Please complete all required fields.');
      return;
    }

    setLoading(true);
    try {
      // Ensure client exists
      const clientPayload = {
        fullName: user?.name || 'Valued Guest',
        email: user?.email,
        phone: phone.trim() || undefined,
      };

      let clientId;
      try {
        const clientRes = await api.post('/clients', clientPayload);
        clientId = clientRes.data._id || clientRes.data.client?._id;
      } catch (err) {
        if (err.response?.status === 409) {
          const searchRes = await api.get(`/clients/email/${encodeURIComponent(user.email)}`);
          clientId = searchRes.data._id;
        } else throw err;
      }

      // Book appointment
      await api.post('/appointments', { clientId, serviceId, date, time });
      navigate('/my-appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory-50 via-stone-50 to-gray-100">
      {/* Subtle luxury overlay */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#f5e6d3]/30 via-transparent to-[#f5e6d3]/20" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-light tracking-wider text-gray-900">
            Reserve Your Appointment
          </h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-[#b89b6f] to-transparent mx-auto mt-6" />
          <p className="text-gray-600 mt-4 text-lg font-light tracking-wide">
            Exclusive treatments, tailored for you
          </p>
        </div>

        <div className="bg-white border border-gray-200 shadow-xl">
          <div className="p-10 md:p-16">
            {error && (
              <div className="mb-10 p-6 bg-red-50 border border-red-200 text-red-800 text-center font-light tracking-wide">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-12">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 tracking-wider uppercase mb-4">
                  Treatment
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-6 py-5 border border-gray-300 text-gray-900 font-light text-lg focus:border-[#b89b6f] focus:ring-0 transition"
                  required
                  disabled={services.length === 0}
                >
                  {services.length === 0 ? (
                    <option>Loading exclusive treatments...</option>
                  ) : (
                    <>
                      <option value="">Select your treatment</option>
                      {services.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} — {s.duration} minutes{s.price ? ` • $${s.price}` : ''}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wider uppercase mb-4">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    className="w-full px-6 py-5 border border-gray-300 text-gray-900 font-light text-lg focus:border-[#b89b6f] focus:ring-0 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 tracking-wider uppercase mb-4">
                    Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-6 py-5 border border-gray-300 text-gray-900 font-light text-lg focus:border-[#b89b6f] focus:ring-0 transition"
                    required
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 tracking-wider uppercase mb-4">
                  Telephone (optional)
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="For confirmation and reminders"
                  className="w-full px-6 py-5 border border-gray-300 text-gray-900 font-light text-lg focus:border-[#b89b6f] focus:ring-0 transition placeholder-gray-400"
                />
              </div>

              {/* Submit */}
              <div className="pt-8">
                <button
                  type="submit"
                  disabled={loading || services.length === 0}
                  className="w-full py-6 bg-black text-white font-medium tracking-wider uppercase hover:bg-gray-900 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-lg"
                >
                  {loading ? 'Confirming Reservation...' : 'Confirm Appointment'}
                </button>
              </div>
            </form>
          </div>

          {/* Bottom gold line */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#b89b6f] to-transparent opacity-40" />
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 font-light tracking-wide">
          Your privacy and comfort are our highest priority
        </div>
      </div>
    </div>
  );
}