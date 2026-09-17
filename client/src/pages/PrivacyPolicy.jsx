import React from 'react';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
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
          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Privacy Policy</h1>
            <p className="text-xs text-gray-500 mt-1">Last Updated: September 2026 • EasyUVerse Platform</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Lock className="w-4 h-4 text-indigo-500" />
              <span>1. Overview & Commitment</span>
            </h2>
            <p>
              Welcome to <strong>EasyUVerse</strong> (<code>https://easyuverse.shop</code>), owned and operated by Lead Developer <strong>Ujjwal Kant</strong>. We are committed to protecting your personal information and respecting your privacy while providing web development source codes, templates, and software development services.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Eye className="w-4 h-4 text-indigo-500" />
              <span>2. Information We Collect</span>
            </h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li><strong>Personal Details:</strong> Name, email address, and phone number provided during account registration or checkout.</li>
              <li><strong>Transaction Data:</strong> 12-Digit Transaction UTR numbers submitted for direct UPI order verification.</li>
              <li><strong>Technical Data:</strong> Anonymized visit counters, IP address logs, browser type, and device information for security and analytics.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>3. How Your Data is Used</span>
            </h2>
            <p>Your data is strictly utilized for:</p>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>Verifying UPI payment UTR reference numbers to unlock zip source code downloads.</li>
              <li>Sending automated order receipts, tax invoices, and account verification updates to your email (<code>ujjwal@easyuverse.shop</code>).</li>
              <li>Providing technical assistance, source code deployment guidance, and freelance project support.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">4. Data Security & Third Parties</h2>
            <p>
              We do NOT sell, rent, or trade your personal information to any third-party marketing companies. All transactions are verified securely via direct UPI protocols.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">5. Contact Privacy Officer</h2>
            <p>
              If you have any questions or requests regarding your data, contact Ujjwal Kant directly at{' '}
              <a href="mailto:ujjwalcse07@gmail.com" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                ujjwalcse07@gmail.com
              </a>{' '}
              or via WhatsApp at <strong>+91 9241034816</strong>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
