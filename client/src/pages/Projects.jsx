import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, Code2, Layers } from 'lucide-react';

const categories = [
  'All',
  'Full Stack MERN',
  'PHP & MySQL',
  'HTML CSS JS',
  'Python & Automation',
  'Java & Spring Boot',
  'C / C++ Programs',
  'UI Template',
];

const Projects = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        let url = '/projects';
        const params = new URLSearchParams();

        if (selectedCategory !== 'All') {
          params.append('category', selectedCategory);
        }
        if (searchTerm) {
          params.append('search', searchTerm);
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const res = await api.get(url);
        if (res.data.success) {
          setProjects(res.data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedCategory, searchTerm]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    if (cat === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Title */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
          Explore EasyUVerse Source Codes & Templates
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Browse through verified ZIP source codes for MERN, PHP & MySQL, HTML/CSS/JS, Python, Java, and C/C++ applications.
        </p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-4 rounded-3xl border border-gray-200 dark:border-slate-700 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search PHP, MERN, Python, Java..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-2xl text-sm focus:ring-2 focus:ring-cyan-500 outline-none text-gray-900 dark:text-white"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-500/25'
                  : 'bg-gray-100 dark:bg-slate-700/60 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 space-y-3">
          <Code2 className="w-12 h-12 text-gray-400 mx-auto" />
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">No Projects Found</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Try searching another tech stack or reset your filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Projects;
