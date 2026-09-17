import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProjectCard from '../components/ProjectCard';
import {
  Code2,
  Sparkles,
  Zap,
  ShieldCheck,
  Download,
  ArrowRight,
  Terminal,
  CheckCircle2,
  Search,
  Star,
  MessageSquare,
  Play,
  Youtube,
  ExternalLink,
  Copy,
  Send,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  Award,
  Users,
  Briefcase,
  Gift,
  ShoppingCart,
  PhoneCall,
  Check,
  Eye,
  Tag,
  QrCode,
  UserCheck,
  Laptop,
} from 'lucide-react';

const typewriterPhrases = [
  "High-Performance MERN Stack Apps.",
  "Custom School Websites & Portals.",
  "Modern Developer Portfolios.",
  "Python Automation Scripts.",
  "Enterprise Software Architecture.",
];

const marqueeItems = [
  "Full Stack MERN Apps",
  "School Management Portals",
  "Personal Developer Portfolios",
  "Python Automation",
  "React 18 + Vite + Tailwind",
  "Node.js Express REST APIs",
  "Direct UPI QR & UTR System",
  "Free Source Codes",
  "24/7 Developer Support",
  "Server File Hosting & SSL",
];

const services = [
  {
    title: "School Website Building (Standard)",
    price: "₹15,000 approx",
    tech: "HTML, CSS, JavaScript, React",
    desc: "Clean & fast responsive school website with about us, facilities, photo gallery, notice board, and contact forms.",
    highlights: ["Mobile Responsive", "Fast Loading", "Notices & Gallery", "Easy to Maintain"],
  },
  {
    title: "Personal Portfolio Webpage",
    price: "₹10,000 approx",
    tech: "React, Tailwind, Node.js",
    desc: "Modern personal portfolio showcasing your skills, live client projects, experience resume, and direct contact widgets.",
    highlights: ["Interactive Dark Mode", "Project Catalog", "Contact Widget", "SEO Optimized"],
  },
  {
    title: "Enterprise School Management Portal",
    price: "₹25,000 approx",
    tech: "MERN Stack (MongoDB, Express, React, Node)",
    desc: "Full school management portal with online admissions, online fee payment receipts, student & teacher dashboards, and notice manager.",
    highlights: ["Admin Control Panel", "Online Admissions", "Student Results", "Database Integration"],
  },
  {
    title: "Server File Hosting & SSL Deployment",
    price: "₹5,000 approx",
    tech: "Vercel, Render, Hostinger, cPanel",
    desc: "Upload & configure live code & database on cloud servers, link custom domain, install SSL certificate, and test deployment.",
    highlights: ["Cloud Hosting Setup", "Domain Linking", "SSL Security", "Post-Launch Testing"],
  },
  {
    title: "Library Management System",
    price: "₹35,000 approx",
    tech: "Node.js, Express, MongoDB / Python",
    desc: "Automated library software to manage books inventory, student issue & return logs, fine calculator, and staff logins.",
    highlights: ["Book Inventory", "Issue/Return Logs", "Fine Counter", "Multi-Role Access"],
  },
];

const youtubeVideos = [
  {
    id: "lKfF9_zyYQU",
    title: "Expense Tracker Web App",
    desc: "Glassmorphic Personal Finance & Expense Tracker Built with HTML CSS JS",
    url: "https://youtube.com/shorts/lKfF9_zyYQU?feature=share",
    thumb: "https://img.youtube.com/vi/lKfF9_zyYQU/hqdefault.jpg",
  },
  {
    id: "AFlFm1K0ZXc",
    title: "QR Code Generator Tool",
    desc: "Instant QR code generator for text, links & images",
    url: "https://www.youtube.com/shorts/AFlFm1K0ZXc",
    thumb: "https://img.youtube.com/vi/AFlFm1K0ZXc/hqdefault.jpg",
  },
  {
    id: "sBZpiLqs5AA",
    title: "Developer Portfolio Website",
    desc: "Complete step-by-step developer portfolio creation guide",
    url: "https://www.youtube.com/watch?v=sBZpiLqs5AA&t=1s",
    thumb: "https://img.youtube.com/vi/sBZpiLqs5AA&t=1s",
  },
];

const liveShowcases = [
  {
    title: "Deeksha Convent School Portal",
    url: "https://deekshaconvent.page.gd",
    thumb: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80",
    desc: "Live school website deployed with notices, photo gallery & online admissions.",
  },
  {
    title: "Ultimate Personal Portfolio Site",
    url: "https://ujjwalsiteco.netlify.app/",
    thumb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    desc: "Live developer portfolio deployed on Netlify with dark mode.",
  },
];

const faqs = [
  {
    q: "How do I receive the project source code after payment?",
    a: "After paying via UPI QR Code and submitting your 12-digit UTR Number, an instant Download button unlocks immediately on screen and in your User Purchases Dashboard (/dashboard).",
  },
  {
    q: "Do you provide installation and deployment support?",
    a: "Yes! We provide free setup & installation support on your cPanel, Hostinger, Vercel, or Render account for all premium source code purchases.",
  },
  {
    q: "Can I hire Ujjwal for custom software development?",
    a: "Absolutely! You can hire Ujjwal for custom MERN websites, school portals, or bug fixes directly using our Contact form or WhatsApp chat (+91 9241034816).",
  },
];

const Home = ({ onOpenSupport }) => {
  const [projects, setProjects] = useState([]);
  const [freeProjects, setFreeProjects] = useState([]);
  const [premiumProjects, setPremiumProjects] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [siteNotice, setSiteNotice] = useState('');

  // Typewriter effect state
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // AI Helper dropdown state
  const [aiHelperVal, setAiHelperVal] = useState('');
  const [aiOutput, setAiOutput] = useState('');

  // Feedback / Rating form state
  const [reviews, setReviews] = useState([]);
  const [ratingData, setRatingData] = useState({
    name: '',
    projectName: 'EasyUVerse Platform',
    rating: 5,
    review: '',
  });
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState('');

  // Contact form state
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactSending, setContactSending] = useState(false);
  const [contactMsg, setContactMsg] = useState('');

  // Quick Modal view state
  const [selectedModalProject, setSelectedModalProject] = useState(null);

  // Open FAQ accordion index
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projRes, settingsRes, feedbackRes, couponsRes] = await Promise.all([
          api.get('/projects'),
          api.get('/admin/settings'),
          api.get('/feedback'),
          api.get('/coupons/public').catch(() => ({ data: [] })),
        ]);

        if (projRes.data.success) {
          const all = projRes.data.data;
          setProjects(all);
          setPremiumProjects(all.filter((p) => p.price > 0));
          setFreeProjects(all.filter((p) => p.price === 0 || p.discountPrice === 0));
        }

        if (settingsRes.data.success && settingsRes.data.data.bannerNotice) {
          setSiteNotice(settingsRes.data.data.bannerNotice);
        }

        if (feedbackRes.data.success) {
          setReviews(feedbackRes.data.data);
        }

        if (couponsRes.data) {
          setCoupons(Array.isArray(couponsRes.data) ? couponsRes.data : []);
        }
      } catch (error) {
        console.error('Error loading homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Typewriter loop
  useEffect(() => {
    const currentPhrase = typewriterPhrases[typewriterIndex % typewriterPhrases.length];
    let timer;

    if (!isDeleting && typewriterText.length < currentPhrase.length) {
      timer = setTimeout(() => {
        setTypewriterText(currentPhrase.substring(0, typewriterText.length + 1));
      }, 100);
    } else if (!isDeleting && typewriterText.length === currentPhrase.length) {
      timer = setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && typewriterText.length > 0) {
      timer = setTimeout(() => {
        setTypewriterText(currentPhrase.substring(0, typewriterText.length - 1));
      }, 50);
    } else if (isDeleting && typewriterText.length === 0) {
      setIsDeleting(false);
      setTypewriterIndex((prev) => prev + 1);
    }

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, typewriterIndex]);

  const handleAiChange = (val) => {
    setAiHelperVal(val);
    if (val === 'school') setAiOutput('Suggested: School Website Portal (₹15,000 - ₹25,000)');
    else if (val === 'portfolio') setAiOutput('Suggested: Developer Portfolio Theme (₹2,000 - ₹5,000)');
    else if (val === 'mern') setAiOutput('Suggested: Full Stack MERN App (₹10,000 - ₹25,000)');
    else if (val === 'hosting') setAiOutput('Suggested: Server Deployment & SSL (₹3,000 - ₹5,000)');
    else setAiOutput('');
  };

  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRatingSubmitting(true);
    setRatingSuccess('');
    try {
      const res = await api.post('/feedback', ratingData);
      if (res.data.success) {
        setRatingSuccess('Thank you! Your review has been submitted.');
        setReviews([res.data.data, ...reviews]);
        setRatingData({ name: '', projectName: 'EasyUVerse Platform', rating: 5, review: '' });
      }
    } catch (err) {
      alert('Error submitting review');
    } finally {
      setRatingSubmitting(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSending(true);
    setContactMsg('');
    try {
      // 1. Submit lead to database
      await api.post('/leads', {
        name: contactData.name,
        email: contactData.email,
        serviceType: 'Hire Me Project Inquiry',
        budget: '₹5,000 - ₹25,000',
        message: contactData.message,
      });

      // 2. Dual email notification via formsubmit.co
      try {
        fetch('https://formsubmit.co/ajax/ujjwalcse07@gmail.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            name: contactData.name,
            email: contactData.email,
            message: contactData.message,
            _subject: 'New Hire Me Lead on EasyUVerse',
            _cc: 'ujjwal@easyuverse.shop',
            _captcha: 'false',
          }),
        }).catch((err) => console.error('Formsubmit error:', err));
      } catch (fErr) {
        console.error('Formsubmit trigger error:', fErr);
      }

      setContactMsg('Message sent successfully! Ujjwal will contact you shortly.');
      setContactData({ name: '', email: '', message: '' });
    } catch (err) {
      alert('Failed to send message: ' + (err.response?.data?.message || err.message));
    } finally {
      setContactSending(false);
    }
  };

  const copyEmail = () => {
    navigator.clipboard.writeText('ujjwalcse07@gmail.com');
    alert('Email copied to clipboard: ujjwalcse07@gmail.com');
  };

  return (
    <div className="space-y-16 pb-16 relative overflow-hidden">
      {/* Top Announcement Banner */}
      {siteNotice && (
        <div className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white text-xs font-semibold py-2.5 px-4 text-center shadow-md flex items-center justify-center space-x-2">
          <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
          <span>{siteNotice}</span>
        </div>
      )}

      {/* Hero Section */}
      <section id="hero" className="relative pt-8 md:pt-14 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-xs border border-emerald-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span>Available for Freelance & Full-Stack Projects</span>
              </div>

              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.15]">
                Free Source Codes & Custom Development by{' '}
                <span className="bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                  EasyUVerse
                </span>
                <div className="h-14 sm:h-16 text-cyan-500 dark:text-cyan-400 font-mono text-2xl sm:text-4xl mt-2">
                  <span>{typewriterText}</span>
                  <span className="animate-pulse">|</span>
                </div>
              </h1>

              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-xl font-normal leading-relaxed">
                Free source codes for beginners to learn and build, premium production-ready web projects, custom website creation (School Management, Portals, Library Systems), and direct server hosting assistance.
              </p>

              {/* AI Assistant Solution Selector Widget */}
              <div className="p-3.5 bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-200 dark:border-slate-700/80 shadow-lg flex flex-wrap items-center gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0" />
                <select
                  value={aiHelperVal}
                  onChange={(e) => handleAiChange(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-gray-800 dark:text-gray-200 outline-none cursor-pointer flex-1"
                >
                  <option value="" className="bg-white dark:bg-slate-900">
                    What do you need help with? Select project type...
                  </option>
                  <option value="school" className="bg-white dark:bg-slate-900">
                    School Management Website & Admission Portal
                  </option>
                  <option value="portfolio" className="bg-white dark:bg-slate-900">
                    Personal Developer Portfolio & Resume
                  </option>
                  <option value="mern" className="bg-white dark:bg-slate-900">
                    Full Stack MERN SaaS Application
                  </option>
                  <option value="hosting" className="bg-white dark:bg-slate-900">
                    Server File Hosting & SSL Deployment
                  </option>
                </select>

                {aiOutput && (
                  <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 px-3 py-1 bg-cyan-500/10 rounded-xl">
                    {aiOutput}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/projects"
                  className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:opacity-95 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/20 flex items-center space-x-2 transition-all"
                >
                  <span>Explore Source Store</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="https://wa.me/919241034816"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-7 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-xl shadow-emerald-500/20 flex items-center space-x-2 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Hire Ujjwal (WhatsApp)</span>
                </a>
              </div>

              {/* Guarantees */}
              <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500 dark:text-gray-400 pt-3">
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                  <span>Verified Clean Source Code</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                  <span>Free Server Setup Included</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-cyan-500" />
                  <span>24/7 Developer Support</span>
                </span>
              </div>
            </div>

            {/* Right Hero Graphic & Developer Card */}
            <div className="lg:col-span-5 relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-slate-700/80 bg-slate-900 shadow-2xl group transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <img
                  src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"
                  alt="EasyUVerse Architecture"
                  className="w-full h-[420px] object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-6 flex flex-col justify-end">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="px-3 py-1 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-xs">
                      Lead Developer: Ujjwal Kant
                    </span>
                    <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-bold">
                      MERN Expert
                    </span>
                  </div>
                  <h3 className="font-extrabold text-xl text-white">
                    Full-Stack Software Architecture
                  </h3>
                  <p className="text-xs text-gray-300 mt-1">
                    Direct UPI QR & UTR Verification System • MongoDB Admin Control • Verified Code
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet The Developer Profile Section (High Conversion for Hiring) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-cyan-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl text-white">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-4 text-center md:text-left space-y-3">
              <div className="w-24 h-24 rounded-full bg-gradient-to-r from-cyan-400 to-indigo-500 p-1 mx-auto md:mx-0 shadow-lg">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-extrabold text-2xl text-cyan-400">
                  UK
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-extrabold">Ujjwal Kant</h3>
                <p className="text-xs text-cyan-400 font-bold">Full Stack MERN & Web Developer</p>
              </div>
              <div className="flex items-center justify-center md:justify-start space-x-1 text-amber-400 text-xs font-bold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
                <span className="text-white ml-2">4.9 / 5.0 Rating</span>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <h4 className="font-extrabold text-xl">Need a Custom Website or Server Hosting Support?</h4>
              <p className="text-sm text-gray-300 leading-relaxed">
                In my free time, I build web applications, publish free source codes for beginners to learn, and offer premium web templates. If you need a custom website (School Management System, School Portal, Library Software) or help hosting your site on a server, I am here to build and assist!
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-center text-xs">
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="font-extrabold text-cyan-400 block text-base">25+</span>
                  <span className="text-gray-400 text-[11px]">Projects Completed</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="font-extrabold text-purple-400 block text-base">100%</span>
                  <span className="text-gray-400 text-[11px]">Clean Source Code</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="font-extrabold text-emerald-400 block text-base">Free</span>
                  <span className="text-gray-400 text-[11px]">Server Installation</span>
                </div>
                <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                  <span className="font-extrabold text-amber-400 block text-base">24/7</span>
                  <span className="text-gray-400 text-[11px]">Direct Support</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="https://wa.me/919241034816"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Hire Ujjwal on WhatsApp</span>
                </a>
                <button
                  onClick={onOpenSupport}
                  className="px-6 py-2.5 rounded-xl border border-white/20 hover:bg-white/10 text-white font-extrabold text-xs"
                >
                  Send Inquiry Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Tech Marquee Ticker */}
      <section className="bg-slate-900/60 py-4 border-y border-white/10 overflow-hidden">
        <div className="flex space-x-6 animate-marquee whitespace-nowrap">
          {marqueeItems.concat(marqueeItems).map((item, idx) => (
            <span
              key={idx}
              className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-slate-800 border border-slate-700 text-gray-200 shrink-0"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Discount Coupons Bar */}
      {coupons && coupons.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-2 mb-4">
            <Tag className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
              Active Discount Coupons & Offers
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {coupons.map((c, idx) => (
              <div
                key={c._id || idx}
                className="p-4 bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-500/20 rounded-2xl flex items-center justify-between"
              >
                <div>
                  <span className="font-mono font-bold text-sm text-cyan-600 dark:text-cyan-400">
                    {c.code}
                  </span>
                  <p className="text-xs text-gray-600 dark:text-gray-300 mt-0.5">
                    {c.text || `${c.discountPercentage}% OFF (Max Discount: ₹${c.maxDiscount || 500})`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(c.code);
                    alert(`Copied Coupon Code: ${c.code}`);
                  }}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 text-xs font-bold shadow-sm hover:scale-105 transition-transform"
                  title="Copy Coupon"
                >
                  <Copy className="w-4 h-4 text-cyan-500" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Professional Services Section */}
      <section id="services-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest block mb-1">
            SERVICES OFFERED
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white">
            Professional Software Development Services
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Tailored software solutions designed for schools, businesses, and personal portfolios.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700/80 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-500">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                    {srv.price}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white">{srv.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {srv.desc}
                </p>

                <div className="space-y-1 pt-2">
                  {srv.highlights.map((h, i) => (
                    <div key={i} className="flex items-center space-x-1.5 text-xs text-gray-500 dark:text-gray-400">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-slate-700/60 mt-4 space-y-3">
                <div className="text-[11px] font-semibold text-gray-500 uppercase">
                  Tech: {srv.tech}
                </div>
                <button
                  onClick={onOpenSupport}
                  className="w-full py-2.5 rounded-xl border border-cyan-500 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 font-extrabold text-xs transition-all text-center"
                >
                  Hire Ujjwal For This Service
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Premium Source Codes Showcase */}
      <section id="premium-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-amber-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>FEATURED ASSETS</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Premium Source Codes Marketplace
            </h2>
          </div>
          <Link
            to="/projects"
            className="flex items-center space-x-1 text-sm font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <span>View All Premium</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-gray-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {premiumProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Free Community Source Codes Section */}
      <section id="free-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center space-x-1.5 text-emerald-500 text-xs font-bold uppercase tracking-wider mb-1">
              <Gift className="w-4 h-4" />
              <span>COMMUNITY REPOSITORIES</span>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
              Free Open Source Codes
            </h2>
          </div>
          <Link
            to="/projects?category=All"
            className="flex items-center space-x-1 text-sm font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View All Free</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {freeProjects.length > 0 ? (
            freeProjects.slice(0, 3).map((project) => (
              <div
                key={project._id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-emerald-500/30 p-5 shadow-sm space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-gray-900">
                    <img
                      src={project.thumbnail}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-extrabold bg-emerald-600 text-white">
                      FREE
                    </span>
                  </div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                    {project.shortDescription}
                  </p>
                </div>

                <div className="pt-3 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
                  <button
                    onClick={() => setSelectedModalProject(project)}
                    className="p-2 rounded-xl text-gray-500 hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-slate-700"
                    title="Quick Preview Modal"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <a
                    href={project.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Free</span>
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-8 bg-white dark:bg-slate-800 rounded-2xl text-center text-gray-400">
              Free source codes available in full catalog.
            </div>
          )}
        </div>
      </section>

      {/* YouTube Channel & Video Tutorials Section */}
      <section id="youtube-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full border-2 border-rose-500 p-0.5 shrink-0 overflow-hidden bg-slate-900 shadow-md">
              <img src="/logo.jpg" alt="Ujjwal's Code Channel Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-gray-900 dark:text-white">
                Ujjwal's Code
              </h3>
              <p className="text-xs text-gray-500">Web Development Tutorials & Free Source Code Demos</p>
            </div>
          </div>

          <a
            href="https://www.youtube.com/@ujjwalmehta1?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-lg shadow-rose-500/25 flex items-center space-x-2 shrink-0"
          >
            <Youtube className="w-4 h-4" />
            <span>Subscribe on YouTube</span>
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {youtubeVideos.map((vid, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video bg-gray-900 overflow-hidden">
                  <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                  <a
                    href={vid.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <div className="w-12 h-12 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                  </a>
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-bold text-base text-gray-900 dark:text-white">{vid.title}</h4>
                  <p className="text-xs text-gray-500 line-clamp-2">{vid.desc}</p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <a
                  href={vid.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 rounded-xl bg-rose-600/10 hover:bg-rose-600 text-rose-600 hover:text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Watch Video Tutorial</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Client Project Showcase */}
      <section id="showcase" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest block mb-1">
            CLIENT WORK
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Live Deployed Projects Showcase
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liveShowcases.map((sc, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 overflow-hidden shadow-sm group flex flex-col md:flex-row"
            >
              <img src={sc.thumb} alt={sc.title} className="w-full md:w-5/12 h-48 md:h-auto object-cover bg-gray-900" />
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white">{sc.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{sc.desc}</p>
                </div>
                <a
                  href={sc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
                >
                  <span>View Live Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white text-center">
          Frequently Asked Questions
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left font-bold text-sm text-gray-900 dark:text-white flex items-center justify-between"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="w-4 h-4 text-cyan-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                )}
              </button>

              {openFaq === idx && (
                <div className="p-4 pt-0 text-xs text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-slate-700/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Client Reviews & Feedback Form */}
      <section id="reviews" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest block mb-1">
            TESTIMONIALS
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Client Reviews & Rating Feedback
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.length > 0 ? (
            reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700/80 shadow-sm space-y-3"
              >
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(rev.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 italic">"{rev.review}"</p>
                <div className="pt-2 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between text-xs">
                  <span className="font-bold text-gray-900 dark:text-white">{rev.name}</span>
                  <span className="text-cyan-500 font-semibold">{rev.projectName}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 p-6 bg-white dark:bg-slate-800 rounded-2xl text-center text-xs text-gray-400">
              Be the first to rate your experience below!
            </div>
          )}
        </div>

        {/* Feedback Form */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-gray-200 dark:border-slate-700 p-6 sm:p-8 shadow-lg max-w-3xl mx-auto space-y-6">
          <h3 className="font-bold text-xl text-gray-900 dark:text-white text-center">
            Rate Your Experience with EasyUVerse
          </h3>

          {ratingSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 text-xs font-bold text-center">
              {ratingSuccess}
            </div>
          )}

          <form onSubmit={handleRatingSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={ratingData.name}
                  onChange={(e) => setRatingData({ ...ratingData, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm outline-none"
                  placeholder="Karan Kumar"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Rating Star
                </label>
                <select
                  value={ratingData.rating}
                  onChange={(e) => setRatingData({ ...ratingData, rating: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm outline-none"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5 Stars - Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (4 Stars - Good)</option>
                  <option value={3}>⭐⭐⭐ (3 Stars - Average)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Your Review Message
              </label>
              <textarea
                rows={3}
                required
                value={ratingData.review}
                onChange={(e) => setRatingData({ ...ratingData, review: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 text-sm outline-none"
                placeholder="Share your thoughts about code quality & support..."
              />
            </div>

            <button
              type="submit"
              disabled={ratingSubmitting}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-sm shadow-md transition-all disabled:opacity-50"
            >
              Submit Review
            </button>
          </form>
        </div>
      </section>

      {/* Contact & Let's Work Together Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-950 rounded-3xl border border-cyan-500/30 p-8 sm:p-12 text-white shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold">Let's Build Together</h2>
              <p className="text-sm text-gray-300 leading-relaxed">
                Need a custom MERN website, school management portal, or project bug fix? Contact Ujjwal directly!
              </p>

              <div className="space-y-4 text-sm">
                <div
                  onClick={copyEmail}
                  className="flex items-center space-x-3 p-3.5 bg-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <Copy className="w-5 h-5 text-cyan-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-gray-400">Email Me (Click to copy)</div>
                    <div className="font-bold">ujjwalcse07@gmail.com</div>
                  </div>
                </div>

                <a
                  href="https://wa.me/919241034816"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3 p-3.5 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                >
                  <PhoneCall className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[11px] text-gray-400">Direct WhatsApp</div>
                    <div className="font-bold">+91 9241034816</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Direct Message Form */}
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 space-y-4">
              <h3 className="font-bold text-lg text-white">Send Message to Ujjwal</h3>
              {contactMsg && (
                <div className="p-3 bg-emerald-500/20 text-emerald-300 text-xs font-bold rounded-xl text-center">
                  {contactMsg}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    value={contactData.name}
                    onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                    placeholder="Your Name"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white placeholder-gray-400 outline-none"
                  />
                  <input
                    type="email"
                    required
                    value={contactData.email}
                    onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                    placeholder="Your Email"
                    className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white placeholder-gray-400 outline-none"
                  />
                </div>

                <textarea
                  rows={4}
                  required
                  value={contactData.message}
                  onChange={(e) => setContactData({ ...contactData, message: e.target.value })}
                  placeholder="Describe your project requirement..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-white/10 text-sm text-white placeholder-gray-400 outline-none"
                />

                <button
                  type="submit"
                  disabled={contactSending}
                  className="w-full py-3.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{contactSending ? 'Sending...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action WhatsApp Button */}
      <a
        href="https://wa.me/919241034816"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
        title="Chat with Ujjwal on WhatsApp"
      >
        <PhoneCall className="w-6 h-6" />
      </a>

      {/* Quick Modal View */}
      {selectedModalProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                {selectedModalProject.title}
              </h3>
              <button
                onClick={() => setSelectedModalProject(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <img
              src={selectedModalProject.thumbnail}
              alt=""
              className="w-full h-48 object-cover rounded-xl bg-gray-900"
            />
            <p className="text-xs text-gray-600 dark:text-gray-300">
              {selectedModalProject.description}
            </p>
            <a
              href={selectedModalProject.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold text-sm flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download Source Code</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
