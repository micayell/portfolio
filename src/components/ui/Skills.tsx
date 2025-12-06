import { skills } from "@/data/skills";
import { 
  Code2,       // Programming
  Layout,      // Front-End, UI/UX
  Server,      // Back-End
  Database,    // Database
  LineChart,   // Data Analysis
  Cloud,       // Infra
  Users,       // Collaboration
} from "lucide-react"; 

// ▼ 카테고리 이름에 맞춰 아이콘 매핑 수정
const iconMap: Record<string, React.ElementType> = {
  "Programming": Code2,
  "Front-End": Layout,
  "Back-End": Server,
  "Database": Database,
  "Data Analysis": LineChart,
  "Infra": Cloud,
  "Collaboration": Users,
  "UI/UX": Layout, // Figma 등은 Layout 아이콘 재사용
};

export default function Skills() {
  return (
    <section id="skills" className="py-32 border-b border-gray-200 dark:border-gray-800 scroll-mt-16">
      <div className="mb-12 text-center md:text-left">
        <h2 className="text-4xl font-bold mb-4 inline-block border-b-4 border-blue-500 pb-2">
          Skills
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-4 text-lg">
          다양한 기술 스택을 보유하고 있으며, 상황에 맞는 최적의 도구를 선택하여 사용합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skills).map(([category, items]) => {
          // 해당 카테고리에 맞는 아이콘을 가져오거나 없으면 기본값(Code2) 사용
          const Icon = iconMap[category] || Code2;
          
          return (
            <div 
              key={category} 
              className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-zinc-800 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 bg-white dark:bg-zinc-800 rounded-lg shadow-sm ring-1 ring-gray-100 dark:ring-zinc-700">
                  <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                  {category}
                </h3>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {items.map((skill) => (
                  <span 
                    key={skill} 
                    className="px-3 py-1.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}