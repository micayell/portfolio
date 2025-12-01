import { skills } from "@/data/skills"; // 데이터 import

export default function Skills() {
  return (
    <section id="skills" className="py-20 border-b border-gray-200 dark:border-gray-800">
      <h2 className="text-3xl font-bold mb-10">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {Object.entries(skills).map(([category, items]) => (
          <div key={category}>
            <h3 className="text-lg font-semibold mb-4 text-blue-600 dark:text-blue-400">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {items.map((skill) => (
                <span key={skill} className="px-3 py-1.5 bg-gray-100 dark:bg-zinc-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}