const Project = require('../models/Project');

const createSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-');
};

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { category, search, featured, sort, limit = 50, page = 1 } = req.query;
    let query = { isPublished: true };

    if (category && category !== 'All' && category !== 'ALL') {
      query.category = category;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { techStack: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price-low') sortOption = { price: 1 };
    if (sort === 'price-high') sortOption = { price: -1 };
    if (sort === 'popular') sortOption = { salesCount: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Project.countDocuments(query);
    const projects = await Project.find(query)
      .sort(sortOption)
      .limit(Number(limit))
      .skip(skip);

    res.json({
      success: true,
      count: projects.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      projects,
      data: projects,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single project by ID or Slug
// @route   GET /api/projects/:idOrSlug
// @access  Public
const getProjectByIdOrSlug = async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let project;

    if (idOrSlug.match(/^[0-9a-fA-F]{24}$/)) {
      project = await Project.findById(idOrSlug);
    }

    if (!project) {
      project = await Project.findOne({ slug: idOrSlug });
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new project (Admin)
// @route   POST /api/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      category,
      price,
      discountPrice,
      demoUrl,
      downloadUrl,
      thumbnail,
      screenshots,
      techStack,
      features,
      isFeatured,
      isPublished,
    } = req.body;

    const finalShortDesc = shortDescription || description || title;
    const finalFullDesc = description || shortDescription || title;

    if (!title || price === undefined || !downloadUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in Project Title, Price, and Upload ZIP download link',
      });
    }

    let slug = createSlug(title);
    const slugExists = await Project.findOne({ slug });
    if (slugExists) {
      slug = `${slug}-${Date.now()}`;
    }

    const project = await Project.create({
      title,
      slug,
      description: finalFullDesc,
      shortDescription: finalShortDesc,
      category: category || 'Full Stack MERN',
      price,
      discountPrice: discountPrice || 0,
      demoUrl: demoUrl || '',
      downloadUrl,
      thumbnail: thumbnail || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      screenshots: Array.isArray(screenshots) ? screenshots : [],
      techStack: Array.isArray(techStack) ? techStack : [],
      features: Array.isArray(features) ? features : [],
      isFeatured: isFeatured || false,
      isPublished: isPublished !== undefined ? isPublished : true,
    });

    res.status(201).json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project (Admin)
// @route   PUT /api/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (req.body.title && req.body.title !== project.title) {
      req.body.slug = createSlug(req.body.title);
    }

    if (req.body.shortDescription && !req.body.description) {
      req.body.description = req.body.shortDescription;
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      data: project,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project (Admin)
// @route   DELETE /api/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectByIdOrSlug,
  createProject,
  updateProject,
  deleteProject,
};
