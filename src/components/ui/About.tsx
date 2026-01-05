import Image from "next/image";
import { profile, education, awards } from "@/data/about"; // 데이터 import
import { getImagePath } from "@/lib/utils";

export default function About() {
  return (
    <section id="about" className="py-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-16 items-start">

        {/* 1. 프로필 이미지 영역 - 액자 스타일 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-full aspect-[3/4] bg-gray-100 dark:bg-zinc-800 p-4 shadow-sm">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={getImagePath("/images/profile.jpg")}
                alt={profile.name}
                fill
                className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>

          <div className="w-full mt-6 space-y-2 text-xs uppercase tracking-widest text-gray-500 dark:text-gray-400">
            <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
              <span>Email</span>
              <a href={`mailto:${profile.email}`} className="hover:text-black dark:hover:text-white transition-colors normal-case tracking-normal">{profile.email}</a>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
              <span>Github</span>
              <a href={profile.github} target="_blank" className="hover:text-black dark:hover:text-white transition-colors normal-case tracking-normal">@micayell</a>
            </div>
            <div className="flex justify-between border-b border-gray-100 dark:border-zinc-800 pb-2">
              <span>Blog</span>
              <a href={profile.blog} target="_blank" className="hover:text-black dark:hover:text-white transition-colors normal-case tracking-normal">Link</a>
            </div>
          </div>
        </div>

        {/* 2. 자기소개 텍스트 - 전시 설명 스타일 */}
        <div className="flex-1">
          <h2 className="text-3xl md:text-5xl font-light mb-10 leading-tight tracking-tight">
            <span className="block text-gray-400 dark:text-gray-500 text-lg mb-2 uppercase tracking-widest font-normal">
              Engineer's Philosophy
            </span>            I build digital experiences<br />
            that bridge <span className="font-normal italic">gap</span> between<br />
            users and technology.
          </h2>

          <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6 font-light leading-loose text-lg">
            {profile.description.map((desc, index) => (
              <p key={index}>{desc}</p>
            ))}
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12">
            {/* Education */}
            <div>
              <h3 className="museum-label text-base mb-4 border-b border-gray-200 dark:border-zinc-800 pb-1 inline-block">
                Education
              </h3>
              <ul className="space-y-6">
                {education.map((edu, index) => (
                  <li key={index} className="grid grid-cols-[1fr_auto] gap-4">
                    <div>
                      <span className="block font-medium text-lg text-black dark:text-white">{edu.school}</span>
                      {edu.desc && <span className="block text-gray-500 dark:text-gray-400 mt-1 font-light">{edu.desc}</span>}
                    </div>
                    <span className="text-sm text-gray-400 tabular-nums">{edu.period}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Awards */}
            <div>
              <h3 className="museum-label text-base mb-4 border-b border-gray-200 dark:border-zinc-800 pb-1 inline-block">
                Awards & Certificates
              </h3>
              <ul className="space-y-4">
                {awards.map((award, index) => (
                  <li key={index} className="grid grid-cols-[1fr_auto] gap-4">
                    <span className="text-black dark:text-white font-light">{award.title}</span>
                    {award.date && <span className="text-sm text-gray-400 tabular-nums">{award.date}</span>}
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
