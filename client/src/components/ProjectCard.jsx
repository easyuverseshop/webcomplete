import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShoppingCart, Tag, Star, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project }) => {
  const hasDiscount =
    Boolean(project.discountPrice && project.discountPrice > 0 && project.discountPrice < project.price);

  const discountPercent = hasDiscount
    ? Math.round(((project.price - project.discountPrice) / project.price) * 100)
    : 0;

  const finalPrice = hasDiscount ? project.discountPrice : project.price;

  return (
    <div className="group bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Thumbnail Header */}
      <div className="relative aspect-video overflow-hidden bg-gray-900">
        <img
          src={project.thumbnail}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-600/90 text-white backdrop-blur-md shadow-sm">
            {project.category}
          </span>
          {project.isFeatured && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500 text-white backdrop-blur-md shadow-sm flex items-center space-x-1">
              <Star className="w-3 h-3 fill-current" />
              <span>Featured</span>
            </span>
          )}
        </div>

        {discountPercent > 0 && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-extrabold bg-rose-600 text-white shadow-sm">
            {discountPercent}% OFF
          </span>
        )}

        {project.demoUrl && (
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-3 right-3 p-2 rounded-xl bg-slate-900/80 text-white backdrop-blur-md hover:bg-indigo-600 transition-colors"
            title="View Live Demo"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/projects/${project.slug || project._id}`}>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1 mb-2">
              {project.title}
            </h3>
          </Link>
          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">
            {project.shortDescription || project.description}
          </p>

          {/* Tech stack tags */}
          {project.techStack && project.techStack.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.techStack.slice(0, 4).map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-slate-700/60 text-gray-600 dark:text-gray-300"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Price & Action */}
        <div className="pt-4 border-t border-gray-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                ₹{finalPrice}
              </span>
              {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">
                  ₹{project.price}
                </span>
              )}
            </div>
          </div>

          <Link
            to={`/projects/${project.slug || project._id}`}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 shadow-md shadow-indigo-500/20 transition-all"
          >
            <span>Buy Code</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
