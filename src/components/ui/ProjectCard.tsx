import Link from 'next/link';

interface ProjectProps {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

export default function ProjectCard({ id, title, description, tags }: ProjectProps) {
  return (
    <Link 
      href={`/projects/${id}`}
      className="block border rounded-lg p-5 hover:shadow-lg transition dark:border-gray-700"
    >
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
      <div className="flex gap-2">
        {tags.map(tag => (
          <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-xs">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}