const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Project = require('../models/Project');
const Order = require('../models/Order');
const SiteSetting = require('../models/SiteSetting');
const Feedback = require('../models/Feedback');
const Service = require('../models/Service');
const Showcase = require('../models/Showcase');
const YouTubeVideo = require('../models/YouTubeVideo');
const Coupon = require('../models/Coupon');
const ClientLead = require('../models/ClientLead');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/easyuverse');
    console.log('MongoDB Connected for Seeding...');
  } catch (error) {
    console.error(`DB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

const realProjects = [
  {
    title: 'EasyUVerse Full Stack MERN E-Commerce Marketplace',
    slug: 'easyuverse-full-stack-mern-ecommerce-marketplace',
    description: 'Complete production-ready MERN stack digital marketplace platform. Features JWT authentication, direct UPI QR & UTR payment verification system, full admin panel, order ledger, project CRUD manager, user management, support desk, and dynamic multi-theme switching.',
    shortDescription: 'Production-ready MERN Marketplace with UPI QR Payments & Full Admin Panel.',
    category: 'Full Stack MERN',
    price: 1999,
    discountPrice: 1299,
    demoUrl: 'https://ujjwal.page.gd',
    downloadUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/easyuverse_mern_marketplace.zip',
    fileFormat: '.ZIP Source Code',
    fileSize: '24.8 MB',
    setupCommand: 'npm install && npm run dev',
    thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    techStack: ['React 18', 'Vite', 'Node.js', 'Express.js', 'MongoDB', 'Tailwind CSS', 'UPI QR & UTR'],
    features: ['JWT Auth', 'Direct UPI QR', 'Full Admin Panel', 'Order Ledger', 'Support Desk', 'Multi-Theme Switcher'],
    isFeatured: true,
    isPublished: true,
    salesCount: 14,
  },
  {
    title: 'PHP & MySQL School Management & Admission Portal',
    slug: 'php-mysql-school-management-admission-portal',
    description: 'Complete PHP & MySQL school portal. Features online admission forms, notice board, student results, photo gallery, staff logins, and responsive Bootstrap 5 theme.',
    shortDescription: 'PHP & MySQL School Portal with Online Admissions & Admin Dashboard.',
    category: 'PHP & MySQL',
    price: 1499,
    discountPrice: 899,
    demoUrl: 'https://deekshaconvent.page.gd',
    downloadUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/php_school_portal.zip',
    fileFormat: '.ZIP Source Code',
    fileSize: '18.2 MB',
    setupCommand: 'Import database.sql -> Configure config.php -> Run on Apache / XAMPP / Hostinger',
    thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80'
    ],
    techStack: ['PHP 8.2', 'MySQL', 'PDO', 'Bootstrap 5', 'JavaScript', 'HTML5/CSS3'],
    features: ['Online Admission Form', 'Notice & News Board', 'Student Results Search', 'Admin Content Manager', 'XAMPP/Hostinger Ready'],
    isFeatured: true,
    isPublished: true,
    salesCount: 8,
  },
  {
    title: 'Responsive Developer Portfolio Template',
    slug: 'responsive-developer-portfolio-template',
    description: 'Lightweight, ultra-fast static developer portfolio website built with HTML5, CSS3, JavaScript, and Tailwind CSS. Features interactive dark mode, project grid filter, and copy-paste layout.',
    shortDescription: 'Ultra-fast HTML, CSS & JavaScript developer portfolio template.',
    category: 'HTML CSS JS',
    price: 0,
    discountPrice: 0,
    demoUrl: 'https://ujjwalsiteco.netlify.app/',
    downloadUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/html_css_js_portfolio.zip',
    fileFormat: '.ZIP Source Code',
    fileSize: '6.5 MB',
    setupCommand: 'Open index.html in browser or host on Netlify / GitHub Pages',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    screenshots: [],
    techStack: ['HTML5', 'CSS3', 'JavaScript ES6+', 'Tailwind CSS'],
    features: ['Zero Dependencies', 'Instant Load', 'Dark/Light Toggle', 'GitHub Pages Ready'],
    isFeatured: true,
    isPublished: true,
    salesCount: 42,
  },
  {
    title: 'Python Automated UTR Verification & Webhook Bot',
    slug: 'python-automated-utr-verification-webhook-bot',
    description: 'Python 3 script suite for logging UPI transaction reference numbers, validating UTR formats, issuing webhook notifications, and triggering automatic digital download delivery.',
    shortDescription: 'Python automation tool for UPI UTR logging & instant delivery.',
    category: 'Python & Automation',
    price: 799,
    discountPrice: 399,
    demoUrl: '',
    downloadUrl: 'https://res.cloudinary.com/demo/raw/upload/v1/python_utr_bot.zip',
    fileFormat: '.ZIP Source Code',
    fileSize: '4.1 MB',
    setupCommand: 'pip install -r requirements.txt && python main.py',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    screenshots: [],
    techStack: ['Python 3', 'Requests', 'Flask', 'REST APIs'],
    features: ['CLI & Web Interface', 'Automated Webhooks', 'Log History', 'Instant Download Trigger'],
    isFeatured: false,
    isPublished: true,
    salesCount: 19,
  },
];

const sampleServices = [
  {
    title: 'Full Stack Web App Development',
    startingPrice: 2999,
    techStack: ['MERN', 'Node.js', 'React', 'MongoDB', 'Tailwind'],
    shortDescription: 'End-to-end custom web application built from scratch with modern responsive UI and REST APIs.',
    iconName: 'Globe',
    isAvailable: true,
  },
  {
    title: 'PHP & MySQL Portal Customization',
    startingPrice: 1499,
    techStack: ['PHP 8.2', 'MySQL', 'Bootstrap', 'JavaScript'],
    shortDescription: 'Custom PHP web systems, admin dashboards, database integrations, and hosting setup.',
    iconName: 'Database',
    isAvailable: true,
  },
  {
    title: 'UPI Payment & Automated Delivery Setup',
    startingPrice: 999,
    techStack: ['Express.js', 'Node.js', 'Python', 'QR Code'],
    shortDescription: 'Integrate instant 12-digit UTR validation & automated zip file delivery into your platform.',
    iconName: 'QrCode',
    isAvailable: true,
  },
];

const sampleShowcase = [
  {
    title: 'EasyUVerse E-Commerce Platform',
    demoUrl: 'https://ujjwal.page.gd',
    githubUrl: 'https://github.com/ujjwalkant',
    thumbnail: 'https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&w=800&q=80',
    category: 'Full Stack MERN',
    techStack: ['React', 'Node.js', 'MongoDB', 'Tailwind'],
    description: 'Production digital source code store with direct UPI QR payments.',
    isFeatured: true,
  },
  {
    title: 'Deeksha Convent School Portal',
    demoUrl: 'https://deekshaconvent.page.gd',
    githubUrl: 'https://github.com/ujjwalkant',
    thumbnail: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
    category: 'PHP & MySQL',
    techStack: ['PHP', 'MySQL', 'Bootstrap'],
    description: 'School admission & notice management portal.',
    isFeatured: true,
  },
];

const sampleVideos = [
  {
    title: 'EasyUVerse Platform Full Walkthrough & Admin Tutorial',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    youtubeId: 'dQw4w9WgXcQ',
    category: 'Platform Walkthrough',
    description: 'Learn how to manage projects, verify UTR payments, setup UPI QR, and configure services.',
    duration: '12:45',
  },
];

const sampleCoupons = [
  {
    code: 'EASY20',
    discountPercentage: 20,
    maxDiscount: 500,
    isActive: true,
  },
  {
    code: 'UJJWAL50',
    discountPercentage: 50,
    maxDiscount: 1000,
    isActive: true,
  },
];

const sampleLeads = [
  {
    name: 'Rohan Sharma',
    email: 'rohan@example.com',
    phone: '9876543210',
    serviceType: 'Full Stack MERN Web App',
    budget: '₹5,000 - ₹10,000',
    message: 'Need a custom MERN marketplace for selling digital templates with UPI payment verification.',
    status: 'New',
  },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await User.deleteMany();
    await Project.deleteMany();
    await SiteSetting.deleteMany();
    await Feedback.deleteMany();
    await Service.deleteMany();
    await Showcase.deleteMany();
    await YouTubeVideo.deleteMany();
    await Coupon.deleteMany();
    await ClientLead.deleteMany();

    try {
      await mongoose.connection.collection('orders').drop();
    } catch (e) {
      console.log('Orders collection reset.');
    }

    console.log('Seeding Admin User: ujjwal@easyuverse.shop / Ujjwal@92419523...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('Ujjwal@92419523', salt);

    await User.create({
      name: "Ujjwal Kant",
      email: "ujjwal@easyuverse.shop",
      password: adminPassword,
      role: 'admin',
    });

    console.log('Seeding Real Tech Projects...');
    await Project.insertMany(realProjects);

    console.log('Seeding Services...');
    await Service.insertMany(sampleServices);

    console.log('Seeding Showcase Gallery...');
    await Showcase.insertMany(sampleShowcase);

    console.log('Seeding YouTube Videos...');
    await YouTubeVideo.insertMany(sampleVideos);

    console.log('Seeding Coupons...');
    await Coupon.insertMany(sampleCoupons);

    console.log('Seeding Initial Client Leads...');
    await ClientLead.insertMany(sampleLeads);

    console.log('Seeding Site Settings for Ujjwal Kant...');
    await SiteSetting.create({
      siteName: 'EasyUVerse',
      tagline: 'Free Source Codes for Beginners, Premium Web Projects & Custom Development & Hosting Assistance',
      contactEmail: 'ujjwal@easyuverse.shop',
      contactPhone: '+91 9241034816',
      bannerNotice: '🚀 Welcome to EasyUVerse! Scan UPI QR & enter 12-digit UTR for instant zip source code downloads.',
      upiId: '9241034816@mbkns',
      upiName: 'Ujjwal Kant / EasyUVerse',
      autoApproveUtr: true,
      supportEnabled: true,
      visitorCount: 1,
      socialLinks: {
        github: 'https://github.com/ujjwalkant',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
        youtube: 'https://youtube.com',
        whatsapp: 'https://wa.me/919241034816',
        telegram: 'https://t.me',
      },
    });

    console.log('Seeding Real Feedback...');
    await Feedback.create({
      name: 'Karan Kumar',
      projectName: 'EasyUVerse Platform',
      rating: 5,
      review: 'Clean code by Ujjwal Kant, instant zip downloads, and direct developer support via UPI!',
      isApproved: true,
    });

    console.log('Seeding completed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
