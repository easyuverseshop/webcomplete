import React from 'react';
import { FileText, Shield, Code, CheckCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Terms = () => {
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
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Terms & Conditions</h1>
            <p className="text-xs text-gray-500 mt-1">EasyUVerse Platform License & Terms of Service</p>
          </div>
        </div>

        <div className="space-y-6 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Code className="w-4 h-4 text-purple-500" />
              <span>1. Source Code Usage & Licensing</span>
            </h2>
            <p>
              When purchasing or downloading source code templates from <strong>EasyUVerse</strong> (developed by Ujjwal Kant), you are granted a non-exclusive license to use, modify, and deploy the source code for personal learning, academic projects, or client development projects.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <Shield className="w-4 h-4 text-indigo-500" />
              <span>2. Restrictions</span>
            </h2>
            <ul className="list-disc list-inside space-y-1 pl-2">
              <li>You may NOT re-sell, sub-license, or re-distribute EasyUVerse source codes on public marketplaces without prior written permission.</li>
              <li>Free open-source codes are for educational purposes to help beginners learn MERN stack and web development.</li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>3. Custom Web Development Agreements</span>
            </h2>
            <p>
              For custom freelance projects (School Management Systems, Portals, Custom Websites, Library Systems), milestone payments and delivery timelines are agreed upon prior to project initiation. Full source code access is delivered upon final verification.
            </p>
          </section>

          <section className="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-700">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">4. Governing Law & Contact</h2>
            <p>
              These terms are governed by the laws of India. For any legal or licensing inquiries, email{' '}
              <a href="mailto:ujjwal@easyuverse.shop" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">
                ujjwal@easyuverse.shop
              </a>{' '}
              or call +91 9241034816.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
