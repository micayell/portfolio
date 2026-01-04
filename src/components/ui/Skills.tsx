import { skills } from "@/data/skills";

export default function Skills() {
  return (
    <section id="skills" className="py-20 max-w-5xl mx-auto border-t border-gray-100 dark:border-zinc-900">
      <div className="mb-12">
        <h2 className="text-4xl font-light mb-4 inline-block border-b border-gray-300 pb-2">
          Skills
        </h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2 font-light tracking-wide">
          Technical tools and methodologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
        {Object.entries(skills).map(([category, items]) => {
          return (
            <div key={category} className="group">
              <h3 className="museum-label text-black dark:text-white mb-6 border-b border-black/10 dark:border-white/10 pb-2">
                {category}
              </h3>
              
              <ul className="space-y-3">
                {items.map((skill) => (
                  <li 
                    key={skill} 
                    className="flex items-center justify-between text-gray-600 dark:text-gray-400 font-light group-hover:text-black dark:group-hover:text-white transition-colors duration-300"
                  >
                    <span>{skill}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-zinc-700 group-hover:bg-blue-500 transition-colors" />
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
