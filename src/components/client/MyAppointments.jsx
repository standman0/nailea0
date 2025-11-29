// src/pages/Home.jsx  ← Your new luxury front page (fixed!)
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Booking form
  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Gallery
  const [recentWorks, setRecentWorks] = useState([]); // Always an array
  const [galleryLoading, setGalleryLoading] = useState(true);

  const today = new Date().toISOString().split('T')[0];

  // Fetch services
  useEffect(() => {
    api.get('/services')
      .then(res => {
        let list = [];
        if (Array.isArray(res.data)) list = res.data;
        else if (res.data?.services && Array.isArray(res.data.services)) list = res.data.services;
        else if (res.data?.data && Array.isArray(res.data.data)) list = res.data.data;

        setServices(list);
        if (list.length > 0) setServiceId(list[0]._id);
      })
      .catch(() => setServices([]));
  }, []);

  // Fetch recent completed appointments for gallery
  useEffect(() => {
    setGalleryLoading(true);
    api.get('/appointments/recent-completed')
      .then(res => {
        let works = [];

        // Bulletproof array extraction
        if (Array.isArray(res.data)) {
          works = res.data;
        } else if (res.data?.works && Array.isArray(res.data.works)) {
          works = res.data.works;
        } else if (res.data?.appointments && Array.isArray(res.data.appointments)) {
          works = res.data.appointments;
        } else if (res.data?.data && Array.isArray(res.data.data)) {
          works = res.data.data;
        } else if (typeof res.data === 'object' && res.data !== null) {
          works = Object.values(res.data).filter(w => w && w._id);
        }

        // Limit to 8 latest
        setRecentWorks(works.slice(0, 8));
      })
      .catch(err => {
        console.error('Gallery fetch failed:', err);
        setRecentWorks([]);
      })
      .finally(() => setGalleryLoading(false));
  }, []);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError(null);
    if (!serviceId || !date || !time) {
      setError('Please select treatment, date, and time');
      return;
    }

    setLoading(true);
    try {
      const clientPayload = {
        fullName: user?.name || 'Valued Guest',
        email: user?.email,
        phone: phone || undefined,
      };

      let clientId;
      try {
        const cr = await api.post('/clients', clientPayload);
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
      setError(err.response?.data?.message || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 bg-gold-400/10 rounded-full blur-3xl"
            animate={{
              x: [0, 120, -80, 0],
              y: [0, -120, 80, 0],
            }}
            transition={{
              duration: 25 + i * 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ top: `${15 + i * 14}%`, left: `${8 + i * 16}%` }}
          />
        ))}
      </div>

      {/* HERO + BOOKING */}
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-ivory-50 via-stone-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-6xl md:text-8xl font-light tracking-tight text-gray-900 leading-tight">
              Timeless Beauty,<br />
              <span className="text-gold-700">Redefined</span>
            </h1>
            <div className="w-32 h-px bg-gold-600 mt-8 mb-6" />
            <p className="text-xl text-gray-600 font-light tracking-wide max-w-lg">
              Where artistry meets precision. Every nail tells a story of elegance.
            </p>
            <div className="mt-12">
              <a href="#book" className="inline-block px-12 py-5 bg-black text-white font-medium tracking-wider hover:bg-gray-900 transition uppercase">
                Reserve Your Moment
              </a>
            </div>
          </motion.div>

          {/* Right - Booking Form */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            id="book"
            className="bg-white border border-gray-200 shadow-2xl p-10 lg:p-12"
          >
            <h2 className="text-3xl font-light tracking-wider text-center mb-10">Book Your Appointment</h2>
            {error && <p className="text-red-600 text-center mb-6 font-medium">{error}</p>}

            <form onSubmit={handleBooking} className="space-y-8">
              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-700 mb-3">Treatment</label>
                <select
                  value={serviceId}
                  onChange={e => setServiceId(e.target.value)}
                  className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition"
                  required
                >
                  <option value="">Select treatment</option>
                  {services.map(s => (
                    <option key={s._id} value={s._id}>
                      {s.name} — {s.duration} min {s.price && `• $${s.price}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm uppercase tracking-wider text-gray-700 mb-3">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} min={today} required
                    className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition" />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-wider text-gray-700 mb-3">Time</label>
                  <input type="time" value={time} onChange={e => setTime(e.target.value)} required
                    className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition" />
                </div>
              </div>

              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-700 mb-3">Phone (optional)</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="For reminders"
                  className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition placeholder-gray-400" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-black text-white font-medium tracking-wider uppercase hover:bg-gray-900 transition disabled:opacity-60"
              >
                {loading ? 'Confirming...' : 'Secure Appointment'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* RECENT TRANSFORMATIONS */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light tracking-wider">Recent Transformations</h2>
            <div className="w-32 h-px bg-gold-600 mx-auto mt-6" />
          </div>

          {galleryLoading ? (
            <p className="text-center text-gray-500 font-light">Curating our latest artistry...</p>
          ) : recentWorks.length === 0 ? (
            <p className="text-center text-gray-500 font-light">No recent works to display yet</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {recentWorks.map((work, i) => (
                <motion.div
                  key={work._id || i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="group relative overflow-hidden aspect-square bg-gray-50 border border-gray-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition" />
                  <div className="absolute bottom-4 left-4 text-white opacity-0 group-hover:opacity-100 transition z-10">
                    <p className="font-medium">{work.serviceName || work.service?.name || 'Nail Art'}</p>
                    <p className="text-sm">{new Date(work.date).toLocaleDateString()}</p>
                  </div>
                  <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-sm">
                    Nail Art
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center">
          <h3 className="text-4xl font-light tracking-wider mb-8">
            Your Signature Look Awaits
          </h3>
          <a href="#book" className="inline-block px-16 py-6 bg-black text-white text-lg font-medium tracking-wider hover:bg-gray-900 transition uppercase">
            Begin Your Journey
          </a>
        </div>
      </section>
    </>
  );
}