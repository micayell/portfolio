"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Project } from "@/types/project";
import { X, Github, ExternalLink, Award, Figma } from "lucide-react";
import Image from "next/image";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  if (!project) return null;

  return (
    <AnimatePresence>
      {project && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-x-4 top-[5%] bottom-[5%] md:inset-x-[10%] md:top-[10%] md:bottom-[10%] z-50 flex flex-col pointer-events-none"
          >
            <div className="bg-white dark:bg-zinc-900 w-full h-full max-w-5xl mx-auto shadow-2xl overflow-hidden rounded-sm flex flex-col pointer-events-auto border border-gray-100 dark:border-zinc-800">
              
              {/* Header */}
              <div className="flex justify-between items-start p-6 md:p-8 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="museum-label text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900/30 px-2 py-0.5 rounded-full text-[10px]">
                      PROJECT
                    </span>
                    {project.award && (
                      <span className="flex items-center gap-1 text-amber-500 text-xs font-medium bg-amber-50 dark:bg-amber-900/10 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/30">
                        <Award className="w-3 h-3" />
                        {project.award}
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100">
                    {project.title}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 mt-1 font-light">
                    {project.description}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-12">
                
                {/* 1. Overview Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                  <div className="col-span-1 space-y-6">
                    {project.thumbnailUrl && (
                      <div className="aspect-video relative bg-gray-100 dark:bg-zinc-800 overflow-hidden rounded-sm">
                        <Image 
                          src={project.thumbnailUrl} 
                          alt={project.title} 
                          fill 
                          className="object-cover" 
                        />
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-3">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-black text-sm font-medium hover:opacity-90 transition-opacity rounded-sm"
                        >
                          <Github className="w-4 h-4" />
                          GitHub
                        </a>
                      )}
                      {project.figmaUrl && (
                        <a
                          href={project.figmaUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium rounded-sm"
                        >
                          <Figma className="w-4 h-4" />
                          Figma
                        </a>
                      )}
                      {project.demoUrl && (
                        <a
                          href={project.demoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors text-sm font-medium rounded-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Demo
                        </a>
                      )}
                    </div>

                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-zinc-800">
                      <div>
                        <div className="museum-label">Period</div>
                        <div className="text-sm">{project.overview.period}</div>
                      </div>
                      <div>
                        <div className="museum-label">Role</div>
                        <div className="text-sm">{project.overview.role}</div>
                      </div>
                      <div>
                        <div className="museum-label">Members</div>
                        <div className="text-sm">{project.overview.members}</div>
                      </div>
                      <div>
                        <div className="museum-label">Tech Stack</div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {project.tags.map((tag) => (
                            <span 
                              key={tag} 
                              className="px-2 py-1 bg-gray-100 dark:bg-zinc-800 text-xs text-gray-600 dark:text-gray-300 rounded-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-1 md:col-span-2 space-y-10">
                    <section>
                      <h3 className="museum-heading text-xl mb-3">Project Overview</h3>
                      <div className="space-y-4 text-gray-600 dark:text-gray-300 leading-relaxed">
                        <p><strong className="text-black dark:text-white font-medium">Goal:</strong> {project.overview.goal}</p>
                        <p><strong className="text-black dark:text-white font-medium">Background:</strong> {project.overview.background}</p>
                      </div>
                    </section>

                    <section>
                      <h3 className="museum-heading text-xl mb-3">Key Features</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {project.features.map((feature, i) => (
                          <div key={i} className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-sm border border-gray-100 dark:border-zinc-800">
                            <h4 className="font-medium mb-2">{feature.title}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <h3 className="museum-heading text-xl mb-3">Technical Decisions</h3>
                      <ul className="space-y-3">
                        {project.skills.map((skill, i) => (
                          <li key={i} className="flex gap-3">
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                            <div>
                              <span className="font-medium block text-gray-900 dark:text-gray-100">{skill.name}</span>
                              <span className="text-sm text-gray-600 dark:text-gray-400">{skill.reason}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </section>

                    {project.troubleShooting && (
                      <section>
                        <h3 className="museum-heading text-xl mb-3">Troubleshooting</h3>
                        <div className="space-y-4">
                          {project.troubleShooting.map((item, i) => (
                            <div key={i} className="border-l-2 border-gray-200 dark:border-zinc-700 pl-4 py-1">
                              <h4 className="font-medium text-red-500/80 mb-1">Problem: {item.problem}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2"><strong>Solution:</strong> {item.solution}</p>
                              <p className="text-sm text-blue-600/80 dark:text-blue-400/80"><strong>Result:</strong> {item.result}</p>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

