import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import { MessageSquare, Send, CheckCircle } from 'lucide-react';

const AdminSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  const fetchTickets = async () => {
    try {
      const res = await api.get('/support/admin/all');
      if (res.data.success) {
        setTickets(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText || !selectedTicket) return;

    setReplying(true);
    try {
      const res = await api.post(`/support/${selectedTicket.ticketId}/reply`, {
        message: replyText,
      });

      if (res.data.success) {
        setSelectedTicket(res.data.data);
        setReplyText('');
        fetchTickets();
      }
    } catch (err) {
      alert('Failed to send admin reply');
    } finally {
      setReplying(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!selectedTicket) return;
    try {
      const res = await api.put(`/support/admin/${selectedTicket.ticketId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        setSelectedTicket(res.data.data);
        fetchTickets();
      }
    } catch (err) {
      alert('Failed to update status');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Support Desk & Customer Tickets
          </h1>
          <p className="text-xs text-gray-500">Reply to customer queries and update ticket status</p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No support tickets found.</div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tickets List */}
            <div className="space-y-3">
              {tickets.map((t) => (
                <div
                  key={t._id}
                  onClick={() => setSelectedTicket(t)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedTicket?.ticketId === t.ticketId
                      ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                      : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-400'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-indigo-600 font-bold">#{t.ticketId}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Open'
                          ? 'bg-amber-500/10 text-amber-600'
                          : t.status === 'In Progress'
                          ? 'bg-blue-500/10 text-blue-600'
                          : 'bg-emerald-500/10 text-emerald-600'
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                    {t.subject}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">From: {t.name} ({t.email})</p>
                </div>
              ))}
            </div>

            {/* Conversation Thread */}
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 p-6 flex flex-col justify-between min-h-[450px]">
              {selectedTicket ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-800">
                      <div>
                        <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                          {selectedTicket.subject}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {selectedTicket.name} ({selectedTicket.email}) • #{selectedTicket.ticketId}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <select
                          value={selectedTicket.status}
                          onChange={(e) => handleStatusChange(e.target.value)}
                          className="px-3 py-1 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white"
                        >
                          <option value="Open">Open</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-2">
                      {selectedTicket.messages.map((msg, idx) => (
                        <div
                          key={idx}
                          className={`p-4 rounded-2xl max-w-md ${
                            msg.sender === 'admin'
                              ? 'bg-purple-500/10 border border-purple-500/20 text-gray-900 dark:text-white ml-auto'
                              : 'bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1 text-[11px] font-bold text-gray-500">
                            <span>{msg.senderName}</span>
                            <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-sm leading-relaxed">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reply Form */}
                  <form onSubmit={handleSendReply} className="pt-4 border-t border-gray-200 dark:border-slate-800 flex space-x-2">
                    <input
                      type="text"
                      required
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type admin reply to customer..."
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                    />
                    <button
                      type="submit"
                      disabled={replying}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-sm shadow-md flex items-center space-x-1 disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>Reply</span>
                    </button>
                  </form>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center my-auto text-gray-400 space-y-2">
                  <MessageSquare className="w-10 h-10" />
                  <p className="text-sm">Select a ticket to view and reply.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSupport;
