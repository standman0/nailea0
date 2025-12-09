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
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    salonName: 'Nailea Studios',
    timezone: 'America/New_York',
    currency: 'USD',
    language: 'en',
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
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get('/settings')
      .then(res => {
        if (res.data) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {
        // Keep beautiful defaults
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.put('/settings', settings);
      setMessage({ type: 'success', text: 'Settings saved perfectly' });
      setTimeout(() => setMessage(null), 4000);
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

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-16 text-center">
        <h1 className="text-6xl font-light tracking-widest text-gray-900">
          Settings
        </h1>
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mx-auto mt-8" />
        <p className="text-xl text-gray-600 mt-6 font-light tracking-wide">
          Craft your studio’s perfect experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-10">

          {/* Salon Identity */}
          <div className="bg-white border border-gray-200 shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent" />
            <div className="p-12">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl">
                  <Sparkles className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-3xl font-light text-gray-900">Studio Identity</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-sm uppercase tracking-widest text-gray-600 mb-3">Salon Name</label>
                  <input
                    type="text"
                    value={settings.salonName}
                    onChange={e => setSettings(prev => ({ ...prev, salonName: e.target.value }))}
                    className="w-full px-6 py-4 border border-gray-300 focus:border-amber-600 focus:outline-none transition text-lg font-light"
                    placeholder="Nailea Studios"
                  />
                </div>
                <div>
                  <label className="block text-sm uppercase tracking-widest text-gray-600 mb-3">Timezone</label>
                  <select
                    value={settings.timezone}
                    onChange={e => setSettings(prev => ({ ...prev, timezone: e.target.value }))}
                    className="w-full px-6 py-4 border border-gray-300 focus:border-amber-600 focus:outline-none transition text-lg font-light"
                  >
                    <option value="America/New_York">New York (EST)</option>
                    <option value="America/Chicago">Chicago (CST)</option>
                    <option value="America/Los_Angeles">Los Angeles (PST)</option>
                    <option value="America/Toronto">Toronto (EST)</option>
                    <option value="Europe/London">London (GMT)</option>
                    <option value="Europe/Paris">Paris (CET)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="bg-white border border-gray-200 shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent" />
            <div className="p-12">
              <div className="flex items-center gap-5 mb-10">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl">
                  <Clock className="w-9 h-9 text-white" />
                </div>
                <h2 className="text-3xl font-light text-gray-900">Working Hours</h2>
              </div>

              <div className="space-y-6">
                {days.map(day => {
                  const hours = settings.workingHours[day];
                  const dayName = day.charAt(0).toUpperCase() + day.slice(1);
                  const isSunday = day === 'sunday';

                  return (
                    <div key={day} className="flex items-center gap-6 py-4 border-b border-gray-100 last:border-0">
                      <div className="w-28 text-right font-medium text-gray-700 capitalize">
                        {isSunday ? 'Sunday' : dayName.slice(0, 3)}
                      </div>

                      {hours.closed ? (
                        <div className="flex-1 text-center text-gray-500 font-light italic">Closed</div>
                      ) : (
                        <div className="flex items-center gap-5 flex-1">
                          <input
                            type="time"
                            value={hours.open}
                            onChange={e => updateWorkingDay(day, 'open', e.target.value)}
                            className="px-5 py-3 border border-gray-300 focus:border-amber-600 transition w-40"
                          />
                          <span className="text-gray-400 text-xl">—</span>
                          <input
                            type="time"
                            value={hours.close}
                            onChange={e => updateWorkingDay(day, 'close', e.target.value)}
                            className="px-5 py-3 border border-gray-300 focus:border-amber-600 transition w-40"
                          />
                        </div>
                      )}

                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={e => updateWorkingDay(day, 'closed', e.target.checked)}
                          className="w-6 h-6 text-amber-600 rounded focus:ring-amber-500"
                        />
                        <span className="text-sm font-medium text-gray-600">Closed</span>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-10">

          {/* Notifications */}
          <div className="bg-white border border-gray-200 shadow-2xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent" />
            <div className="p-10">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-xl">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-light text-gray-900">Notifications</h3>
              </div>

              <div className="space-y-7">
                {[
                  { label: 'Reminder Email', key: 'reminderEmail' },
                  { label: 'Reminder SMS', key: 'reminderSMS' },
                  { label: 'Booking Confirmation Email', key: 'bookingConfirmationEmail' },
                  { label: 'Booking Confirmation SMS', key: 'bookingConfirmationSMS' },
                  { label: 'Require Phone Number', key: 'requirePhone' },
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between cursor-pointer group">
                    <span className="text-gray-700 font-light group-hover:text-gray-900 transition">{item.label}</span>
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={e => setSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                        className="sr-only"
                      />
                      <div className={`w-14 h-8 rounded-full transition ${settings[item.key] ? 'bg-amber-600' : 'bg-gray-300'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-300 ${settings[item.key] ? 'translate-x-7' : 'translate-x-1'} mt-1`} />
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-7 bg-black text-white font-medium tracking-widest uppercase hover:bg-gray-900 transition-all disabled:opacity-60 flex items-center justify-center gap-4 text-xl shadow-2xl group"
          >
            <Save className="w-7 h-7 group-hover:scale-110 transition" />
            {saving ? 'Saving Changes...' : 'Save All Settings'}
          </button>

          {/* Success/Error Message */}
          {message && (
            <div className={`p-8 text-center shadow-2xl border ${message.type === 'success' 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border-red-200 text-red-800'
            }`}>
              <div className="flex items-center justify-center gap-4">
                {message.type === 'success' ? (
                  <CheckCircle className="w-10 h-10" />
                ) : (
                  <AlertCircle className="w-10 h-10" />
                )}
                <p className="text-xl font-medium">{message.text}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-20 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent opacity-40" />
    </div>
  );
}