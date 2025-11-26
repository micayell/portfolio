import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-20 border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row gap-12 items-center">
        
        {/* 1. 프로필 이미지 영역 */}
        <div className="relative w-64 h-64 shrink-0">
          <div className="absolute inset-0 bg-blue-100 dark:bg-blue-900 rounded-full blur-2xl opacity-50"></div>
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
            {/* 이미지가 있다면 경로 수정, 없다면 placeholder */}
            <Image 
              src="/images/profile.jpg" 
              alt="Profile" 
              fill 
              className="object-cover"
            />
            {/* 이미지 없을 때 임시용 (이미지 넣으면 삭제) */}
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              No Image
            </div>
          </div>
        </div>

        {/* 2. 텍스트 영역 */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-bold mb-6 flex items-center justify-center md:justify-start gap-2">
            About Me 
            <span className="text-2xl">👋</span>
          </h2>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            안녕하세요! <strong className="text-black dark:text-white">사용자 경험을 최우선</strong>으로 생각하는 프론트엔드 개발자 OOO입니다.
            <br />
            복잡한 문제를 단순하게 해결하는 것을 좋아하며, 새로운 기술을 배우고 공유하는 즐거움을 압니다.
            팀원과의 원활한 소통을 통해 함께 성장하는 개발 문화를 지향합니다.
          </p>

          {/* 3. 인적 사항 그리드 */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto md:mx-0">
            <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg">
              <span className="block text-sm text-gray-500 mb-1">Name</span>
              <span className="font-medium">김싸피</span>
            </div>
            <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg">
              <span className="block text-sm text-gray-500 mb-1">Email</span>
              <span className="font-medium">ssafy@example.com</span>
            </div>
            <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg">
              <span className="block text-sm text-gray-500 mb-1">Github</span>
              <a href="https://github.com/..." target="_blank" className="font-medium hover:text-blue-500 transition">
                @micayell
              </a>
            </div>
            <div className="bg-gray-50 dark:bg-zinc-900 p-4 rounded-lg">
              <span className="block text-sm text-gray-500 mb-1">Role</span>
              <span className="font-medium">Frontend Dev</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}