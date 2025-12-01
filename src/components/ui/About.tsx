import Image from "next/image";
import { profile, education, awards } from "@/data/about"; // 데이터 import
import { GraduationCap, Trophy } from "lucide-react"; // 아이콘 import

export default function About() {
  return (
    <section id="about" className="py-20 border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* 1. 프로필 이미지 영역 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-64 h-80 rounded-xl overflow-hidden shadow-2xl mb-6">
            <Image 
              src="/images/profile.jpg" // 증명사진 경로
              alt="김창주" 
              fill 
              className="object-cover"
            />
          </div>
          
          {/* Contact 정보 (모바일에서도 잘 보이게) */}
          <div className="w-full space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex justify-between border-b pb-2 dark:border-gray-800">
              <span className="font-bold">Born</span>
              <span>1998.09.21</span>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-800">
              <span className="font-bold">Tel</span>
              <a href="tel:010-9675-9698" className="hover:text-blue-500">010-9675-9698</a>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-800">
              <span className="font-bold">Email</span>
              <a href="mailto:micayell98@naver.com" className="hover:text-blue-500">micayell98@naver.com</a>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-800">
              <span className="font-bold">Github</span>
              <a href="https://github.com/micayell" target="_blank" className="hover:text-blue-500">@micayell</a>
            </div>
          </div>
        </div>

        {/* 2. 자기소개 텍스트 */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-8 leading-tight">
            안녕하십니까.<br />
            <span className="text-blue-600">변화의 흐름을 읽고 민첩하게 나아가는</span><br />
            개발자 <span className="text-black dark:text-white">김창주</span>입니다.
          </h2>
          
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
            <p>
              R과 SAS를 활용한 통계 분석으로 데이터의 의미를 파고들던 경험은, 
              논리적인 문제 해결 능력의 밑거름이 되었습니다.
            </p>
            <p>
              SSAFY를 통해 개발의 즐거움을 알게 된 후, 다양한 기술 스택을 빠르게 습득하며 
              성장하는 과정 자체를 즐기고 있습니다.
            </p>
            <p>
              데이터 분석가의 시각과 개발자의 기술력을 겸비하여 
              어떤 문제든 해결해 나가는 인재가 되겠습니다.
            </p>
          </div>

          {/* 학력/경력 요약 (선택사항) */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 dark:bg-zinc-900 p-5 rounded-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                Education
              </h3>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                <li>
                  <span className="block font-medium text-black dark:text-white">삼성청년 SW•AI 아카데미</span>
                  2025.01 ~ 2025.05 (1학기 수료)
                </li>
                <li>
                  <span className="block font-medium text-black dark:text-white">전남대학교 (산업공학)</span>
                  2017.03 ~ 2024.08 (학사 졸업)
                </li>
              </ul>
            </div>
             <div className="bg-gray-50 dark:bg-zinc-900 p-5 rounded-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Awards & Cert
              </h3>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                <li>SSAFY 자율/특화 프로젝트 우수상 (2회)</li>
                <li>정보처리기사 (2024.06)</li>
                <li>재무빅데이터분석사 2급</li>
                <li>OPIc IM1 / TOEIC 810</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}