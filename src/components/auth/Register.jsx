import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const user = await register(name, email, password);
      if (user?.role === 'admin') navigate('/admin/dashboard');
      else navigate('/book');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">Create account</h1>
        <p className="text-sm text-gray-500 mb-6">Nice to meet you — let's get started.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="text-sm text-red-600">{error}</div>}
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50" />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Choose a password" className="w-full px-3 py-2 rounded-md border border-gray-200 bg-gray-50" />

          <button type="submit" className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700">Create account</button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">Already have an account? <a href="/login" className="text-blue-600">Sign in</a></div>
      </div>
    </div>
  );
}
