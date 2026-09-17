import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ExternalLink,
  CheckCircle,
  ShieldCheck,
  Zap,
  Download,
  Lock,
  ArrowLeft,
  Star,
  Layers,
  Copy,
  QrCode,
  Send,
  X,
  Clock,
  CheckCircle2,
  FileCode,
  Terminal,
  AlertCircle,
  Info,
} from 'lucide-react';

const ProjectDetail = () => {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isPurchased, setIsPurchased] = useState(false);
  const [downloadLink, setDownloadLink] = useState('');

  // Coupon & Phone Checkout State
  const [customerPhone, setCustomerPhone] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  // UPI Payment Modal State
  const [upiModalOpen, setUpiModalOpen] = useState(false);
  const [upiOrderData, setUpiOrderData] = useState(null);
  const [utrInput, setUtrInput] = useState('');
  const [submittingUtr, setSubmittingUtr] = useState(false);
  const [verifyingAnimation, setVerifyingAnimation] = useState(false);
  const [utrSuccessMsg, setUtrSuccessMsg] = useState('');
  const [utrErrorMsg, setUtrErrorMsg] = useState('');
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [copiedSetup, setCopiedSetup] = useState(false);

  // 5-Minute Live Countdown Timer State for EasyUVerse Gateway
  const [timeLeft, setTimeLeft] = useState(300);

  useEffect(() => {
    if (!upiModalOpen) {
      setTimeLeft(300);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [upiModalOpen]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const res = await api.get(`/projects/${idOrSlug}`);
        if (res.data.success) {
          setProject(res.data.data);

          if (user) {
            try {
              const myPurchasesRes = await api.get('/payments/my-purchases');
              if (myPurchasesRes.data.success) {
                const owned = myPurchasesRes.data.data.find(
                  (order) => order.project && order.project._id === res.data.data._id && order.paymentStatus === 'SUCCESS'
                );
                if (owned) {
                  setIsPurchased(true);
                  setDownloadLink(res.data.data.downloadUrl);
                }
              }
            } catch (err) {
              console.error(err);
            }
          }
        }
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [idOrSlug, user]);

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponError('');
    setCouponSuccess('');
    setValidatingCoupon(true);

    try {
      const res = await api.post('/coupons/validate', { code: couponInput });
      if (res.data) {
        setAppliedCoupon(res.data);
        setCouponSuccess(`Coupon '${res.data.code}' applied successfully! (${res.data.discountPercentage}% OFF)`);
      }
    } catch (err) {
      setAppliedCoupon(null);
      setCouponError(err.response?.data?.message || 'Invalid or expired coupon code');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleOpenUpiModal = async () => {
    if (!user) {
      navigate('/login', { state: { from: `/projects/${idOrSlug}` } });
      return;
    }

    setError('');
    setUtrErrorMsg('');
    try {
      const res = await api.post('/payments/initiate-upi', {
        projectId: project._id,
        customerPhone,
        couponCode: appliedCoupon ? appliedCoupon.code : '',
      });

      if (res.data.success) {
        setUpiOrderData(res.data.data);
        setUpiModalOpen(true);
      } else {
        setError(res.data.message || 'Failed to initiate UPI payment');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error initiating payment');
    }
  };

  const handleSubmitUtr = async (e) => {
    e.preventDefault();
    setUtrErrorMsg('');
    const cleanInput = utrInput.trim();

    // 1. Strict 12-Digit Numeric Validation
    if (cleanInput.length !== 12 || !/^\d{12}$/.test(cleanInput)) {
      setUtrErrorMsg('Invalid UTR format! UTR number must be exactly 12 digits (numbers only, e.g. 426189012345). Do not include letters or spaces.');
      return;
    }

    setSubmittingUtr(true);
    setVerifyingAnimation(true);

    try {
      const res = await api.post('/payments/submit-utr', {
        orderId: upiOrderData.orderId,
        utrNumber: cleanInput,
      });

      // 1.8 Second Bank Verification Animation Delay
      await new Promise((resolve) => setTimeout(resolve, 1800));

      if (res.data.success) {
        if (res.data.data.status === 'SUCCESS') {
          setIsPurchased(true);
          setDownloadLink(res.data.data.downloadUrl);
          setUtrSuccessMsg('UTR Verified Successfully! Cloudinary source code zip unlocked.');
        } else {
          setUtrSuccessMsg('UTR submitted! Pending verification by admin.');
        }
      } else {
        setUtrErrorMsg(res.data.message || 'Verification failed');
      }
    } catch (err) {
      setUtrErrorMsg(err.response?.data?.message || 'Error submitting UTR number. Please check input.');
    } finally {
      setVerifyingAnimation(false);
      setSubmittingUtr(false);
    }
  };

  const copyUpiId = () => {
    if (upiOrderData?.upiId) {
      navigator.clipboard.writeText(upiOrderData.upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };

  const copyRefCode = () => {
    if (upiOrderData?.secretRefCode) {
      navigator.clipboard.writeText(upiOrderData.secretRefCode);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 2000);
    }
  };

  const copySetupCmd = () => {
    if (project?.setupCommand) {
      navigator.clipboard.writeText(project.setupCommand);
      setCopiedSetup(true);
      setTimeout(() => setCopiedSetup(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 text-sm">Loading EasyUVerse project details...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold">Project Not Found</h2>
        <Link to="/projects" className="mt-4 inline-block text-cyan-600 font-semibold text-sm">
          Return to All Projects
        </Link>
      </div>
    );
  }

  const hasDiscount = Boolean(project.discountPrice && project.discountPrice > 0 && project.discountPrice < project.price);
  let basePrice = hasDiscount ? project.discountPrice : project.price;
  let finalPrice = basePrice;

  if (appliedCoupon) {
    const couponDisc = (basePrice * appliedCoupon.discountPercentage) / 100;
    const maxDisc = appliedCoupon.maxDiscount || couponDisc;
    const finalDiscVal = Math.min(couponDisc, maxDisc);
    finalPrice = Math.max(1, Math.round(basePrice - finalDiscVal));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Link
        to="/projects"
        className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-cyan-500 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Projects</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-800 shadow-xl bg-gray-900 aspect-video">
            <img
              src={project.thumbnail}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-cyan-600 text-white shadow-md">
                {project.category}
              </span>
              {project.isFeatured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-white shadow-md flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>Featured</span>
                </span>
              )}
            </div>

            <div className="absolute bottom-3 left-4 flex gap-2 text-xs font-bold text-white">
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md">
                {project.fileFormat || '.ZIP Source Code'}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md">
                {project.fileSize || '15 MB'}
              </span>
            </div>
          </div>

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
              {project.title}
            </h1>
            <p className="mt-3 text-lg text-gray-600 dark:text-gray-300">
              {project.shortDescription}
            </p>
          </div>

          {/* Quick Setup Command Snippet Box */}
          {project.setupCommand && (
            <div className="p-4 bg-slate-900 text-gray-100 rounded-2xl border border-slate-700 shadow-md space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-cyan-400">
                <span className="flex items-center space-x-1.5">
                  <Terminal className="w-4 h-4" />
                  <span>Installation / Run Command</span>
                </span>
                <button
                  onClick={copySetupCmd}
                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center space-x-1 text-white"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedSetup ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
              <code className="block text-xs font-mono bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-emerald-400 overflow-x-auto">
                {project.setupCommand}
              </code>
            </div>
          )}

          {project.features && project.features.length > 0 && (
            <div className="p-6 bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Key Features Included</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {project.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center space-x-2 text-sm text-gray-700 dark:text-gray-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-6 bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700/80 shadow-sm space-y-4">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              Detailed Description
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {project.techStack && project.techStack.length > 0 && (
            <div className="p-6 bg-white dark:bg-slate-800/80 rounded-2xl border border-gray-200 dark:border-slate-700/80 shadow-sm space-y-4">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center space-x-2">
                <Layers className="w-5 h-5 text-cyan-500" />
                <span>Technology Stack</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-cyan-600 dark:text-cyan-400 border border-gray-200 dark:border-slate-600"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Checkout */}
        <div className="space-y-6">
          <div className="sticky top-24 bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700/80 p-6 shadow-xl space-y-6">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">
                  Price
                </span>
                <div className="flex items-baseline space-x-2 mt-1">
                  <span className="text-3xl font-extrabold text-gray-900 dark:text-white">
                    ₹{finalPrice}
                  </span>
                  {project.discountPrice > 0 && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{project.price}
                    </span>
                  )}
                </div>
              </div>

              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
                {error}
              </div>
            )}

            {isPurchased ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-center">
                  <CheckCircle className="w-8 h-8 mx-auto mb-1" />
                  <p className="font-bold text-sm">You Own This Code!</p>
                  <p className="text-xs text-gray-500 mt-1">Direct Cloudinary ZIP download active.</p>
                </div>
                <a
                  href={downloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center space-x-2 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download ZIP Source Code</span>
                </a>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number (10 Digits Only, for Order / Invoice)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={10}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-700 rounded-xl text-sm font-mono font-bold focus:ring-2 focus:ring-cyan-500 outline-none"
                    placeholder="e.g. 9876543210 (10 Digits Only)"
                  />
                </div>

                {/* Coupon Code Input & Apply Box */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-indigo-50/50 dark:bg-slate-900/50 border border-indigo-100 dark:border-slate-700">
                  <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                    Have a Discount Coupon Code?
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. EASY20"
                      className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-xl text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-cyan-500 outline-none text-gray-900 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      disabled={validatingCoupon || !couponInput.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50"
                    >
                      {validatingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  </div>
                  {couponSuccess && (
                    <p className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">{couponSuccess}</p>
                  )}
                  {couponError && (
                    <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 mt-1">{couponError}</p>
                  )}
                </div>

                <button
                  onClick={handleOpenUpiModal}
                  className="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-base shadow-xl flex items-center justify-center space-x-2 transition-all"
                >
                  <QrCode className="w-5 h-5" />
                  <span>Pay ₹{finalPrice} via UPI QR & Enter UTR</span>
                </button>

                <p className="text-[11px] text-center text-gray-500 flex items-center justify-center space-x-1">
                  <Lock className="w-3 h-3 text-emerald-500" />
                  <span>Direct Scan GPay, PhonePe, Paytm QR Code</span>
                </p>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 dark:border-slate-700/60 space-y-2 text-xs text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>Full ZIP Source Code & Database Scripts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-purple-500" />
                <span>Instant Auto-Unlock Upon 12-Digit UTR Verification</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Direct UPI QR Code + Secret Pay Ref Code + 12-Digit UTR Verification Modal */}
      {upiModalOpen && upiOrderData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-auto relative">
            
            {/* Modal Header: Branded EasyUVerse Payment Gateway */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-800 bg-gray-50/80 dark:bg-slate-900/80">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-indigo-600 text-white flex items-center justify-center font-extrabold shadow-md">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-gray-900 dark:text-white flex items-center gap-2">
                    <span>EasyUVerse Payment Gateway</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      ⚡ 100% Encrypted UPI
                    </span>
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Merchant: <strong className="text-gray-700 dark:text-gray-300">Ujjwal Kant</strong> ({upiOrderData.upiId})
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  setUpiModalOpen(false);
                  if (utrSuccessMsg) navigate('/dashboard');
                }}
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                title="Close Gateway"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content Logic */}
            {verifyingAnimation ? (
              /* State 1: Bank & NPCI UTR Verification Animation Screen */
              <div className="p-10 text-center space-y-6">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="w-20 h-20 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-emerald-500">
                    <ShieldCheck className="w-8 h-8 animate-pulse" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-extrabold text-xl text-gray-900 dark:text-white">
                    Verifying 12-Digit UTR with Bank Servers...
                  </h4>
                  <p className="text-xs text-gray-500 max-w-sm mx-auto">
                    Checking transaction reference <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{utrInput}</span> against EasyUVerse Merchant account...
                  </p>
                </div>

                <div className="w-full max-w-xs mx-auto bg-gray-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 via-indigo-500 to-emerald-500 h-full w-full animate-pulse" />
                </div>
              </div>
            ) : utrSuccessMsg ? (
              /* State 2: Final Confirmation Screen */
              <div className="p-8 space-y-6">
                <div className="flex items-center space-x-3 bg-emerald-50 dark:bg-emerald-950/40 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 shrink-0" />
                  <div>
                    <h4 className="font-extrabold text-lg text-gray-900 dark:text-white">
                      Order & UTR Request Submitted!
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                      {utrSuccessMsg}
                    </p>
                  </div>
                </div>

                {/* Order Details Grid */}
                <div className="bg-gray-50 dark:bg-slate-800/80 p-5 rounded-2xl border border-gray-200 dark:border-slate-700 space-y-3 text-xs">
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 font-semibold">Tracking Order ID</span>
                    <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2.5 py-1 rounded-xl border border-indigo-200 dark:border-indigo-800 text-xs">
                      {upiOrderData.orderId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 font-semibold">Project Asset</span>
                    <span className="font-bold text-gray-900 dark:text-white truncate max-w-[240px]">
                      {project.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-gray-500 font-semibold">Submitted UTR</span>
                    <span className="font-mono font-bold text-gray-900 dark:text-white">
                      {utrInput}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-slate-700">
                    <span className="text-gray-500 font-semibold">Amount Paid</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">
                      ₹{upiOrderData.amount}
                    </span>
                  </div>
                </div>

                {/* Visual 4-Step Progress Tracker */}
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 block text-center">
                    Live Request Progress Tracker
                  </span>
                  <div className="flex items-center justify-between text-[10px] font-bold">
                    <div className="flex flex-col items-center gap-1 text-emerald-500">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">1</div>
                      <span>Order Placed</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-emerald-500 mx-2" />
                    <div className="flex flex-col items-center gap-1 text-emerald-500">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold">2</div>
                      <span>UTR Sent</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-amber-500 mx-2" />
                    <div className="flex flex-col items-center gap-1 text-amber-500">
                      <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold animate-pulse">3</div>
                      <span>Admin Review</span>
                    </div>
                    <div className="h-0.5 flex-1 bg-gray-300 dark:bg-slate-700 mx-2" />
                    <div className="flex flex-col items-center gap-1 text-gray-400">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-800 text-gray-500 flex items-center justify-center font-bold">4</div>
                      <span>Code Unlocked</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setUpiModalOpen(false);
                    navigate('/dashboard');
                  }}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all mt-2"
                >
                  <span>Track Order Status on Dashboard ↗</span>
                </button>
              </div>
            ) : (
              /* State 3: Professional 2-Column Razorpay Gateway Layout */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6">
                {/* Left Column: Order Summary & Form */}
                <div className="md:col-span-6 space-y-4">
                  <div className="bg-gray-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-gray-200 dark:border-slate-700/80 space-y-2">
                    <span className="text-[10px] font-extrabold text-indigo-500 uppercase tracking-widest block">
                      ITEM SUMMARY
                    </span>
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">
                      {project.title}
                    </h4>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-xs text-gray-500 font-medium">Payable Amount:</span>
                      <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        ₹{upiOrderData.amount}
                      </span>
                    </div>
                  </div>

                  {/* Secret Pay Ref Note */}
                  <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-xs flex items-center justify-between">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400 block text-[10px]">Secret Pay Ref Note</span>
                      <span className="font-mono font-extrabold text-indigo-600 dark:text-indigo-400 text-sm">
                        {upiOrderData.secretRefCode}
                      </span>
                    </div>
                    <button
                      onClick={copyRefCode}
                      className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-800 text-[11px] font-bold text-indigo-600 dark:text-indigo-400 shadow-sm border border-indigo-200 dark:border-indigo-800 flex items-center space-x-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedRef ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* UTR Form */}
                  <form onSubmit={handleSubmitUtr} className="space-y-3 pt-1">
                    <div>
                      <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                        Your Phone Number (10 Digits Only)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={10}
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="e.g. 9876543210 (10 Digits Only)"
                        className="w-full px-3.5 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-xs font-mono font-bold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-800 dark:text-gray-200 mb-1">
                        Enter 12-Digit UTR / Transaction Ref No.
                      </label>

                      {utrErrorMsg && (
                        <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-start space-x-2 mb-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <span>{utrErrorMsg}</span>
                        </div>
                      )}

                      <input
                        type="text"
                        inputMode="numeric"
                        pattern="\d{12}"
                        maxLength={12}
                        required
                        value={utrInput}
                        onChange={(e) => setUtrInput(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        placeholder="e.g. 426189012345 (12 Digits Only)"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 text-sm font-mono focus:ring-2 focus:ring-cyan-500 outline-none text-gray-900 dark:text-white font-bold tracking-wider"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingUtr}
                      className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{submittingUtr ? 'Verifying UTR...' : 'Submit UTR & Unlock Code'}</span>
                    </button>
                  </form>
                </div>

                {/* Right Column: QR Scanner & Live 5-Min Countdown */}
                <div className="md:col-span-6 bg-slate-900 text-white p-5 rounded-3xl border border-slate-800 space-y-4 flex flex-col justify-between text-center">
                  {/* 5-Min Live Countdown Timer */}
                  <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold">
                    <span className="flex items-center space-x-1.5">
                      <Clock className="w-4 h-4 animate-spin text-amber-400" />
                      <span>QR Session Expires In:</span>
                    </span>
                    <span className="font-mono text-sm tracking-wider text-amber-400">{formatTime(timeLeft)}</span>
                  </div>

                  {/* QR Image Box */}
                  <div className="w-44 h-44 bg-white p-2 rounded-2xl border-2 border-cyan-400/60 shadow-xl mx-auto flex items-center justify-center">
                    <img
                      src={upiOrderData.qrCodeUrl}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* UPI ID Info Box */}
                  <div className="bg-slate-800/90 p-3 rounded-2xl border border-slate-700 flex items-center justify-between text-xs">
                    <div className="text-left min-w-0">
                      <span className="text-gray-400 text-[10px] block font-bold">MERCHANT UPI ID</span>
                      <span className="font-mono font-bold text-cyan-400 truncate block">
                        {upiOrderData.upiId}
                      </span>
                    </div>
                    <button
                      onClick={copyUpiId}
                      className="px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center space-x-1 shrink-0"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedUpi ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Open Directly Button */}
                  {upiOrderData.upiUri && (
                    <a
                      href={upiOrderData.upiUri}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center space-x-2 shadow-lg transition-all"
                    >
                      <span>Open Directly in UPI App (GPay / PhonePe / Paytm)</span>
                    </a>
                  )}

                  <p className="text-[10px] text-gray-400">
                    Supported: GPay • PhonePe • Paytm • BHIM • Cred • Any UPI App
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
