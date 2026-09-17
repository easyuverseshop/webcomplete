import React from 'react';
import { RefreshCw, CheckCircle2, AlertTriangle, HelpCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <Link
        to="/"
        className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>

      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-8 sm:p-12 shadow-sm space-y-6">
        <div className="flex items-center space-x-3 pb-6 border-b border-gray-200 dark:border-slate-700">
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            <RefreshCw className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Return & Refund Policy</h1>
            <p className="text-xs text-gray-500 mt-1">EasyUVerse Source Code & Custom Development Terms</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>1. Digital Source Code Goods</span>
            </h2>
            <p>
              At <strong>EasyUVerse</strong>, we sell non-tangible, irrevocable digital software goods (full MERN stack ZIP source codes, database scripts, and school management systems). Due to the nature of digital products, once a ZIP source code download link is unlocked or sent, all sales are considered final.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>2. Eligible Conditions for Refund or Code Replacement</span>
            </h2>
            <p>We provide full refunds or code replacement under the following conditions:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Duplicate Payment:</strong> If you were accidentally charged twice for the same order reference or UTR.</li>
              <li><strong>Corrupted or Non-Functional Download Link:</strong> If the provided Cloudinary ZIP link fails to download and developer support cannot resolve it within 48 hours.</li>
              <li><strong>Major Code Mismatch:</strong> If the delivered codebase substantially differs from the project description and live demo.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-indigo-500" />
              <span>3. Free Server Installation Guarantee</span>
            </h2>
            <p>
              If you face any issues setting up or deploying the purchased source code on your local computer or live server, developer <strong>Ujjwal Kant</strong> will personally assist you for free via WhatsApp (+91 9241034816) or AnyDesk/TeamViewer.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">4. Requesting a Refund</h2>
            <p>
              To request a refund, please send your order ID, UTR number, and issue details to{' '}
              <a href="mailto:ujjwal@easyuverse.shop" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                ujjwal@easyuverse.shop
              </a>{' '}
              or contact Ujjwal on WhatsApp. Refund requests are processed within 24–48 business hours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default RefundPolicy;
