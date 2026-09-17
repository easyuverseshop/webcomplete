import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Search, X, Code2, ArrowRight, Layers } from 'lucide-react';

const SearchModal = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.get(`/projects?search=${encodeURIComponent(searchTerm)}`);
        if (res.data.success) {
          setResults(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-md p-4 pt-20 animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden">
        {/* Search Header Input */}
        <div className="flex items-center p-4 border-b border-gray-200 dark:border-slate-800 space-x-3">
          <Search className="w-5 h-5 text-cyan-500 shrink-0" />
          <input
            type="text"
            autoFocus
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PHP, MERN, Python, Java, HTML/CSS projects..."
            className="w-full bg-transparent text-base font-semibold outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-96 overflow-y-auto space-y-2">
          {loading ? (
            <div className="py-8 text-center text-xs text-gray-400">Searching EasyUVerse catalog...</div>
          ) : results.length === 0 ? (
            <div className="py-8 text-center text-xs text-gray-400">
              {searchTerm ? 'No source code projects matched your query.' : 'Type to search projects across MERN, PHP, Python, Java & HTML.'}
            </div>
          ) : (
            results.map((proj) => (
              <div
                key={proj._id}
                onClick={() => {
                  onClose();
                  navigate(`/projects/${proj.slug || proj._id}`);
                }}
                className="p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-slate-800 cursor-pointer flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <img src={proj.thumbnail} alt="" className="w-12 h-12 rounded-xl object-cover bg-gray-900 shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{proj.title}</h4>
                    <span className="text-[10px] font-semibold text-cyan-500">{proj.category}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-extrabold text-sm text-gray-900 dark:text-white">
                    ₹{(proj.discountPrice && proj.discountPrice > 0 && proj.discountPrice < proj.price) ? proj.discountPrice : proj.price}
                  </span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
