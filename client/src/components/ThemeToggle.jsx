import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Zap } from 'lucide-react';

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center bg-gray-200 dark:bg-slate-800 p-1 rounded-full border border-gray-300 dark:border-slate-700">
      <button
        onClick={() => setTheme('light')}
        className={`p-1.5 rounded-full transition-all ${
          theme === 'light'
            ? 'bg-white text-yellow-500 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
        }`}
        title="Light Mode"
      >
        <Sun className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('dark')}
        className={`p-1.5 rounded-full transition-all ${
          theme === 'dark'
            ? 'bg-slate-900 text-indigo-400 shadow-sm'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
        }`}
        title="Dark Mode"
      >
        <Moon className="w-4 h-4" />
      </button>

      <button
        onClick={() => setTheme('cyber')}
        className={`p-1.5 rounded-full transition-all ${
          theme === 'cyber'
            ? 'bg-cyan-900 text-cyan-400 shadow-sm ring-1 ring-cyan-500'
            : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
        }`}
        title="Cyber Mode"
      >
        <Zap className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ThemeToggle;
