// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Sparkles } from 'lucide-react';
import { motion } from "framer-motion";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user?.isAdmin || user?.role === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/my-appointments', { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-amber-50/30 relative overflow-hidden">
      {/* Floating Gold Orbs */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-32 right-32 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Compact Login Card */}
      <div className="relative w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-200 shadow-2xl p-12"
        >
          {/* Brand */}
          <div className="text-center mb-10">
            <h1 className="text-6xl font-light tracking-widest text-gray-900">NAILEA</h1>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-5" />
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-center text-sm font-light">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full pl-16 pr-6 py-5 border border-gray-300 text-lg font-light focus:border-amber-600 transition"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-16 pr-6 py-5 border border-gray-300 text-lg font-light focus:border-amber-600 transition"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-black text-white font-medium tracking-widest uppercase hover:bg-gray-900 transition-all disabled:opacity-60 flex items-center justify-center gap-4 text-xl shadow-xl group"
            >
              <Sparkles className="w-6 h-6 group-hover:scale-110 transition" />
              {loading ? 'Entering...' : 'Enter Dashboard'}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center mt-8 text-gray-600 font-light">
            New here?{' '}
            <Link
              to="/register"
              className="text-amber-600 hover:text-amber-700 font-medium tracking-wide underline underline-offset-4 transition"
            >
              Create Account
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}