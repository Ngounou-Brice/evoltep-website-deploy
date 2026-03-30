import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../../utils/api';
import { Mail, Send, Users, Trash2 } from 'lucide-react';

const Email = ({ apiKey }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [emailData, setEmailData] = useState({
    subject: '',
    message: '',
    recipient: 'all' // 'all' or specific email
  });
  const [sending, setSending] = useState(false);
  const [showCompose, setShowCompose] = useState(false);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/subscribers`, {
        headers: { 'X-API-KEY': apiKey }
      });
      setSubscribers(data.subscribers || []);
    } catch (err) {
      console.error('Error fetching subscribers:', err);
    }
  };

  const sendEmail = async () => {
    if (!emailData.subject || !emailData.message) {
      return alert('Subject and message are required');
    }

    setSending(true);
    try {
      const payload = {
        subject: emailData.subject,
        message: emailData.message,
        recipient: emailData.recipient
      };

      const { data } = await axios.post(`${API_BASE}/send-bulk-email`, payload, {
        headers: { 'X-API-KEY': apiKey }
      });

      if (data.success) {
        alert('Email sent successfully!');
        setEmailData({ subject: '', message: '', recipient: 'all' });
        setShowCompose(false);
      } else {
        alert(data.error || 'Failed to send email');
      }
    } catch (err) {
      console.error('Error sending email:', err);
      alert('Failed to send email. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const deleteSubscriber = async (email) => {
    if (!confirm(`Are you sure you want to remove ${email} from subscribers?`)) return;

    try {
      // Note: This would require a backend endpoint to delete subscribers
      // For now, we'll just remove from local state
      setSubscribers(prev => prev.filter(sub => sub.email !== email));
      alert('Subscriber removed (frontend only - backend endpoint needed)');
    } catch (err) {
      console.error('Error removing subscriber:', err);
      alert('Failed to remove subscriber.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Email Management</h1>
          <p className="text-gray-600 mt-2">Manage subscribers and send newsletters</p>
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center transition-colors"
        >
          <Mail size={20} className="mr-2" />
          Compose Email
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <Users size={24} className="text-blue-600 mr-4" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{subscribers.length}</h3>
              <p className="text-gray-600">Total Subscribers</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <Mail size={24} className="text-green-600 mr-4" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">0</h3>
              <p className="text-gray-600">Emails Sent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <Send size={24} className="text-purple-600 mr-4" />
            <div>
              <h3 className="text-2xl font-bold text-gray-900">0%</h3>
              <p className="text-gray-600">Open Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Compose Email Modal */}
      {showCompose && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">Compose Email</h2>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient
                  </label>
                  <select
                    value={emailData.recipient}
                    onChange={(e) => setEmailData({ ...emailData, recipient: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Subscribers ({subscribers.length})</option>
                    {subscribers.map((sub) => (
                      <option key={sub.email} value={sub.email}>
                        {sub.name} ({sub.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Email subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={emailData.message}
                    onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-40 resize-none"
                    placeholder="Email message"
                  />
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={sendEmail}
                  disabled={sending}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-semibold flex items-center transition-colors"
                >
                  {sending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Email
                    </>
                  )}
                </button>
                <button
                  onClick={() => setShowCompose(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subscribers List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Subscribers</h2>
          <p className="text-gray-600 mt-1">Manage your email subscribers</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {subscribers.map((subscriber, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {subscriber.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{subscriber.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => deleteSubscriber(subscriber.email)}
                      className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {subscribers.length === 0 && (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                    No subscribers yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Email;