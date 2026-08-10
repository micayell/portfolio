import Link from 'next/link';
import Image from 'next/image';
import { Project } from '@/types/project';
import { getImagePath } from '@/lib/utils';
import { FaGithub, FaTrophy, FaFigma } from 'react-icons/fa';

type ProjectProps = Pick<Project, "id" | "title" | "description" | "tags" | "thumbnailUrl" | "award" | "githubUrl" | "figmaUrl">;

export default function ProjectCard({ id, title, description, tags, thumbnailUrl, award, githubUrl, figmaUrl }: ProjectProps) {
  return (
    <div className="group relative block border rounded-lg overflow-hidden hover:shadow-lg transition dark:border-gray-700 bg-white dark:bg-zinc-900">
      <Link href={`/projects/${id}`} className="absolute inset-0 z-0" />
      
      <div className="relative w-full h-40 sm:h-48 bg-gray-100 dark:bg-zinc-800">
        {thumbnailUrl ? (
          <Image
            src={getImagePath(thumbnailUrl)}
            alt={title}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image
          </div>
        )}
         {award && (
          <div className="absolute top-2 left-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1 z-10 border border-yellow-200 dark:border-yellow-700">
            <FaTrophy className="w-3 h-3" />
            <span>우수</span>
          </div>
        )}
      </div>

      <div className="p-4 sm:p-5 relative z-10 pointer-events-none">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="text-lg sm:text-xl font-bold group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          
          <div className="flex gap-1 shrink-0">
            {figmaUrl && (
              <a 
                href={figmaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto p-1.5 text-gray-400 hover:text-[#F24E1E] transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
                onClick={(e) => e.stopPropagation()}
                title="Figma Design"
              >
                <FaFigma className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}

            {githubUrl && (
              <a 
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pointer-events-auto p-1.5 text-gray-400 hover:text-black dark:hover:text-white transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800 rounded"
                onClick={(e) => e.stopPropagation()}
                title="GitHub"
              >
                <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
          </div>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-xs sm:text-sm">
          {description}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {tags.map(tag => (
            <span key={tag} className="bg-gray-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-[10px] sm:text-xs text-gray-600 dark:text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}