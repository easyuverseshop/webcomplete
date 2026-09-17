import React, { useEffect } from 'react';
import { Sparkles, ExternalLink, DollarSign } from 'lucide-react';

const AdBanner = ({ slot = 'default', adFormat = 'auto', className = '' }) => {
  useEffect(() => {
    try {
      if (window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      // AdSense script loading catch
    }
  }, []);

  return (
    <div className={`my-6 overflow-hidden rounded-2xl border border-dashed border-indigo-500/30 bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-slate-900/90 p-4 text-white text-center relative ${className}`}>
      {/* Google AdSense Dynamic Container */}
      <ins
        className="adsbygoogle block"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-1234567890123456"
        data-ad-slot={slot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />

      {/* Fallback Revenue & Developer Promo Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2 text-left">
          <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="font-extrabold text-sm text-cyan-400 block">
              EasyUVerse Developer Partner & Sponsored Ad
            </span>
            <span className="text-gray-300 text-[11px]">
              Need Custom Full-Stack MERN Website or Hosting Setup? Hire Ujjwal Kant directly.
            </span>
          </div>
        </div>

        <a
          href="https://wa.me/919241034816?text=Hi%20Ujjwal,%20I%20saw%20your%20sponsored%20ad%20on%20EasyUVerse."
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-xs shadow-md shrink-0 flex items-center space-x-1"
        >
          <span>Get Quote</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};

export default AdBanner;
