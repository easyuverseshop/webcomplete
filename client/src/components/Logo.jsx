import React from 'react';

const Logo = ({ logoUrl = '/logo.jpg', className = '', showText = true, slogan = 'FREE CODES • CUSTOM WEBSITES • HOSTING HELP' }) => {
  return (
    <div className={`flex items-center space-x-2 sm:space-x-3 select-none shrink-0 ${className}`}>
      {/* Clean AI-Generated Logo Icon */}
      <img
        src={logoUrl || '/logo.jpg'}
        alt="EasyUVerse Logo"
        className="h-9 sm:h-11 w-auto rounded-xl sm:rounded-2xl object-contain shadow-md ring-1 ring-black/10 dark:ring-white/10 shrink-0"
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />

      {showText && (
        <div className="flex flex-col justify-center leading-none">
          <span className="font-extrabold text-base sm:text-xl tracking-tight text-gray-900 dark:text-white flex items-center whitespace-nowrap">
            <span>Easy</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-black ml-0.5">UVerse</span>
          </span>
          <span className="hidden md:block text-[9px] font-black text-gray-500 dark:text-gray-400 tracking-widest uppercase mt-1 truncate">
            {slogan}
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
