// src/components/admin/Settings.jsx
import React, { useState, useEffect } from 'react';
import api from '../../api/apiClient';
import { 
  Palette, 
  Clock, 
  Bell, 
  Shield, 
  Globe, 
  Save, 
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    salonName: 'Luxe Nails',
    timezone: 'America/New_York',
    workingHours: {
      monday: { open: '09:00', close: '19:00', closed: false },
      tuesday: { open: '09:00', close: '19:00', closed: false },
      wednesday: { open: '09:00', close: '19:00', closed: false },
      thursday: { open: '09:00', close: '20:00', closed: false },
      friday: { open: '09:00', close: '20:00', closed: false },
      saturday: { open: '10:00', close: '18:00', closed: false },
      sunday: { open: '', close: '', closed: true },
    },
    reminderEmail: true,
    reminderSMS: true,
    bookingConfirmationEmail: true,
    bookingConfirmationSMS: false,
    requirePhone: false,
    currency: 'USD',
    language: 'en',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        if (res.data) setSettings(prev => ({ ...prev, ...res.data }));
      })
      .catch(() => {
        // Keep defaults
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.put('/settings', settings);
      setMessage({ type: 'success', text: 'Settings saved successfully' });
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to save settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateWorkingDay = (day, field, value) => {
    setSettings(prev => ({
      ...prev,
      workingHours: {
        ...prev.workingHours,
        [day]: { ...prev.workingHours[day], [field]: value }
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-16 h-16 border-4 border-gold-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center sm:text-left">
        <h1 className="text-5xl font-light tracking-wider text-gray-900">
          Settings
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent mt-6 mx-auto sm:mx-0" />
        <p className="text-lg text-gray-600 mt-4 font-light">
          Configure your luxury experience
        </p>
      </div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - General */}
        <div className="lg:col-span-2 space-y-8">
          {/* Salon Info */}
          <div className="bg-white border border-gray-200 shadow-lg p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-gold-50 to-stone-50 rounded-full">
                <Globe className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-2xl font-light text-gray-900">Salon Information</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-700 mb-3">Salon Name</label>
                <input
                  type="text"
                  value={settings.salonName}
                  onChange={e => setSettings(prev => ({ ...prev, salonName: e.target.value }))}
                  className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition"
                />
              </div>
              <div>
                <label className="block text-sm uppercase tracking-wider text-gray-700 mb-3">Timezone</label>
                <select
                  value={settings.timezone}
                  onChange={e => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                  className="w-full px-6 py-4 border border-gray-300 text-lg focus:border-gold-600 transition"
                >
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Europe/Paris">Paris</option>
                </select>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white border border-gray-200 shadow-lg p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-gold-50 to-stone-50 rounded-full">
                <Clock className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-2xl font-light text-gray-900">Working Hours</h3>
            </div>
            <div className="space-y-4">
              {Object.entries(settings.workingHours).map(([day, hours]) => (
                <div key={day} className="flex items-center gap-6">
                  <div className="w-32 text-right capitalize font-medium text-gray-700">
                    {day === 'sunday' ? 'Sunday' : day.slice(0, 3)}
                  </div>
                  {hours.closed ? (
                    <div className="flex-1 text-center text-gray-500 font-light">Closed</div>
                  ) : (
                    <div className="flex items-center gap-4 flex-1">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={e => updateWorkingDay(day, 'open', e.target.value)}
                        className="px-4 py-3 border border-gray-300 focus:border-gold-600 transition"
                      />
                      <span className="text-gray-500">—</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={e => updateWorkingDay(day, 'close', e.target.value)}
                        className="px-4 py-3 border border-gray-300 focus:border-gold-600 transition"
                      />
                    </div>
                  )}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={e => updateWorkingDay(day, 'closed', e.target.checked)}
                      className="w-5 h-5 text-gold-600 rounded focus:ring-gold-500"
                    />
                    <span className="text-sm text-gray-600">Closed</span>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Notifications & Preferences */}
        <div className="space-y-8">
          {/* Notifications */}
          <div className="bg-white border border-gray-200 shadow-lg p-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-gradient-to-br from-gold-50 to-stone-50 rounded-full">
                <Bell className="w-8 h-8 text-gold-600" />
              </div>
              <h3 className="text-2xl font-light text-gray-900">Notifications</h3>
            </div>
            <div className="space-y-6">
              {[
                { label: 'Reminder Email', key: 'reminderEmail' },
                { label: 'Reminder SMS', key: 'reminderSMS' },
                { label: 'Booking Confirmation Email', key: 'bookingConfirmationEmail' },
                { label: 'Booking Confirmation SMS', key: 'bookingConfirmationSMS' },
                { label: 'Require Phone Number', key: 'requirePhone' },
              ].map(item => (
                <label key={item.key} className="flex items-center justify-between cursor-pointer">
                  <span className="text-gray-700 font-light">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={settings[item.key]}
                    onChange={e => setSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    className="w-6 h-6 text-gold-600 rounded focus:ring-gold-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-6 bg-black text-white font-medium tracking-wider uppercase hover:bg-gray-900 transition disabled:opacity-60 flex items-center justify-center gap-4 text-xl shadow-2xl"
          >
            <Save className="w-6 h-6" />
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>

          {/* Message */}
          {message && (
            <div className={`p-6 text-center border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'} shadow-lg`}>
              <div className="flex items-center justify-center gap-3">
                {message.type === 'success' ? <CheckCircle className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                <p className="font-medium">{message.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="mt-20 h-px bg-gradient-to-r from-transparent via-gold-600 to-transparent opacity-30" />
    </div>
  );
}