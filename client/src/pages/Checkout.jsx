import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { CheckCircle2, XCircle, Download, ArrowLeft, Loader2 } from 'lucide-react';

const Checkout = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('order_id');

  const [status, setStatus] = useState('verifying');
  const [orderData, setOrderData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId) {
        setStatus('failed');
        setErrorMessage('No Order ID found in return payload');
        return;
      }

      try {
        const res = await api.post('/payments/verify', { orderId });
        if (res.data.success) {
          setStatus('success');
          setOrderData(res.data.data);
        } else {
          setStatus('failed');
          setErrorMessage(res.data.message || 'Payment verification failed');
        }
      } catch (err) {
        setStatus('failed');
        setErrorMessage(err.response?.data?.message || 'Server error verifying payment status');
      }
    };

    verifyPayment();
  }, [orderId]);

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-8 shadow-xl text-center space-y-6">
        {status === 'verifying' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Verifying Cashfree Payment...
            </h2>
            <p className="text-sm text-gray-500">
              Please wait while we confirm your payment with Cashfree servers.
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Payment Successful!
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Order ID: <span className="font-mono font-semibold">{orderId}</span>
              </p>
            </div>

            {orderData?.downloadUrl && (
              <a
                href={orderData.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-base shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all"
              >
                <Download className="w-5 h-5" />
                <span>Download Source Code</span>
              </a>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-center">
              <Link
                to="/dashboard"
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1"
              >
                <span>Go to My Purchases Dashboard</span>
              </Link>
            </div>
          </div>
        )}

        {status === 'failed' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-10 h-10" />
            </div>

            <div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Payment Could Not Be Verified
              </h2>
              <p className="text-sm text-rose-500 mt-2">{errorMessage}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
              <Link
                to="/projects"
                className="w-full py-3 px-4 rounded-xl border border-gray-300 dark:border-slate-700 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700"
              >
                Back to Storefront
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
