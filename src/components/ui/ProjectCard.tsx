import Link from 'next/link';
import Image from 'next/image'; // Image 컴포넌트 import
import { Project } from '@/types/project';

type ProjectProps = Pick<Project, "id" | "title" | "description" | "tags" | "thumbnailUrl">;

export default function ProjectCard({ id, title, description, tags, thumbnailUrl }: ProjectProps) {
  return (
    <Link 
      href={`/projects/${id}`}
      className="block border rounded-lg overflow-hidden hover:shadow-lg transition dark:border-gray-700 bg-white dark:bg-zinc-900 group"
    >
      {/* 이미지 영역 추가 */}
      <div className="relative w-full h-48 bg-gray-100 dark:bg-zinc-800">
        {thumbnailUrl ? (
          <Image
            src={thumbnailUrl}
            alt={title}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300" // cover -> contain 변경
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 text-sm">
          {description}
        </p>
        <div className="flex flex-wrap gap-2">
          {tags.map(tag => (
            <span key={tag} className="bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded text-xs text-gray-600 dark:text-gray-300">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
