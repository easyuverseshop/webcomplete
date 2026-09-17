import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/AdminLayout';
import api from '../../services/api';
import {
  FolderPlus,
  Search,
  Plus,
  Edit,
  Trash2,
  Gift,
  DollarSign,
  X,
  Upload,
  Sparkles,
  Code2,
  CheckCircle2,
  FileArchive,
  ImageIcon,
} from 'lucide-react';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Modal Step State: null (closed), 1 (choice modal), 2 (asset form modal)
  const [modalStep, setModalStep] = useState(null);
  const [projectType, setProjectType] = useState('premium');
  const [editingId, setEditingId] = useState(null);

  // Upload States
  const [uploadingZip, setUploadingZip] = useState(false);
  const [zipUploadSuccess, setZipUploadSuccess] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageUploadSuccess, setImageUploadSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    category: 'Full Stack MERN',
    price: 999,
    discountPrice: 0,
    demoUrl: '',
    downloadUrl: '',
    fileFormat: '.ZIP Source Code',
    fileSize: '15.0 MB',
    setupCommand: 'npm install && npm run dev',
    thumbnail: '',
    shortDescription: '',
    description: '',
    techStack: 'React, Node.js, Express, MongoDB, Tailwind CSS',
    features: 'JWT Auth, UPI QR Payments, Full Admin Panel',
    isFeatured: true,
    isPublished: true,
  });

  const categories = [
    'ALL',
    'Full Stack MERN',
    'PHP & MySQL',
    'HTML CSS JS',
    'Python & Automation',
    'Java & Spring Boot',
    'C/C++',
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects?limit=100');
      setProjects(res.data?.projects || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenChoiceModal = () => {
    setEditingId(null);
    setZipUploadSuccess('');
    setImageUploadSuccess('');
    setModalStep(1);
  };

  const handleSelectType = (type) => {
    setProjectType(type);
    setFormData((prev) => ({
      ...prev,
      price: type === 'free' ? 0 : 499,
      discountPrice: 0,
    }));
    setModalStep(2);
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setProjectType(project.price === 0 ? 'free' : 'premium');
    setZipUploadSuccess('');
    setImageUploadSuccess('');
    setFormData({
      title: project.title || '',
      category: project.category || 'Full Stack MERN',
      price: project.price || 0,
      discountPrice: (project.discountPrice && project.discountPrice < project.price) ? project.discountPrice : 0,
      demoUrl: project.demoUrl || '',
      downloadUrl: project.downloadUrl || '',
      fileFormat: project.fileFormat || '.ZIP Source Code',
      fileSize: project.fileSize || '15 MB',
      setupCommand: project.setupCommand || '',
      thumbnail: project.thumbnail || '',
      shortDescription: project.shortDescription || '',
      description: project.description || '',
      techStack: Array.isArray(project.techStack) ? project.techStack.join(', ') : project.techStack || '',
      features: Array.isArray(project.features) ? project.features.join(', ') : project.features || '',
      isFeatured: project.isFeatured ?? true,
      isPublished: project.isPublished ?? true,
    });
    setModalStep(2);
  };

  // ZIP File Upload Handler (Multer / Cloudinary)
  const handleZipFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      setUploadingZip(true);
      setZipUploadSuccess('');
      const res = await api.post('/upload/zip', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setFormData((prev) => ({
          ...prev,
          downloadUrl: res.data.fileUrl,
          fileSize: res.data.fileSize || '25.0 MB',
        }));
        setZipUploadSuccess(`✓ Uploaded: ${res.data.fileName || file.name}`);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'ZIP upload failed');
    } finally {
      setUploadingZip(false);
    }
  };

  // Thumbnail Image Upload Handler (Multer / Cloudinary)
  const handleImageFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      setUploadingImage(true);
      setImageUploadSuccess('');
      const res = await api.post('/upload/image', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        setFormData((prev) => ({
          ...prev,
          thumbnail: res.data.fileUrl,
        }));
        setImageUploadSuccess('✓ Thumbnail uploaded successfully!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project listing?')) return;
    try {
      await api.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.downloadUrl) {
      alert('Please upload a ZIP file or provide a download URL');
      return;
    }

    try {
      const payload = {
        ...formData,
        description: formData.description || formData.shortDescription || formData.title,
        price: projectType === 'free' ? 0 : Number(formData.price),
        discountPrice: (projectType !== 'free' && formData.discountPrice && Number(formData.discountPrice) < Number(formData.price)) ? Number(formData.discountPrice) : 0,
        techStack: typeof formData.techStack === 'string' ? formData.techStack.split(',').map((s) => s.trim()) : formData.techStack,
        features: typeof formData.features === 'string' ? formData.features.split(',').map((s) => s.trim()) : formData.features,
      };

      if (editingId) {
        await api.put(`/projects/${editingId}`, payload);
      } else {
        await api.post('/projects', payload);
      }

      setModalStep(null);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save project');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2">
              <FolderPlus className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
              <span>Project Catalog Manager</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Deploy Free & Premium project assets, upload .ZIP source code files to Cloudinary/Server, and configure prices.
            </p>
          </div>

          <button
            onClick={handleOpenChoiceModal}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center space-x-2 transition-all shrink-0"
          >
            <Plus className="w-5 h-5" />
            <span>Deploy New Asset</span>
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 border border-gray-200 dark:border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-xs font-bold text-gray-400 mt-3">Loading project catalog...</p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800">
            <Code2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm font-extrabold text-gray-700 dark:text-gray-300">No Projects Found</p>
            <p className="text-xs text-gray-400 mt-1">Click "Deploy New Asset" above to add your first project.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((p) => (
              <div
                key={p._id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Image & Badge Header */}
                  <div className="relative h-44 bg-slate-800 overflow-hidden">
                    <img
                      src={p.thumbnail || 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80'}
                      alt={p.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>

                    <div className="absolute top-3 left-3 flex items-center space-x-2">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-600 text-white shadow">
                        {p.category}
                      </span>
                      {p.price === 0 ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500 text-slate-950 shadow flex items-center gap-1">
                          <Gift className="w-3 h-3" /> FREE
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow flex items-center gap-1">
                          <DollarSign className="w-3 h-3" /> ₹{p.price}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Details */}
                  <div className="p-5 space-y-3">
                    <h3 className="font-extrabold text-base text-gray-900 dark:text-white line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {p.shortDescription || p.description}
                    </p>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {p.techStack?.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-300"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-4 border-t border-gray-100 dark:border-slate-800/80 bg-gray-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-gray-500">
                    Format: {p.fileFormat || '.ZIP'}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="p-2 rounded-xl text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors"
                      title="Edit Project"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p._id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 1 MODAL: Free vs Premium Selection (Matching Screenshot 3) */}
        {modalStep === 1 && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
              <button
                onClick={() => setModalStep(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center space-y-2">
                <div className="inline-flex p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-1">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Deploy New Asset</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                  Choose the type of digital asset you want to list on EasyUVerse storefront.
                </p>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Free Card */}
                <button
                  onClick={() => handleSelectType('free')}
                  className="p-5 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 transition-all text-left group space-y-3"
                >
                  <div className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 w-fit font-bold shadow">
                    <Gift className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-gray-900 dark:text-white group-hover:text-emerald-500">
                      Free Project
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Visible to all visitors. Instant direct .zip download link without payment step.
                    </p>
                  </div>
                  <span className="inline-block text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                    Deploy Free Asset ↗
                  </span>
                </button>

                {/* Premium Card */}
                <button
                  onClick={() => handleSelectType('premium')}
                  className="p-5 rounded-2xl border-2 border-indigo-500/30 hover:border-indigo-500 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all text-left group space-y-3"
                >
                  <div className="p-2.5 rounded-xl bg-indigo-600 text-white w-fit font-bold shadow">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-gray-900 dark:text-white group-hover:text-indigo-500">
                      Premium Project
                    </h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                      Requires UPI QR payment & 12-digit UTR verification before zip access is unlocked.
                    </p>
                  </div>
                  <span className="inline-block text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
                    Deploy Paid Asset ↗
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2 MODAL: Form Fields with Direct ZIP File Upload Button */}
        {modalStep === 2 && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-200 dark:border-slate-800 max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-8">
              <button
                onClick={() => setModalStep(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"
              >
                <X className="w-6 h-6" />
              </button>

              <div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    projectType === 'free' ? 'bg-emerald-500 text-slate-950' : 'bg-indigo-600 text-white'
                  }`}>
                    {projectType === 'free' ? 'Free Asset' : 'Premium Asset'}
                  </span>
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">
                  {editingId ? 'Edit Project Listing' : `Deploy New ${projectType === 'free' ? 'Free' : 'Premium'} Asset`}
                </h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Title */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. EasyUVerse Full Stack MERN Marketplace"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                    >
                      <option value="Full Stack MERN">Full Stack MERN</option>
                      <option value="PHP & MySQL">PHP & MySQL</option>
                      <option value="HTML CSS JS">HTML CSS JS</option>
                      <option value="Python & Automation">Python & Automation</option>
                      <option value="Java & Spring Boot">Java & Spring Boot</option>
                      <option value="C/C++">C/C++</option>
                    </select>
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">
                      Price (INR) {projectType === 'free' && '(Free Project)'} *
                    </label>
                    <input
                      type="number"
                      disabled={projectType === 'free'}
                      value={projectType === 'free' ? 0 : formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold disabled:opacity-50"
                    />
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Tech Stack / Languages (Comma separated) *</label>
                    <input
                      type="text"
                      required
                      placeholder="React, Node.js, Express, MongoDB, Tailwind CSS"
                      value={formData.techStack}
                      onChange={(e) => setFormData({ ...formData, techStack: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                    />
                  </div>

                  {/* DIRECT ZIP FILE UPLOAD SECTION */}
                  <div className="space-y-2 sm:col-span-2 bg-indigo-500/5 dark:bg-slate-800/60 p-4 rounded-2xl border border-indigo-500/20">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-xs text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5">
                        <FileArchive className="w-4 h-4" />
                        <span>Upload .ZIP Source Code File (Cloudinary / Server) *</span>
                      </label>
                      {zipUploadSuccess && (
                        <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {zipUploadSuccess}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <label className={`px-4 py-2.5 rounded-xl font-extrabold text-xs text-white cursor-pointer flex items-center space-x-2 transition-all shrink-0 ${
                        uploadingZip ? 'bg-indigo-400' : 'bg-indigo-600 hover:bg-indigo-700 shadow-md shadow-indigo-500/20'
                      }`}>
                        <Upload className="w-4 h-4" />
                        <span>{uploadingZip ? 'Uploading .ZIP...' : 'Browse & Upload .ZIP File'}</span>
                        <input
                          type="file"
                          accept=".zip,.rar,.tar,.7z"
                          onChange={handleZipFileUpload}
                          disabled={uploadingZip}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="url"
                        required
                        placeholder="Or paste direct .zip download link URL..."
                        value={formData.downloadUrl}
                        onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* DIRECT THUMBNAIL IMAGE UPLOAD SECTION */}
                  <div className="space-y-2 sm:col-span-2 bg-gray-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-gray-200 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <label className="font-extrabold text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-purple-500" />
                        <span>Thumbnail Image (Upload Image File or URL) *</span>
                      </label>
                      {imageUploadSuccess && (
                        <span className="text-[11px] font-bold text-emerald-500 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> {imageUploadSuccess}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-3">
                      <label className={`px-4 py-2.5 rounded-xl font-bold text-xs text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 cursor-pointer flex items-center space-x-2 shrink-0 ${
                        uploadingImage ? 'opacity-50' : ''
                      }`}>
                        <Upload className="w-4 h-4" />
                        <span>{uploadingImage ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          disabled={uploadingImage}
                          className="hidden"
                        />
                      </label>

                      <input
                        type="url"
                        required
                        placeholder="Or paste thumbnail image URL..."
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  {/* Setup Command */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Setup Command</label>
                    <input
                      type="text"
                      placeholder="npm install && npm run dev"
                      value={formData.setupCommand}
                      onChange={(e) => setFormData({ ...formData, setupCommand: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                    />
                  </div>

                  {/* Demo URL */}
                  <div className="space-y-1">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Live Demo URL</label>
                    <input
                      type="url"
                      placeholder="https://ujjwal.page.gd"
                      value={formData.demoUrl}
                      onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                    />
                  </div>

                  {/* Short Description */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="font-bold text-gray-700 dark:text-gray-300">Short Description *</label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Short 1-2 sentence overview..."
                      value={formData.shortDescription}
                      onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl font-semibold"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setModalStep(null)}
                    className="px-5 py-2.5 rounded-xl font-bold bg-gray-200 dark:bg-slate-800 text-gray-700 dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploadingZip || uploadingImage}
                    className="px-6 py-2.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                  >
                    Publish Asset
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminProjects;
