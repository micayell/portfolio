import Image from "next/image";
import { profile, education, awards } from "@/data/about"; // 데이터 import
import { GraduationCap, Trophy } from "lucide-react";
import { getImagePath } from "@/lib/utils";

export default function About() {
  return (
    <section id="about" className="py-20 border-b border-gray-200 dark:border-gray-800">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        
        {/* 1. 프로필 이미지 영역 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-64 h-80 rounded-xl overflow-hidden shadow-2xl mb-6">
            <Image 
              src={getImagePath("/images/profile.jpg")}
              alt={profile.name}
              fill 
              className="object-cover"
            />
          </div>
          
          <div className="w-full space-y-3 text-sm text-gray-600 dark:text-gray-400">
            {/* <div className="flex justify-between border-b pb-2 dark:border-gray-800">
              <span className="font-bold">Born</span>
              <span>{profile.birth}</span>
            </div> */}
            {/* 전화번호 삭제됨 */}
            <div className="flex justify-between border-b pb-2 dark:border-gray-800">
              <span className="font-bold">Email</span>
              <a href={`mailto:${profile.email}`} className="hover:text-blue-500">{profile.email}</a>
            </div>
            <div className="flex justify-between border-b pb-2 dark:border-gray-800">
              <span className="font-bold">Github</span>
              <a href={profile.github} target="_blank" className="hover:text-blue-500">@micayell</a>
            </div>
          </div>
        </div>

        {/* 2. 자기소개 텍스트 */}
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-8 leading-tight">
            안녕하십니까.<br />
            <span className="text-blue-600">변화의 흐름을 읽고 민첩하게 나아가는</span><br />
            개발자 <span className="text-black dark:text-white">{profile.name}</span>입니다.
          </h2>
          
          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4 leading-relaxed">
            {profile.description.map((desc, index) => (
              <p key={index}>{desc}</p>
            ))}
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education */}
            <div className="bg-gray-50 dark:bg-zinc-900 p-5 rounded-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                Education
              </h3>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                {education.map((edu, index) => (
                  <li key={index}>
                    <span className="block font-medium text-black dark:text-white">{edu.school}</span>
                    {edu.period}
                  </li>
                ))}
              </ul>
            </div>

            {/* Awards */}
             <div className="bg-gray-50 dark:bg-zinc-900 p-5 rounded-xl">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Awards & Cert
              </h3>
              <ul className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                {awards.map((award, index) => (
                  <li key={index}>
                    {award.title} {award.date && `(${award.date})`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}