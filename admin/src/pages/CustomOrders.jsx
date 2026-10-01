import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DownloadCloud, Trash2, Edit } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CustomOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/custom-orders`, { withCredentials: true });
      setOrders(res.data);
    } catch (error) {
      toast.error('Failed to fetch custom orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(true);
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/api/custom-orders/${id}`, { status: newStatus }, { withCredentials: true });
      toast.success('Status updated');
      fetchOrders();
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8">Loading custom orders...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Custom Orders</h1>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-medium text-gray-900">Date</th>
              <th className="px-6 py-4 font-medium text-gray-900">Customer</th>
              <th className="px-6 py-4 font-medium text-gray-900">Request</th>
              <th className="px-6 py-4 font-medium text-gray-900">Reference</th>
              <th className="px-6 py-4 font-medium text-gray-900">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map(order => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{order.name}</div>
                  <div className="text-gray-500">📞 {order.phone}</div>
                  {order.email && <div className="text-gray-500">✉️ {order.email}</div>}
                </td>
                <td className="px-6 py-4 text-gray-600 max-w-xs whitespace-pre-wrap">{order.description}</td>
                <td className="px-6 py-4">
                  {order.referenceImage ? (
                    <a href={order.referenceImage} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                      View <DownloadCloud size={16} />
                    </a>
                  ) : (
                    <span className="text-gray-400">None</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <select 
                    value={order.status}
                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                    disabled={updating}
                    className="border rounded px-2 py-1 bg-white outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Quoted">Quoted</option>
                    <option value="Accepted">Accepted</option>
                    <option value="Completed">Completed</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No custom orders found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
