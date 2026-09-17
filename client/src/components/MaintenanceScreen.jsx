import React from 'react';
import { Wrench, ShieldAlert } from 'lucide-react';
import Logo from './Logo';

const MaintenanceScreen = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md w-full space-y-6">
        <div className="flex justify-center">
          <Logo showText={true} />
        </div>

        <div className="p-4 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 inline-block text-indigo-400">
          <Wrench className="w-12 h-12 animate-bounce mx-auto" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight">System Under Maintenance</h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          EasyUVerse is currently undergoing scheduled platform upgrades to improve source code delivery speed and security. We will be back online shortly!
        </p>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-left space-y-2 text-xs">
          <div className="flex items-center space-x-2 text-indigo-400 font-bold">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>Developer Contact (Ujjwal Kant)</span>
          </div>
          <p className="text-gray-300">UPI ID: 9241034816@mbkns</p>
          <p className="text-gray-400">Email: support@easyuverse.com</p>
        </div>

        <p className="text-xs text-gray-500">© EasyUVerse • Built & Managed by Ujjwal Kant</p>
      </div>
    </div>
  );
};

export default MaintenanceScreen;
