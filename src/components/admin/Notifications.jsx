// src/components/admin/Notifications.jsx
import React, { useEffect, useState } from 'react';
import api from '../../api/apiClient';
import { Mail, MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function Notifications() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [emailForm, setEmailForm] = useState({ to: '', subject: 'Test Email', message: 'This is a test from your luxury salon.' });
  const [smsForm, setSmsForm] = useState({ to: '', message: 'This is a test SMS from your salon.' });

  useEffect(() => {
    api.get('/notifications/status')
      .then(res => setStatus(res.data))
      .catch(() => setStatus(null));
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

  const sendTomorrow = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.post('/notifications/reminders/tomorrow');
      setMessage({ type: 'success', text: res.data.message || 'Tomorrow’s reminders queued' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to queue reminders' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center sm:text-left">
        <h1 className="text-5xl font-light tracking-wider text-gray-900">
          Notifications
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent mt-6 mx-auto sm:mx-0" />
        <p className="text-lg text-gray-600 mt-4 font-light">
          Manage email & SMS communications
        </p>
      </div>

      {/* Status Card */}
      <div className="mb-12">
        <div className="bg-white border border-gray-200 shadow-lg p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-gold-50 to-stone-50 rounded-full">
              <Mail className="w-8 h-8 text-gold-600" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-900">Service Status</h3>
              <p className="text-gray-600">Email & SMS provider connection</p>
            </div>
          </div>
          <pre className="bg-gray-50 p-6 rounded-lg text-sm font-mono text-gray-700 overflow-x-auto">
            {status ? JSON.stringify(status, null, 2) : 'Loading status...'}
          </pre>
        </div>
      </div>

      {/* Grid of Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Email */}
        <div className="bg-white border border-gray-200 shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <Mail className="w-10 h-10 text-gold-600" />
            <h3 className="text-2xl font-light text-gray-900">Send Test Email</h3>
          </div>

          <form onSubmit={sendTestEmail} className="space-y-6">
            <input
              type="email"
              placeholder="Recipient email"
              value={emailForm.to}
              onChange={e => setEmailForm({ ...emailForm, to: e.target.value })}
              className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition"
              required
            />
            <input
              type="text"
              placeholder="Subject"
              value={emailForm.subject}
              onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })}
              className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition"
            />
            <textarea
              placeholder="Message"
              value={emailForm.message}
              onChange={e => setEmailForm({ ...emailForm, message: e.target.value })}
              rows={5}
              className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-black text-white font-medium tracking-wider uppercase hover:bg-gray-900 transition disabled:opacity-60 flex items-center justify-center gap-3"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Sending...' : 'Send Test Email'}
            </button>
          </form>
        </div>

        {/* Test SMS */}
        <div className="bg-white border border-gray-200 shadow-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <MessageSquare className="w-10 h-10 text-gold-600" />
            <h3 className="text-2xl font-light text-gray-900">Send Test SMS</h3>
          </div>

          <form onSubmit={sendTestSMS} className="space-y-6">
            <input
              type="tel"
              placeholder="Phone number (e.g. +1234567890)"
              value={smsForm.to}
              onChange={e => setSmsForm({ ...smsForm, to: e.target.value })}
              className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition"
              required
            />
            <textarea
              placeholder="Message"
              value={smsForm.message}
              onChange={e => setSmsForm({ ...smsForm, message: e.target.value })}
              rows={6}
              className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-black text-white font-medium tracking-wider uppercase hover:bg-gray-900 transition disabled:opacity-60 flex items-center justify-center gap-3"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Sending...' : 'Send Test SMS'}
            </button>
          </form>
        </div>
      </div>

      {/* Send Tomorrow Reminders */}
      <div className="mt-12 max-w-4xl mx-auto">
        <div className="bg-gradient-to-r from-black to-gray-900 text-white p-12 shadow-2xl text-center">
          <h3 className="text-3xl font-light mb-6">Send Tomorrow’s Reminders</h3>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Automatically send personalized email & SMS reminders to all clients with appointments tomorrow.
          </p>
          <button
            onClick={sendTomorrow}
            disabled={loading}
            className="px-16 py-6 bg-white text-black font-medium tracking-wider uppercase hover:bg-gray-100 transition disabled:opacity-60 inline-flex items-center gap-4 text-xl"
          >
            <Send className="w-6 h-6" />
            {loading ? 'Queuing Reminders...' : 'Send All Tomorrow Reminders'}
          </button>
        </div>
      </div>

      {/* Message Feedback */}
      {message && (
        <div className={`mt-12 p-8 text-center ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'} border ${message.type === 'success' ? 'border-emerald-200' : 'border-red-200'} shadow-lg max-w-2xl mx-auto`}>
          <div className="flex items-center justify-center gap-4">
            {message.type === 'success' ? <CheckCircle className="w-10 h-10" /> : <AlertCircle className="w-10 h-10" />}
            <p className="text-xl font-medium">{message.text}</p>
          </div>
        </div>
      )}

      {/* Bottom accent */}
      <div className="mt-20 h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent opacity-30" />
    </div>
  );
}