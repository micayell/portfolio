import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-black/80 dark:border-gray-800">
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold">My Portfolio</Link>
        <ul className="flex gap-4">
          <li><Link href="/#projects">Projects</Link></li>
        </ul>
      </nav>
    </header>
  );
}