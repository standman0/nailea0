// src/pages/Home.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Menu, 
  X, 
  Instagram, 
  Star, 
  MapPin, 
  Phone 
} from 'lucide-react';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState(['ALL']);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [serviceId, setServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    api.get('/services')
      .then(res => {
        const list = Array.isArray(res.data) ? res.data : res.data?.services || [];
        setServices(list);
        setFilteredServices(list);

        // Extract unique categories
        const cats = ['ALL', ...new Set(list.map(s => s.category || 'Uncategorized').filter(Boolean))];
        setCategories(cats);

        if (list.length > 0) setServiceId(list[0]._id);
      })
      .catch(() => {
        setServices([]);
        setFilteredServices([]);
      });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (activeCategory === 'ALL') {
      setFilteredServices(services);
    } else {
      setFilteredServices(services.filter(s => (s.category || 'Uncategorized') === activeCategory));
    }
  }, [activeCategory, services]);

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
    <div className="min-h-screen bg-stone-50">
      {/* Floating Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-[-5%] w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-[10%] w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-serif font-bold tracking-tight text-gray-900">
            NA<span className="text-amber-600">IL</span>EA
          </h1>

          <div className="hidden lg:flex items-center gap-10 font-medium text-sm text-gray-700">
            <a href="#services" className="hover:text-amber-600 transition">Services</a>
            <a href="#about" className="hover:text-amber-600 transition">About</a>
            <button 
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-black text-white uppercase tracking-wider hover:bg-gray-900 transition text-sm"
            >
              Book Now
            </button>
          </div>

          <button className="lg:hidden text-gray-900" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-md shadow-lg py-6"
          >
            <div className="container mx-auto px-6 flex flex-col gap-6 text-center text-gray-700 font-medium">
              <a href="#services" onClick={() => setMobileMenuOpen(false)}>Services</a>
              <a href="#about" onClick={() => setMobileMenuOpen(false)}>About</a>
              <button 
                onClick={() => { document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' }); setMobileMenuOpen(false); }}
                className="px-8 py-3 bg-black text-white uppercase tracking-wider"
              >
                Book Now
              </button>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 w-2/3 h-full bg-amber-100/50 rounded-l-[100px] opacity-60"></div>
        <div className="container mx-auto">
          <div className="max-w-3xl">
            <div className="inline-block px-4 py-1 bg-amber-200 text-amber-900 rounded-full text-xs font-bold tracking-wide mb-6">
              NOW ACCEPTING NEW CLIENTS
            </div>
            <h2 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-tight mb-6">
              Elevate Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-700">
                Finger Tips.
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl">
              Experience luxury nail care in a private, sanitary, and chic environment. Specializing in precision acrylics, structure gel, and hand-painted art.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-4 bg-black text-white uppercase tracking-wider hover:bg-gray-900 transition text-lg font-medium"
              >
                View Services
              </button>
              <button className="px-10 py-4 border-2 border-gray-900 text-gray-900 uppercase tracking-wider hover:bg-gray-900 hover:text-white transition text-lg font-medium flex items-center justify-center gap-3">
                <Instagram className="w-5 h-5" /> Portfolio
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Services Section */}
      <section id="services" className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-2">The Menu</h3>
          <h2 className="text-5xl font-serif font-bold text-gray-900">Select a Service</h2>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? 'bg-gray-900 text-white shadow-lg' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:border-amber-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredServices.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 py-10">No services in this category</p>
          ) : (
            filteredServices.map(service => (
              <motion.div
                key={service._id}
                whileHover={{ y: -8 }}
                className="bg-white border border-gray-200 shadow-lg p-8 text-center hover:shadow-2xl transition-all"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-amber-50 rounded-full flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-amber-600" />
                </div>
                <h4 className="text-xl font-medium text-gray-900 mb-2">{service.name}</h4>
                <p className="text-3xl font-light text-amber-600 mb-4">${service.price}</p>
                <p className="text-sm text-gray-600 mb-6">{service.duration} minutes</p>
                <button 
                  onClick={() => { setServiceId(service._id); document.getElementById('booking-form')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-sm uppercase tracking-wider text-amber-600 hover:text-amber-700 font-medium"
                >
                  Book This →
                </button>
              </motion.div>
            ))
          )}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 to-stone-100">
                <div className="w-full h-full bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                  Salon Interior
                </div>
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white p-6 rounded-xl shadow-2xl max-w-xs border border-gray-100">
                <div className="flex gap-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-gray-600 italic">"Perfection in every detail. My nails have never looked better!"</p>
                <p className="text-gray-900 font-bold mt-2">- Sarah L.</p>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-amber-600 uppercase tracking-widest mb-3">The Studio</h3>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-6">Luxury is in the Details</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                At Nailea Studios, we believe your nails are your finest accessory. We use only premium EMA monomers, genuine crystals, and the finest Korean and Japanese gels.
              </p>
              <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="text-gray-700">Design District, New York</span>
                </li>
                <li className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                    <Phone className="w-5 h-5" />
                  </div>
                  <span className="text-gray-700">(555) 987-6543</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form (inline) */}
      <section id="booking-form" className="py-20 bg-gradient-to-b from-white to-stone-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-serif font-bold text-center mb-12">Reserve Your Appointment</h2>
          {error && <p className="text-red-600 text-center mb-6">{error}</p>}
          <form onSubmit={handleBooking} className="bg-white border border-gray-200 shadow-2xl p-12 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-600 mb-3">
                  <Calendar className="w-4 h-4" /> Date
                </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} min={today} required className="w-full px-6 py-5 border border-gray-300 focus:border-amber-600 transition text-lg" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm uppercase tracking-widest text-gray-600 mb-3">
                  <Clock className="w-4 h-4" /> Time
                </label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} required className="w-full px-6 py-5 border border-gray-300 focus:border-amber-600 transition text-lg" />
              </div>
            </div>
            <button 
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-black text-white uppercase tracking-widest hover:bg-gray-900 transition text-xl font-medium flex items-center justify-center gap-4 group"
            >
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition" />
              {loading ? 'Confirming...' : 'Secure Your Spot'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            NA<span className="text-amber-600">IL</span>EA
          </h2>
          <p className="text-gray-400 text-sm mb-6">© 2025 Nailea Studios. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-gray-400 hover:text-white transition"><Instagram className="w-6 h-6" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}