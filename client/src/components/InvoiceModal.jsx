import React from 'react';
import { X, Printer, CheckCircle2, ShieldCheck, Download } from 'lucide-react';

const InvoiceModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white text-gray-900 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="font-extrabold text-xl text-indigo-600 font-mono">EASYUVERSE.SHOP</h2>
            <p className="text-xs text-gray-500">Official Purchase Invoice & Receipt</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-600 print:hidden">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Details */}
        <div className="space-y-4 text-xs">
          <div className="flex justify-between">
            <div>
              <span className="text-gray-400 block uppercase font-bold text-[10px]">Order ID</span>
              <span className="font-mono font-bold">{order.orderId}</span>
            </div>
            <div className="text-right">
              <span className="text-gray-400 block uppercase font-bold text-[10px]">Date</span>
              <span className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-2xl space-y-1">
            <div className="flex justify-between font-bold">
              <span>Customer Name:</span>
              <span>{order.user?.name || order.customerDetails?.name || 'Customer'}</span>
            </div>
            <div className="flex justify-between">
              <span>Customer Email:</span>
              <span>{order.user?.email || order.customerDetails?.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Submitted UTR / Ref:</span>
              <span className="font-mono font-bold text-indigo-600">{order.utrNumber || 'N/A'}</span>
            </div>
          </div>

          {/* Purchased Item Table */}
          <div className="border rounded-2xl overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-[10px] font-bold text-gray-500 uppercase">
                <tr>
                  <th className="p-3">Item Description</th>
                  <th className="p-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y text-xs">
                <tr>
                  <td className="p-3 font-bold">{order.project?.title || 'Source Code Asset'}</td>
                  <td className="p-3 text-right font-extrabold text-emerald-600">₹{order.amount}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="font-bold">Total Paid Amount:</span>
            <span className="text-xl font-extrabold text-indigo-600">₹{order.amount}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex space-x-3 pt-4 border-t print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl border border-gray-300 font-bold text-xs flex items-center justify-center space-x-2 hover:bg-gray-100"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice</span>
          </button>
          {order.project?.downloadUrl && (
            <a
              href={order.project.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-md hover:bg-emerald-700"
            >
              <Download className="w-4 h-4" />
              <span>Download ZIP</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal;
