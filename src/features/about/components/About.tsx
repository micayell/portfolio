import Image from "next/image";
import { profile } from "@/features/about/data/about"; // 데이터 import
import { getImagePath } from "@/features/common/lib/utils";
import { Mail, BookText } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import ChatInput from "@/features/chat/components/ChatInput";
import ContactModal from "@/features/about/components/ContactModal";
import { useState } from "react";

interface AboutProps {
  onSendMessage?: (message: string) => void;
  profileImageUrl?: string;
}

export default function About({ onSendMessage, profileImageUrl }: AboutProps) {
  const [showContactModal, setShowContactModal] = useState(false);

  const quickQuestions = [
    "가장 자신 있는 프로젝트는?",
    "기술 스택은?",
    "경력 알려줘",
  ];

  const socialLinks = [
    {
      href: profile.github,
      title: "Github",
      icon: <FaGithub size={24} />,
    },
    {
      href: profile.blog,
      title: "Blog",
      icon: <BookText size={24} strokeWidth={1.5} />,
    },
    {
      href: profile.linkedin,
      title: "LinkedIn",
      icon: <FaLinkedin size={24} />,
    },
  ];

  const commonLinkClasses = "text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-white transition-colors p-2 hover:scale-110 transform duration-200 cursor-pointer";

  return (
    <section id="about" className="py-12 md:py-20 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row gap-12 md:gap-16 items-start">

        {/* 1. 프로필 이미지 영역 - 액자 스타일 */}
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="relative w-2/3 max-w-[280px] md:w-full md:max-w-none aspect-[3/4] bg-gray-100 dark:bg-zinc-800 p-3 md:p-4 shadow-sm">
            <div className="relative w-full h-full overflow-hidden">
              <Image
                src={profileImageUrl || getImagePath("/images/profile.jpg")}
                alt={profile.name}
                fill
                sizes="(max-width: 768px) 66vw, 33vw"
                className="object-cover transition-all duration-500"
              />
            </div>
          </div>

          <div className="w-full mt-6 flex justify-center gap-6">
            <button
              onClick={() => setShowContactModal(true)} // Contact 버튼은 모달을 열어야 하므로 별도로 둡니다.
              className={commonLinkClasses}
              title="Contact"
            >
              <Mail size={24} strokeWidth={1.5} />
            </button>
            {socialLinks.map((link) => (
              <a
                key={link.title}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className={commonLinkClasses}
                title={link.title}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        {/* 2. 채팅 입력 필드 */}
        <div className="flex-1 w-full">
          <h2 className="text-3xl md:text-5xl font-light mb-8 md:mb-10 leading-tight tracking-tight">
            <span className="block text-base md:text-lg text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-widest font-normal">
              Engineer&apos;s Philosophy
            </span>
            I build digital experiences<br />
            that bridge <span className="font-normal italic">gap</span> between<br />
            users and technology.
          </h2>

          <ChatInput onSendMessage={onSendMessage || (() => {})} quickQuestions={quickQuestions} />
        </div>
      </div>

      <ContactModal isOpen={showContactModal} onClose={() => setShowContactModal(false)} />
    </section>
  );
}
