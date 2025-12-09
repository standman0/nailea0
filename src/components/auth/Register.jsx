// src/pages/Register.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, User, Mail, Lock, Sparkles } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const user = await register(`${first.trim()} ${last.trim()}`, email.trim(), password);
      if (user?.isAdmin || user?.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/book", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-stone-50 via-white to-amber-50/30 relative overflow-hidden">
      {/* Subtle sparkles */}
      <Sparkles className="absolute top-10 left-10 w-32 h-32 text-amber-400/10" />
      <Sparkles className="absolute bottom-20 right-20 w-40 h-40 text-amber-500/10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-gray-200 shadow-2xl p-12"
      >
        {/* Compact Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-light tracking-widest text-gray-900">NAILEA</h1>
          <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-4" />
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 text-center text-sm font-light">
            {error}
          </div>
        )}

        {/* Compact Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="First"
                value={first}
                onChange={(e) => setFirst(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 text-lg font-light focus:border-amber-600 transition"
                required
              />
            </div>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Last"
                value={last}
                onChange={(e) => setLast(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-gray-300 text-lg font-light focus:border-amber-600 transition"
                required
              />
            </div>
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 text-lg font-light focus:border-amber-600 transition"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 border border-gray-300 text-lg font-light focus:border-amber-600 transition"
              required
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-black text-white font-medium tracking-widest uppercase hover:bg-gray-900 transition-all disabled:opacity-60 flex items-center justify-center gap-3 shadow-xl group"
          >
            <Sparkles className="w-6 h-6 group-hover:scale-110 transition" />
            {loading ? "Creating..." : "Create Account"}
          </motion.button>
        </form>

        {/* Login Link */}
        <p className="text-center mt-8 text-gray-600 font-light">
          Already a member?{" "}
          <Link
            to="/register"
            className="text-amber-600 hover:text-amber-700 font-medium tracking-wide underline underline-offset-4 transition"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
}