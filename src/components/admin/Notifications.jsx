// src/components/admin/Notifications.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { 
  Mail, 
  MessageSquare, 
  Send, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  BellRing
} from 'lucide-react';

export default function Notifications() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const [emailForm, setEmailForm] = useState({ 
    to: '', 
    subject: 'Test from Nailea Studios', 
    message: 'This is a test email from your luxury salon system. Everything is working perfectly.' 
  });
  
  const [smsForm, setSmsForm] = useState({ 
    to: '', 
    message: 'Test SMS from Nailea Studios — your luxury booking system is ready.' 
  });

  useEffect(() => {
    api.get('/notifications/status')
      .then(res => setStatus(res.data))
      .catch(() => setStatus({ email: 'disconnected', sms: 'disconnected' }));
  }, []);

  const sendTestEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/notifications/test/email', emailForm);
      setMessage({ type: 'success', text: 'Test email sent successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send email' });
    } finally {
      setLoading(false);
    }
  };

  const sendTestSMS = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/notifications/test/sms', smsForm);
      setMessage({ type: 'success', text: 'Test SMS sent successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to send SMS' });
    } finally {
      setLoading(false);
    }
  };

  const sendTomorrowReminders = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/notifications/reminders/tomorrow');
      setMessage({ type: 'success', text: res.data.message || 'Tomorrow’s reminders queued successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to queue reminders' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (service) => {
    if (!status) return 'bg-gray-100 text-gray-500';
    return status[service] === 'connected' 
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200' 
      : 'bg-red-100 text-red-800 border-red-200';
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-6xl font-light tracking-widest text-gray-900">
          Notifications
        </h1>
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-8" />
        <p className="text-xl text-gray-600 mt-6 font-light tracking-wide">
          Stay connected with your valued guests
        </p>
      </div>

      {/* Service Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
        <div className="bg-white border border-gray-200 shadow-2xl p-10 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl">
            <Mail className="w-14 h-14 text-white" />
          </div>
          <h3 className="text-2xl font-light text-gray-900 mb-4">Email Service</h3>
          <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-medium border ${getStatusColor('email')}`}>
            <div className={`w-4 h-4 rounded-full ${status?.email === 'connected' ? 'bg-emerald-600' : 'bg-red-600'} animate-pulse`} />
            {status?.email === 'connected' ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <div className="bg-white border border-gray-200 shadow-2xl p-10 text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl">
            <MessageSquare className="w-14 h-14 text-white" />
          </div>
          <h3 className="text-2xl font-light text-gray-900 mb-4">SMS Service</h3>
          <div className={`inline-flex items-center gap-3 px-8 py-4 rounded-full text-lg font-medium border ${getStatusColor('sms')}`}>
            <div className={`w-4 h-4 rounded-full ${status?.sms === 'connected' ? 'bg-emerald-600' : 'bg-red-600'} animate-pulse`} />
            {status?.sms === 'connected' ? 'Connected' : 'Disconnected'}
          </div>
        </div>
      </div>

      {/* Test Communications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Test Email */}
        <div className="bg-white border border-gray-200 shadow-2xl overflow-hidden group hover:border-amber-200 transition">
          <div className="h-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent" />
          <div className="p-12">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                <Mail className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-900">Send Test Email</h2>
            </div>

            <form onSubmit={sendTestEmail} className="space-y-8">
              <input
                type="email"
                placeholder="Recipient email"
                value={emailForm.to}
                onChange={e => setEmailForm({ ...emailForm, to: e.target.value })}
                className="w-full px-6 py-5 border border-gray-300 focus:border-amber-600 transition text-lg font-light"
                required
              />
              <input
                type="text"
                placeholder="Subject"
                value={emailForm.subject}
                onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
                className="w-full px-6 py-5 border border-gray-300 focus:border-amber-600 transition text-lg font-light"
              />
              <textarea
                placeholder="Message"
                value={emailForm.message}
                onChange={e => setEmailForm({ ...emailForm, message: e.target.value })}
                rows={5}
                className="w-full px-6 py-5 border border-gray-300 focus:border-amber-600 transition resize-none text-lg font-light"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-black text-white font-medium tracking-widest uppercase hover:bg-gray-900 transition disabled:opacity-60 flex items-center justify-center gap-4 text-xl shadow-xl group"
              >
                <Send className="w-7 h-7 group-hover:translate-x-1 transition" />
                {loading ? 'Sending...' : 'Send Test Email'}
              </button>
            </form>
          </div>
        </div>

        {/* Test SMS */}
        <div className="bg-white border border-gray-200 shadow-2xl overflow-hidden group hover:border-amber-200 transition">
          <div className="h-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent" />
          <div className="p-12">
            <div className="flex items-center gap-5 mb-10">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl group-hover:scale-110 transition">
                <MessageSquare className="w-9 h-9 text-white" />
              </div>
              <h2 className="text-3xl font-light text-gray-900">Send Test SMS</h2>
            </div>

            <form onSubmit={sendTestSMS} className="space-y-8">
              <input
                type="tel"
                placeholder="+1234567890"
                value={smsForm.to}
                onChange={e => setSmsForm({ ...smsForm, to: e.target.value })}
                className="w-full px-6 py-5 border border-gray-300 focus:border-amber-600 transition text-lg font-light"
                required
              />
              <textarea
                placeholder="Your message (160 characters max)"
                value={smsForm.message}
                onChange={e => setSmsForm({ ...smsForm, message: e.target.value })}
                rows={5}
                maxLength={160}
                className="w-full px-6 py-5 border border-gray-300 focus:border-amber-600 transition resize-none text-lg font-light"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full py-6 bg-black text-white font-medium tracking-widest uppercase hover:bg-gray-900 transition disabled:opacity-60 flex items-center justify-center gap-4 text-xl shadow-xl group"
              >
                <Send className="w-7 h-7 group-hover:translate-x-1 transition" />
                {loading ? 'Sending...' : 'Send Test SMS'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Mass Reminder Action */}
      <div className="max-w-5xl mx-auto mb-20">
        <div className="relative bg-black text-white shadow-2xl overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/20 via-transparent to-amber-800/20" />
          <div className="relative p-16 text-center">
            <BellRing className="w-24 h-24 mx-auto mb-8 opacity-20" />
            <h2 className="text-5xl font-light tracking-wide mb-6">Send Tomorrow’s Reminders</h2>
            <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
              Automatically deliver personalized email & SMS reminders to every client with an appointment tomorrow.
            </p>
            <button
              onClick={sendTomorrowReminders}
              disabled={loading}
              className="px-20 py-7 bg-white text-black font-medium tracking-widest uppercase hover:bg-amber-50 transition-all disabled:opacity-60 inline-flex items-center gap-5 text-2xl shadow-2xl group-hover:scale-105 transition"
            >
              <Send className="w-8 h-8" />
              {loading ? 'Queuing Reminders...' : 'Send All Tomorrow Reminders'}
            </button>
            <Sparkles className="absolute top-10 right-10 w-20 h-20 opacity-10 group-hover:opacity-20 transition" />
          </div>
        </div>
      </div>

      {/* Feedback Message */}
      {message && (
        <div className={`max-w-2xl mx-auto p-10 text-center shadow-2xl border ${
          message.type === 'success' 
            ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-center justify-center gap-6">
            {message.type === 'success' ? (
              <CheckCircle className="w-16 h-16" />
            ) : (
              <AlertCircle className="w-16 h-16" />
            )}
            <p className="text-2xl font-medium">{message.text}</p>
          </div>
        </div>
      )}

      <div className="mt-20 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-40" />
    </div>
  );
}