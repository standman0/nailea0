import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  // ← CHANGE THESE TO YOUR REAL ADMIN CREDENTIALS
  const [email, setEmail] = useState("admin@nailsalon.com");
  const [password, setPassword] = useState("123456"); // ← THIS MUST BE THE REAL PASSWORD!
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await login(email, password);
      
      console.log("Login component received user:", user);
      console.log("User isAdmin value:", user?.isAdmin);
      console.log("User role:", user?.role);
      
      // Redirect based on user role
      if (user?.isAdmin) {
        console.log("Redirecting to /admin/dashboard");
        navigate('/admin/dashboard', { replace: true });
      } else {
        console.log("Redirecting to /my-appointments");
        navigate('/my-appointments', { replace: true });
      }
    } catch (err) {
      console.log("Login failed:", err.response?.data);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ivory-50 via-stone-50 to-gray-100">
      <div className="w-full max-w-md bg-white rounded-none border border-gray-200 shadow-2xl p-12">
        <h1 className="text-4xl font-light tracking-wider text-gray-900 text-center mb-4">
          Sign In
        </h1>
        <p className="text-center text-gray-600 font-light tracking-wide mb-10">
          Welcome back to your luxury salon
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-center font-light">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-700 mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm uppercase tracking-wider text-gray-700 mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white font-medium tracking-wider uppercase hover:bg-gray-900 transition disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Enter Dashboard"}
          </button>
        </form>

        <p className="text-center mt-10 text-gray-500 font-light">
          Admin: admin@nailsalon.com • Password: 123456
        </p>
      </div>
    </div>
  );
}