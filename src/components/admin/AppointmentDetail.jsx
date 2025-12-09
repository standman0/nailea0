// src/components/admin/AppointmentDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';
import { 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  MessageSquare, 
  Bell, 
  Trash2, 
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

const statusConfig = {
  pending: { color: 'bg-amber-100 text-amber-800', icon: AlertCircle },
  confirmed: { color: 'bg-emerald-100 text-emerald-800', icon: CheckCircle },
  completed: { color: 'bg-gray-100 text-gray-800', icon: CheckCircle },
  cancelled: { color: 'bg-red-100 text-red-800', icon: XCircle },
  'no-show': { color: 'bg-red-100 text-red-800', icon: XCircle }
};

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    api.get(`/appointments/${id}`)
      .then(res => {
        const data = res.data.appointment || res.data;
        setAppointment(data);
        setStatus(data.status);
      })
      .catch(() => {
        setMessage({ text: 'Failed to load appointment', type: 'error' });
      });
  }, [id]);

  const updateStatus = async () => {
    if (status === appointment.status) return;
    
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const res = await api.patch(`/appointments/${id}/status`, { status });
      setAppointment(res.data.appointment || res.data);
      setMessage({ text: 'Status updated successfully', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to update status', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      await api.post(`/notifications/reminder/${id}`);
      setMessage({ text: 'Reminder sent successfully', type: 'success' });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || 'Failed to send reminder', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;

    setLoading(true);
    try {
      await api.delete(`/appointments/${id}`);
      navigate('/admin/appointments');
    } catch (err) {
      setMessage({ text: 'Failed to delete appointment', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const StatusIcon = statusConfig[status]?.icon || AlertCircle;

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-5xl font-light tracking-wider text-gray-900">
          Appointment Details
        </h1>
        <div className="w-32 h-px bg-gradient-to-r from-transparent via-amber-600 to-transparent mt-6" />
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between mb-8">
        <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${statusConfig[status]?.color || 'bg-gray-100 text-gray-800'} font-medium tracking-wide`}>
          <StatusIcon className="w-5 h-5" />
          <span className="capitalize">{status.replace('-', ' ')}</span>
        </div>
        <button
          onClick={() => navigate('/admin/appointments')}
          className="text-gray-600 hover:text-gray-900 transition"
        >
          ← Back to Appointments
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-gray-200 shadow-xl overflow-hidden">
        {/* Gold Top Accent */}
        <div className="h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-transparent" />

        <div className="p-10 space-y-10">
          {/* Client */}
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {appointment.clientId?.fullName?.[0] || appointment.clientId?.name?.[0] || 'C'}
            </div>
            <div>
              <div className="text-sm text-gray-600 uppercase tracking-wider">Client</div>
              <div className="text-2xl font-light text-gray-900 mt-1">
                {appointment.clientId?.fullName || appointment.clientId?.name || 'Unknown'}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {appointment.clientId?.email} • {appointment.clientId?.phone}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Service */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Scissors className="w-5 h-5 text-amber-600" />
                <span className="text-sm uppercase tracking-wider">Service</span>
              </div>
              <div className="text-xl font-light text-gray-900">{appointment.serviceName}</div>
              <div className="text-sm text-gray-500">{appointment.duration} minutes</div>
            </div>

            {/* Date & Time */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5 text-amber-600" />
                <span className="text-sm uppercase tracking-wider">Scheduled For</span>
              </div>
              <div className="text-xl font-light text-gray-900">
                {new Date(appointment.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
              <div className="flex items-center gap-2 text-lg">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>{appointment.time}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {appointment.notes && (
            <div>
              <div className="flex items-center gap-3 text-gray-600 mb-3">
                <MessageSquare className="w-5 h-5 text-amber-600" />
                <span className="text-sm uppercase tracking-wider">Client Notes</span>
              </div>
              <p className="text-gray-700 leading-relaxed pl-8">{appointment.notes}</p>
            </div>
          )}

          {/* Actions */}
          <div className="pt-8 border-t border-gray-100">
            <div className="flex flex-wrap items-center gap-4">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-5 py-3 border border-gray-300 focus:border-amber-600 focus:outline-none transition text-sm font-medium"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No-Show</option>
              </select>

              <button
                onClick={updateStatus}
                disabled={loading || status === appointment.status}
                className="px-8 py-3 bg-black text-white font-medium tracking-wide hover:bg-gray-900 disabled:opacity-50 transition"
              >
                {loading ? 'Updating...' : 'Update Status'}
              </button>

              <button
                onClick={sendReminder}
                disabled={loading}
                className="px-8 py-3 bg-amber-600 text-white font-medium tracking-wide hover:bg-amber-700 disabled:opacity-50 transition flex items-center gap-2"
              >
                <Bell className="w-5 h-5" />
                Send Reminder
              </button>

              <button
                onClick={handleDelete}
                disabled={loading}
                className="ml-auto px-8 py-3 bg-red-600 text-white font-medium tracking-wide hover:bg-red-700 disabled:opacity-50 transition flex items-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Delete Appointment
              </button>
            </div>
          </div>

          {/* Message Feedback */}
          {message.text && (
            <div className={`mt-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.text}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Appointment ID: <span className="font-mono">{appointment._id}</span>
      </div>
    </div>
  );
}