import React from 'react';

const Logo = ({ logoUrl = '/logo.jpg', className = '', showText = true, slogan = 'FREE CODES • CUSTOM WEBSITES • HOSTING HELP' }) => {
  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      {/* Clean AI-Generated Logo Icon */}
      <img
        src={logoUrl || '/logo.jpg'}
        alt="EasyUVerse Logo"
        className="h-10 sm:h-11 w-auto rounded-2xl object-contain shadow-md ring-1 ring-black/10 dark:ring-white/10 shrink-0"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className="font-extrabold text-lg sm:text-xl tracking-tight text-gray-900 dark:text-white flex items-center">
            <span>Easy</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-black ml-0.5">UVerse</span>
          </span>
          <span className="text-[9px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase mt-1">
            {slogan}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
