import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/apiClient';

export default function AppointmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    api.get(`/appointments/${id}`)
      .then(res => {
        setAppointment(res.data);
        setStatus(res.data.status);
      })
      .catch(() => setAppointment(null));
  }, [id]);

  const updateStatus = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await api.patch(`/appointments/${id}/status`, { status });
      setAppointment(res.data.appointment || res.data);
      setMessage('Status updated');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const sendReminder = async () => {
    setLoading(true);
    setMessage(null);
    try {
      await api.post(`/notifications/reminder/${id}`);
      setMessage('Reminder sent');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to send reminder');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this appointment?')) return;
    setLoading(true);
    try {
      await api.delete(`/appointments/${id}`);
      navigate('/admin/appointments');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  if (!appointment) return <div className="p-6">Loading appointment...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Appointment Details</h2>
        <div className="text-sm text-gray-500">ID: {appointment._id}</div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 space-y-4">
        <div>
          <div className="text-sm text-gray-600">Client</div>
          <div className="font-medium">{appointment.clientId?.fullName || appointment.clientId?.name}</div>
          <div className="text-sm text-gray-500">{appointment.clientId?.email} • {appointment.clientId?.phone}</div>
        </div>

        <div>
          <div className="text-sm text-gray-600">Service</div>
          <div className="font-medium">{appointment.serviceName}</div>
          <div className="text-sm text-gray-500">{appointment.duration} minutes</div>
        </div>

        <div>
          <div className="text-sm text-gray-600">When</div>
          <div className="font-medium">{appointment.date} • {appointment.time}</div>
        </div>

        <div>
          <div className="text-sm text-gray-600">Notes</div>
          <div className="text-sm text-gray-700">{appointment.notes || '—'}</div>
        </div>

        <div className="flex items-center gap-3">
          <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-md border-gray-200 bg-gray-50 px-3 py-2">
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
            <option value="no-show">no-show</option>
          </select>
          <button onClick={updateStatus} disabled={loading} className="px-4 py-2 rounded-md bg-blue-600 text-white">Update Status</button>
          <button onClick={sendReminder} disabled={loading} className="px-4 py-2 rounded-md bg-green-600 text-white">Send Reminder</button>
          <button onClick={handleDelete} disabled={loading} className="ml-auto px-4 py-2 rounded-md bg-red-600 text-white">Delete</button>
        </div>

        {message && <div className="text-sm text-gray-700">{message}</div>}
      </div>
    </div>
  );
}
