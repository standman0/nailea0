// src/pages/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Lock, Mail } from 'lucide-react';

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
      {/* Subtle Gold Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/20 via-transparent to-amber-600/20" />
      </div>

      {/* Floating Sparkles */}
      <Sparkles className="absolute -top-10 -left-10 w-32 h-32 text-amber-400/20" />
      <Sparkles className="absolute -bottom-16 -right-16 w-40 h-40 text-amber-500/10" />

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="bg-white border border-gray-200 shadow-2xl p-16">
          {/* Brand */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-light tracking-widest text-gray-900">
              NAILEA
            </h1>
            <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-6" />
            <p className="text-sm uppercase tracking-widest text-gray-500 mt-6 font-medium">
              Admin Portal
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-8 p-5 bg-red-50 border border-red-200 text-red-800 text-center font-light tracking-wide">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-10">
            <div>
              <label className="block text-sm uppercase tracking-widest text-gray-600 mb-4 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 border border-gray-300 text-lg font-light focus:border-amber-600 focus:outline-none transition"
                  placeholder="admin@naileastudios.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm uppercase tracking-widest text-gray-600 mb-4 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 border border-gray-300 text-lg font-light focus:border-amber-600 focus:outline-none transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-black text-white font-medium tracking-widest uppercase hover:bg-gray-900 transition-all disabled:opacity-60 flex items-center justify-center gap-4 text-xl shadow-xl group"
            >
              <Sparkles className="w-7 h-7 group-hover:scale-110 transition" />
              {loading ? 'Signing In...' : 'Enter Dashboard'}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 font-light">
              Don’t have an account?{' '}
              <Link
                to="/register"
                className="text-amber-600 hover:text-amber-700 font-medium tracking-wide transition underline underline-offset-4"
              >
                Create one
              </Link>
            </p>
          </div>

          
          
        </div>
      </div>
    </div>
  );
}