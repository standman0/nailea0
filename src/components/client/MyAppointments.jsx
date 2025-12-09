// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Clock } from 'lucide-react';

export default function Home() {
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

  useEffect(() => {
    api.get('/services')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : res.data?.services || [];
        setServices(list);
        if (list.length > 0) setServiceId(list[0]._id);
      })
      .catch(() => setServices([]));
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!serviceId || !date || !time) return setError('Please complete all fields');

    setLoading(true);
    setError(null);

    try {
      const payload = { fullName: user?.name || 'Guest', email: user?.email, phone: phone || undefined };
      let clientId;

      try {
        const cr = await api.post('/clients', payload);
        clientId = cr.data._id || cr.data.client?._id;
      } catch (err) {
        if (err.response?.status === 409) {
          const sr = await api.get(`/clients/email/${encodeURIComponent(user.email)}`);
          clientId = sr.data._id;
        } else throw err;
      }

      await api.post('/appointments', { clientId, serviceId, date, time });
      navigate('/my-appointments');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Gold Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 rounded-full bg-amber-400/5 blur-3xl"
            animate={{
              x: [0, 100, -100, 0],
              y: [0, -80, 80, 0],
            }}
            transition={{
              duration: 30 + i * 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              top: `${20 + i * 15}%`,
              left: `${10 + i * 18}%`,
            }}
          />
        ))}
      </div>

      {/* HERO + BOOKING */}
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Poetry */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center lg:text-left"
          >
            <h1 className="text-7xl md:text-8xl font-light tracking-tight text-gray-900 leading-none">
              Artistry<br />
              <span className="text-amber-700">in Every Detail</span>
            </h1>
            <div className="w-40 h-px bg-amber-600 mx-auto lg:mx-0 mt-10 mb-8" />
            <p className="text-2xl text-gray-600 font-light tracking-wide max-w-lg mx-auto lg:mx-0">
              Where precision meets passion. Your signature look begins here.
            </p>
          </motion.div>

          {/* Right: Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="bg-white border border-gray-200 shadow-2xl p-10 lg:p-14"
          >
            <h2 className="text-4xl font-light text-center mb-10 tracking-wider">
              Reserve Your Moment
            </h2>

            {error && (
              <p className="text-red-600 text-center mb-6 font-medium text-sm">{error}</p>
            )}

            <form onSubmit={handleBooking} className="space-y-8">
              <div>
                <label className="block text-sm uppercase tracking-widest text-gray-600 mb-3">
                  Treatment
                </label>
                <select
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  className="w-full px-6 py-5 border border-gray-300 text-lg font-light focus:border-amber-600 transition"
                  required
                >
                  <option value="">Choose your experience</option>
                  {services.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} — {s.duration} min{s.price ? ` • $${s.price}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-600 mb-3">
                    <Calendar className="w-4 h-4" /> Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={today}
                    required
                    className="w-full px-6 py-5 border border-gray-300 text-lg font-light focus:border-amber-600 transition"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-600 mb-3">
                    <Clock className="w-4 h-4" /> Time
                  </label>
                  <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    className="w-full px-6 py-5 border border-gray-300 text-lg font-light focus:border-amber-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-black text-white font-medium tracking-widest uppercase hover:bg-gray-900 transition-all disabled:opacity-60 flex items-center justify-center gap-4 text-xl shadow-xl group"
              >
                <Sparkles className="w-6 h-6 group-hover:scale-110 transition" />
                {loading ? 'Reserving...' : 'Reserve Now'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-t from-gray-50 to-white">
        <div className="text-center">
          <h3 className="text-5xl font-light tracking-wider mb-10">
            Your Signature Look Awaits
          </h3>
          <button
            onClick={() => document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-20 py-7 bg-black text-white text-2xl font-medium tracking-widest uppercase hover:bg-gray-900 transition shadow-2xl"
          >
            Begin Your Journey
          </button>
        </div>
      </section>
    </>
  );
}