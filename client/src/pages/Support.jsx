import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Send, PlusCircle, Clock, CheckCircle } from 'lucide-react';

const Support = ({ onOpenSupport }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [replying, setReplying] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get('/support/my-tickets');
        if (res.data.success) {
          setTickets(res.data.data);
        }
      } catch (err) {
        console.error('Error loading tickets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [user]);

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
        // Refresh ticket list
        const updated = tickets.map((t) =>
          t.ticketId === res.data.data.ticketId ? res.data.data : t
        );
        setTickets(updated);
      }
    } catch (err) {
      alert('Failed to send reply');
    } finally {
      setReplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            EasyUVerse Support Desk
          </h1>
          <p className="text-sm text-gray-500">Track your queries, tickets, and assistance history</p>
        </div>

        <button
          onClick={onOpenSupport}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/25 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Support Ticket</span>
        </button>
      </div>

      {!user ? (
        <div className="p-10 bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 text-center space-y-3">
          <MessageSquare className="w-10 h-10 text-indigo-500 mx-auto" />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">Log in to track your tickets</h3>
          <p className="text-sm text-gray-500">
            Or submit a ticket directly using the button above.
          </p>
        </div>
      ) : loading ? (
        <div className="p-8 text-center">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : tickets.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 space-y-3">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">No Tickets Submitted Yet</h3>
          <p className="text-xs text-gray-500 max-w-sm mx-auto">
            Need help with a project purchase or custom code request? Open a new ticket anytime!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Ticket List */}
          <div className="space-y-3">
            {tickets.map((t) => (
              <div
                key={t._id}
                onClick={() => setSelectedTicket(t)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  selectedTicket?.ticketId === t.ticketId
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
                    : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs text-indigo-600 dark:text-indigo-400 font-bold">
                    #{t.ticketId}
                  </span>
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
                <p className="text-xs text-gray-500 mt-1">Category: {t.category}</p>
              </div>
            ))}
          </div>

          {/* Ticket Detail Conversation Panel */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 flex flex-col justify-between min-h-[450px]">
            {selectedTicket ? (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-slate-700">
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                        {selectedTicket.subject}
                      </h3>
                      <p className="text-xs text-gray-500">
                        Ticket ID: {selectedTicket.ticketId} • Created:{' '}
                        {new Date(selectedTicket.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Messages Thread */}
                  <div className="mt-4 space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {selectedTicket.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl max-w-md ${
                          msg.sender === 'admin'
                            ? 'bg-purple-500/10 border border-purple-500/20 text-gray-900 dark:text-white ml-auto'
                            : 'bg-gray-100 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 text-gray-900 dark:text-white'
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
                <form onSubmit={handleSendReply} className="pt-4 border-t border-gray-200 dark:border-slate-700 flex space-x-2">
                  <input
                    type="text"
                    required
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-900 dark:text-white"
                  />
                  <button
                    type="submit"
                    disabled={replying}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center my-auto text-gray-400 space-y-2">
                <MessageSquare className="w-10 h-10" />
                <p className="text-sm">Select a ticket from the left panel to read conversation.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;
