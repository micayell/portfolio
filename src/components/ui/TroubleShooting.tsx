"use client"; // 👈 클라이언트 컴포넌트 선언

import { useState } from "react";
import { AlertTriangle, CheckCircle2, ChevronDown, Terminal } from "lucide-react";

interface TroubleShootingItemProps {
  ts: {
    problem: string;
    solution: string;
    result: string;
  };
  index: number;
}

function TroubleShootingItem({ ts, index }: TroubleShootingItemProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="border border-gray-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-950 transition-all duration-300 hover:border-blue-500/50">
      {/* 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center justify-center w-8 h-8 rounded bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400 font-mono text-sm font-bold">
            {String(index + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg leading-tight">
              {ts.problem}
            </h3>
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* 본문 */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="p-5 pt-0 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/20">
          
          {/* Solution */}
          <div className="mt-4 bg-zinc-900 text-gray-300 p-4 rounded-lg font-mono text-sm shadow-inner border border-zinc-800">
            <div className="flex items-center gap-2 mb-2 text-blue-400 border-b border-zinc-700 pb-2">
              <Terminal className="w-4 h-4" />
              <span className="font-bold">Solution</span>
            </div>
            <p className="leading-relaxed text-zinc-300">
              $ {ts.solution}
            </p>
          </div>

          {/* Result */}
          <div className="mt-4 flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/20">
            <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="block text-xs font-bold text-green-700 dark:text-green-300 mb-1 uppercase tracking-wider">Result</span>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {ts.result}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function TroubleShooting({ items }: { items: any[] }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
        <AlertTriangle className="w-6 h-6 text-orange-500" />
        Trouble Shooting
      </h2>
      <div className="grid gap-4">
        {items.map((ts, index) => (
          <TroubleShootingItem key={index} ts={ts} index={index} />
        ))}
      </div>
    </section>
  );
}
